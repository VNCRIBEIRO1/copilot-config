# Ollama Deployment — jurema-7b

Deploy, monitoramento e operação do modelo jurema-7b via Ollama.

---

## 1. Importar GGUF no Ollama

### Opção A: Criar a partir de Modelfile (recomendado)

```bash
# 1. Copiar o GGUF para o diretório do Modelfile
cp outputs/jurema-7b-gguf/unsloth.Q4_K_M.gguf ./jurema-7b.Q4_K_M.gguf

# 2. Criar Modelfile (ver references/modelfile-template.md)

# 3. Build
ollama create jurema-7b -f Modelfile

# 4. Verificar
ollama list
# NAME          ID          SIZE     MODIFIED
# jurema-7b     abc123...   4.4 GB   just now
```

### Opção B: Importar GGUF diretamente

```bash
# Se não quiser customizar via Modelfile:
ollama create jurema-7b --file jurema-7b.Q4_K_M.gguf
```

### Opção C: Importar adapter Safetensors (LoRA)

```bash
# Se exportou como Safetensors adapter em vez de GGUF:
# 1. Criar Modelfile com ADAPTER
cat > Modelfile << 'EOF'
FROM qwen2.5:7b
ADAPTER ./outputs/jurema-7b-lora
EOF

# 2. Build
ollama create jurema-7b -f Modelfile
```

---

## 2. Testar

```bash
# Teste rápido
ollama run jurema-7b "Oi, preciso de ajuda com minha aposentadoria"

# Teste com system prompt
ollama run jurema-7b --system "Você é a assistente de triagem. Responda em JSON." \
  "Meu benefício do INSS foi negado"

# Teste via API (como o backend faz)
curl http://localhost:11434/api/chat -d '{
  "model": "jurema-7b",
  "messages": [
    {"role": "system", "content": "Triagem. Responda em JSON."},
    {"role": "user", "content": "Quero me aposentar por tempo de contribuição"}
  ],
  "stream": false,
  "options": {"temperature": 0.3, "num_ctx": 4096}
}'
```

---

## 3. Integração com Backend

O backend já está preparado. Configurar no `.env`:

```env
AI_PROVIDER=ollama
OLLAMA_MODEL=jurema-7b
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_TIMEOUT=120000
```

O provider Ollama em `backend/src/services/aiProvider.js` faz:
1. `POST /api/chat` para `chat()`, `classifyIntent()`, `triageChat()`
2. Fallback automático para stub se Ollama estiver offline
3. Parse de JSON robusto com 4 fallbacks (direto, code block, regex, texto puro)

---

## 4. Docker Compose (Produção)

```yaml
# Adicionar ao docker-compose.yml existente
services:
  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    restart: unless-stopped
    ports:
      - "11434:11434"
    volumes:
      - ollama-data:/root/.ollama
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    # Para CPU-only, remover bloco deploy e adicionar:
    # environment:
    #   - OLLAMA_NUM_GPU=0

volumes:
  ollama-data:
```

### Carregar modelo no container

```bash
# Copiar GGUF e Modelfile para dentro do container
docker cp jurema-7b.Q4_K_M.gguf ollama:/tmp/
docker cp Modelfile ollama:/tmp/

# Criar modelo
docker exec ollama ollama create jurema-7b -f /tmp/Modelfile
```

---

## 5. Monitoramento

### Health check

```bash
# Verificar se Ollama está rodando
curl -s http://localhost:11434/api/tags | jq '.models[] | {name, size}'

# Verificar modelo específico
curl -s http://localhost:11434/api/show -d '{"name": "jurema-7b"}' | jq '{modelfile, parameters}'
```

### Métricas de performance

```bash
# Tempo de resposta (single request)
time curl -s http://localhost:11434/api/chat -d '{
  "model": "jurema-7b",
  "messages": [{"role": "user", "content": "Oi"}],
  "stream": false
}' | jq '.eval_duration, .eval_count'

# Tokens/segundo = eval_count / (eval_duration / 1e9)
```

### Logs do Ollama

```bash
# Logs em tempo real
# Linux/WSL:
journalctl -u ollama -f

# Docker:
docker logs -f ollama

# Windows (Ollama app):
# Verificar %LOCALAPPDATA%\Ollama\logs\
```

---

## 6. Atualizar Modelo

Quando tiver uma nova versão do GGUF:

```bash
# 1. Remover versão anterior
ollama rm jurema-7b

# 2. Atualizar GGUF no Modelfile (FROM path)
# 3. Recriar
ollama create jurema-7b -f Modelfile

# 4. Testar
ollama run jurema-7b "Teste rápido"

# 5. Restart do backend (para limpar cache)
cd backend && npm run dev
```

---

## 7. Troubleshooting

| Problema | Solução |
|----------|---------|
| `Error: model not found` | Verificar `ollama list`, nome deve ser exatamente `jurema-7b` |
| Resposta lenta (>30s) | Verificar se GPU está ativa: `nvidia-smi`. Se CPU-only, resposta 3-5x mais lenta |
| CUDA out of memory | Fechar outras aplicações GPU. Ou usar Q4_K_S (menor, ~3.8 GB) |
| Backend fallback para stub | Ollama não está rodando ou porta 11434 não acessível |
| Modelo responde em inglês | SYSTEM prompt em pt-BR está faltando no Modelfile |
| JSON malformado na triagem | Verificar se TEMPLATE no Modelfile é compatível com o modelo base |
| `connection refused` no Docker | Verificar se porta 11434 está mapeada e Ollama está healthy |

---

## 8. Modelfile Parameters Reference

| Parâmetro | Default | Recomendado jurema-7b | Descrição |
|-----------|---------|----------------------|-----------|
| `temperature` | 0.8 | **0.3** | Criatividade. Baixo = mais preciso para triagem |
| `top_p` | 0.9 | **0.9** | Nucleus sampling |
| `top_k` | 40 | 40 | Top-K sampling |
| `num_ctx` | 2048 | **4096** | Context window. Triagem longa precisa de mais |
| `repeat_penalty` | 1.1 | **1.1** | Evita repetição |
| `num_predict` | 128 | **512** | Max tokens na resposta |
| `stop` | — | `<\|im_end\|>` | Stop token (ChatML) |
| `seed` | — | — | Fixar para reprodutibilidade em testes |
