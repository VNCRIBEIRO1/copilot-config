---
description: "Use when: fine-tuning open source LLM, training local model, creating WhatsApp chatbot with LLM, direito previdenciário chatbot, LoRA QLoRA fine-tune, Ollama local inference, WhatsApp Business API integration, dataset preparation for legal domain, GGUF quantization, Phi-3 fine-tuning."
---
# Fine-Tuning LLM Local + Chatbot WhatsApp Business API

Fluxo completo para fine-tunar um LLM open source em direito previdenciário brasileiro
e integrar com WhatsApp Business API (oficial Meta).

## Contexto de Hardware

- **Máquina local**: i5-4210U, 8GB RAM, sem GPU
- **Treino**: OBRIGATÓRIO usar Google Colab (free T4 GPU) ou cloud equivalente
- **Inferência local**: Ollama com modelo quantizado GGUF (Q4_K_M ≈ 2.3GB RAM)
- **Modelo base**: `microsoft/Phi-3-mini-4k-instruct` (3.8B params)

## Estrutura do Projeto

```
chatbot-previdenciario/
├── data/                        # Dados e datasets
│   ├── raw/                     # Fontes brutas (PDFs, HTMLs, textos)
│   ├── processed/               # Textos limpos
│   ├── dataset/                 # Dataset final JSONL para fine-tuning
│   │   ├── train.jsonl
│   │   └── val.jsonl
│   └── scripts/                 # Scripts de coleta e processamento
│       ├── scrape-sources.py    # Coleta de fontes jurídicas
│       ├── pdf-to-text.py       # Extração de texto de PDFs
│       ├── prepare-dataset.py   # Geração de pares Q&A
│       └── validate-dataset.py  # Validação e split
├── training/                    # Notebooks e configs de treino
│   ├── finetune-phi3.ipynb      # Notebook para Google Colab
│   ├── training-config.yaml     # Hiperparâmetros
│   └── merge-and-export.ipynb   # Merge LoRA + export GGUF
├── inference/                   # Servidor de inferência local
│   ├── Modelfile                # Ollama Modelfile
│   ├── test-inference.py        # Script de teste
│   └── benchmark.py             # Benchmark de latência
├── api/                         # API bridge (FastAPI)
│   ├── main.py                  # FastAPI app
│   ├── llm_client.py            # Cliente Ollama
│   ├── whatsapp.py              # Webhook WhatsApp Business API
│   ├── conversation.py          # Gerenciamento de contexto/sessão
│   ├── guardrails.py            # Filtros de segurança e limites
│   ├── requirements.txt
│   └── .env.example
├── tests/                       # Testes
│   ├── test_llm.py
│   ├── test_whatsapp.py
│   └── test_guardrails.py
├── docker-compose.yml           # Deploy (Ollama + API)
├── .env.example
└── README.md
```

---

## ETAPA 1: Ambiente Local (Python + Ollama)

### 1.1 Setup Python
```bash
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install --upgrade pip
pip install requests beautifulsoup4 PyPDF2 pdfplumber tiktoken fastapi uvicorn python-dotenv httpx
```

### 1.2 Instalar Ollama
- Download: https://ollama.com/download/windows
- Verificar: `ollama --version`
- Testar modelo base: `ollama run phi3:mini`
- Ollama roda na porta `http://localhost:11434`

---

## ETAPA 2: Coleta de Dados — Direito Previdenciário

### 2.1 Fontes Jurídicas Públicas (scraping permitido)
| Fonte | URL | Conteúdo |
|-------|-----|----------|
| Planalto (legislação) | planalto.gov.br | Lei 8.213/91, Lei 8.212/91, Decreto 3.048/99 |
| INSS (normas) | gov.br/inss | IN PRES/INSS, manuais de procedimentos |
| JusBrasil (jurisprudência) | jusbrasil.com.br | Decisões TNU, TRF, STJ previdenciárias |
| STJ (jurisprudência) | scon.stj.jus.br | Súmulas, repetitivos previdenciários |
| TST (quando aplicável) | tst.jus.br | Contribuições previdenciárias trabalhistas |
| CJF (TNU) | cjf.jus.br/turma-nacional | Pedidos de Uniformização |
| Doutrina aberta | Sites jurídicos, artigos acadêmicos | Comentários à Lei 8.213 |

### 2.2 Tipos de Dados para Coletar
- **Legislação**: texto integral das leis, decretos, instruções normativas
- **Jurisprudência**: ementas e trechos relevantes de decisões
- **Doutrina**: artigos, comentários, manuais explicativos
- **Q&A reais**: perguntas frequentes de segurados (sites INSS, fóruns)
- **Simulações**: cenários de aposentadoria, BPC/LOAS, auxílio-doença

### 2.3 Volume Mínimo Recomendado
- **500-2000 pares Q&A** de qualidade para fine-tuning efetivo com LoRA
- Priorizar qualidade sobre quantidade
- Cada par deve ter: pergunta natural + resposta completa com fundamento legal

---

## ETAPA 3: Preparação do Dataset

### 3.1 Formato JSONL (Chat Template Phi-3)
```jsonl
{"messages": [{"role": "system", "content": "Você é um assistente especializado em direito previdenciário brasileiro. Responda com base na legislação vigente (Lei 8.213/91, Decreto 3.048/99) e jurisprudência consolidada. Sempre cite o fundamento legal."}, {"role": "user", "content": "Quais são os requisitos para aposentadoria por idade?"}, {"role": "assistant", "content": "Conforme o art. 48 da Lei 8.213/91, a aposentadoria por idade requer: (1) idade mínima de 65 anos para homens e 62 anos para mulheres (após EC 103/2019); (2) carência de 180 contribuições mensais (art. 25, II). Para segurados que já contribuíam antes da reforma, existem regras de transição previstas no art. 18 da EC 103/2019."}]}
```

### 3.2 Categorias de Perguntas (distribuir uniformemente)
- Aposentadorias (idade, tempo de contribuição, especial, rural, PcD)
- Benefícios por incapacidade (auxílio-doença, aposentadoria por invalidez)
- Pensão por morte e auxílio-reclusão
- BPC/LOAS
- Salário-maternidade e salário-família
- Contribuições (tipos de segurado, alíquotas, GPS)
- Regras de transição (EC 103/2019 — Reforma da Previdência)
- CTC (Certidão de Tempo de Contribuição)
- Procedimentos administrativos INSS
- Ações judiciais previdenciárias (competência, prazos, perícia)

### 3.3 Validação do Dataset
- Sem dados pessoais reais (LGPD)
- Verificar fundamentação legal atualizada
- Balancear categorias (evitar viés)
- Split: 90% train / 10% validation
- Validar tokenização: cada exemplo < 2048 tokens (Phi-3 4k context)

---

## ETAPA 4: Fine-Tuning com LoRA (Google Colab)

### 4.1 Bibliotecas no Colab
```python
!pip install -q transformers datasets peft bitsandbytes trl accelerate torch
```

### 4.2 Configuração de Treino (QLoRA 4-bit)
```python
from peft import LoraConfig
from trl import SFTTrainer, SFTConfig
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
import torch

# Quantização 4-bit para caber na T4 (16GB VRAM)
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16,
    bnb_4bit_use_double_quant=True,
)

model_id = "microsoft/Phi-3-mini-4k-instruct"
model = AutoModelForCausalLM.from_pretrained(
    model_id, quantization_config=bnb_config, device_map="auto"
)
tokenizer = AutoTokenizer.from_pretrained(model_id)

# LoRA config
lora_config = LoraConfig(
    r=16,                    # Rank — 16 é bom equilíbrio
    lora_alpha=32,           # Alpha = 2x rank
    lora_dropout=0.05,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj",
                     "gate_proj", "up_proj", "down_proj"],
    task_type="CAUSAL_LM",
)

# Treino
training_config = SFTConfig(
    output_dir="./phi3-previdenciario-lora",
    num_train_epochs=3,
    per_device_train_batch_size=2,
    gradient_accumulation_steps=4,
    learning_rate=2e-4,
    lr_scheduler_type="cosine",
    warmup_ratio=0.1,
    logging_steps=10,
    save_strategy="epoch",
    bf16=True,
    max_seq_length=2048,
)

trainer = SFTTrainer(
    model=model,
    args=training_config,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
    peft_config=lora_config,
    tokenizer=tokenizer,
)
trainer.train()
```

### 4.3 Hiperparâmetros Recomendados
| Param | Valor | Nota |
|-------|-------|------|
| epochs | 3-5 | Monitorar val_loss para early stopping |
| batch_size | 2 | Com grad_accum=4 → effective batch=8 |
| learning_rate | 2e-4 | Padrão QLoRA |
| LoRA rank | 16 | Aumentar para 32 se underfitting |
| max_seq_length | 2048 | Phi-3 mini suporta 4k, mas 2k é suficiente |

### 4.4 Tempo Estimado (Colab T4)
- 1000 exemplos, 3 epochs ≈ 30-60 min
- 2000 exemplos, 3 epochs ≈ 1-2 horas

---

## ETAPA 5: Export e Quantização GGUF

### 5.1 Merge LoRA + Export (no Colab)
```python
from peft import PeftModel

# Merge LoRA weights no modelo base
base_model = AutoModelForCausalLM.from_pretrained(model_id, torch_dtype=torch.float16)
merged_model = PeftModel.from_pretrained(base_model, "./phi3-previdenciario-lora/checkpoint-best")
merged_model = merged_model.merge_and_unload()
merged_model.save_pretrained("./phi3-previdenciario-merged")
tokenizer.save_pretrained("./phi3-previdenciario-merged")
```

### 5.2 Converter para GGUF (llama.cpp)
```bash
# No Colab ou máquina com mais RAM
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
pip install -r requirements.txt
python convert_hf_to_gguf.py ../phi3-previdenciario-merged --outtype f16
# Quantizar para Q4_K_M (≈2.3GB, roda em 8GB RAM)
./llama-quantize phi3-previdenciario-merged-f16.gguf phi3-previdenciario-Q4_K_M.gguf Q4_K_M
```

### 5.3 Download do Modelo (Colab → Local)
```python
# No Colab: zipar e baixar
!zip -r phi3-previdenciario-Q4_K_M.zip phi3-previdenciario-Q4_K_M.gguf
from google.colab import files
files.download('phi3-previdenciario-Q4_K_M.zip')
```

---

## ETAPA 6: Inferência Local com Ollama

### 6.1 Modelfile
```dockerfile
FROM ./phi3-previdenciario-Q4_K_M.gguf

PARAMETER temperature 0.3
PARAMETER top_p 0.9
PARAMETER top_k 40
PARAMETER num_ctx 2048
PARAMETER repeat_penalty 1.1

SYSTEM """Você é um assistente jurídico especializado em direito previdenciário brasileiro.
Responda com base na legislação vigente (Lei 8.213/91, Lei 8.212/91, Decreto 3.048/99, EC 103/2019) e jurisprudência consolidada.
Sempre cite o fundamento legal aplicável.
Se não souber a resposta, diga que não tem certeza e recomende consultar um advogado previdenciarista.
Nunca invente artigos de lei ou jurisprudência inexistente."""
```

### 6.2 Criar modelo no Ollama
```bash
ollama create previdenciario -f ./Modelfile
ollama run previdenciario "Quais os requisitos do BPC/LOAS?"
```

### 6.3 API Ollama (REST)
```bash
curl http://localhost:11434/api/chat -d '{
  "model": "previdenciario",
  "messages": [{"role": "user", "content": "O que mudou na aposentadoria com a reforma de 2019?"}],
  "stream": false
}'
```

---

## ETAPA 7: API Bridge (FastAPI)

### 7.1 Estrutura da API
```python
# api/main.py
from fastapi import FastAPI, Request, HTTPException
from .llm_client import query_llm
from .whatsapp import verify_webhook, process_message, send_reply
from .guardrails import check_input, check_output

app = FastAPI()

@app.get("/webhook")
async def verify(request: Request):
    """Verificação do webhook Meta (GET)"""
    return verify_webhook(request)

@app.post("/webhook")
async def receive_message(request: Request):
    """Recebe mensagens do WhatsApp (POST)"""
    body = await request.json()
    message = process_message(body)
    if not message:
        return {"status": "ok"}

    # Guardrails de entrada
    safe_input = check_input(message.text)
    if not safe_input.is_safe:
        await send_reply(message.phone, safe_input.rejection_message)
        return {"status": "filtered"}

    # Query LLM
    response = await query_llm(message.phone, safe_input.text)

    # Guardrails de saída
    safe_output = check_output(response)

    await send_reply(message.phone, safe_output)
    return {"status": "ok"}
```

### 7.2 Cliente Ollama
```python
# api/llm_client.py
import httpx
from .conversation import ConversationManager

conv_manager = ConversationManager()
OLLAMA_URL = "http://localhost:11434/api/chat"

async def query_llm(phone: str, user_message: str) -> str:
    messages = conv_manager.get_context(phone)
    messages.append({"role": "user", "content": user_message})

    async with httpx.AsyncClient(timeout=120.0) as client:
        resp = await client.post(OLLAMA_URL, json={
            "model": "previdenciario",
            "messages": messages,
            "stream": False,
        })
    result = resp.json()["message"]["content"]
    conv_manager.add_exchange(phone, user_message, result)
    return result
```

---

## ETAPA 8: WhatsApp Business API (Oficial Meta)

### 8.1 Pré-requisitos
1. Conta Meta Business (business.facebook.com)
2. App no Meta Developers (developers.facebook.com)
3. Ativar produto "WhatsApp" no app
4. Número de telefone verificado
5. Token de acesso permanente (System User Token)

### 8.2 Configuração do Webhook
- URL: `https://seu-dominio.com/webhook` (precisa HTTPS público)
- Verify Token: definir no `.env`
- Subscribir eventos: `messages`

### 8.3 Envio de Mensagens
```python
# api/whatsapp.py
import httpx, os

WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
VERIFY_TOKEN = os.getenv("WHATSAPP_VERIFY_TOKEN")
META_API = f"https://graph.facebook.com/v21.0/{PHONE_NUMBER_ID}/messages"

async def send_reply(to: str, text: str):
    # WhatsApp limita mensagens a 4096 chars
    chunks = [text[i:i+4096] for i in range(0, len(text), 4096)]
    async with httpx.AsyncClient() as client:
        for chunk in chunks:
            await client.post(META_API, headers={
                "Authorization": f"Bearer {WHATSAPP_TOKEN}",
                "Content-Type": "application/json",
            }, json={
                "messaging_product": "whatsapp",
                "to": to,
                "type": "text",
                "text": {"body": chunk},
            })
```

### 8.4 Exposição HTTPS (dev local)
- **ngrok**: `ngrok http 8000` → URL pública temporária para dev
- **Produção**: VPS com Nginx + Let's Encrypt, ou deploy Render/Railway

---

## ETAPA 9: Guardrails e Segurança

### 9.1 Regras Obrigatórias
- Disclaimer: "Este chatbot fornece informações gerais. Para casos específicos, consulte um advogado."
- Não fornecer pareceres jurídicos vinculantes
- Não coletar/armazenar dados sensíveis (CPF, dados médicos) — LGPD
- Rate limiting por número (max 20 msgs/min)
- Filtro de prompt injection no input
- Filtro de alucinação no output (verificar se cita artigos reais)
- Timeout de sessão (limpar contexto após 30min de inatividade)

### 9.2 Métricas para Monitorar
- Latência de resposta (target: < 10s na máquina local)
- Taxa de respostas filtradas por guardrails
- Feedback do usuário (👍/👎)
- Tokens consumidos por sessão

---

## ETAPA 10: Deploy Produção

### 10.1 Docker Compose
```yaml
services:
  ollama:
    image: ollama/ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama-data:/root/.ollama
    deploy:
      resources:
        limits:
          memory: 4G

  api:
    build: ./api
    ports:
      - "8000:8000"
    env_file: .env
    depends_on:
      - ollama

volumes:
  ollama-data:
```

### 10.2 Opções de Hospedagem (CPU, custo baixo)
| Opção | Custo | RAM | Nota |
|-------|-------|-----|------|
| VPS Hetzner CX32 | ~€7/mês | 8GB | Melhor custo-benefício Europa |
| Oracle Cloud Free | Grátis | 24GB ARM | Ampere A1, excelente para Ollama |
| Render | ~$7/mês | 2GB | Limitado, só modelos muito pequenos |
| Máquina local + ngrok | Grátis | 8GB | Apenas dev/teste |

---

## Checklist de Validação

- [ ] Dataset com ≥500 pares Q&A validados por especialista (ideal)
- [ ] Fine-tuning completo em Colab com val_loss convergindo
- [ ] Modelo GGUF Q4_K_M rodando no Ollama local
- [ ] Latência < 10s por resposta (2048 tokens context)
- [ ] FastAPI respondendo webhook corretamente
- [ ] WhatsApp Business API verificado e conectado
- [ ] Guardrails de entrada e saída funcionando
- [ ] Disclaimer automático na primeira mensagem
- [ ] Rate limiting ativo
- [ ] Testes end-to-end (enviar mensagem real no WhatsApp → receber resposta)
