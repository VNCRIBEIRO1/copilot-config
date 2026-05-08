---
description: >
  Treina, fine-tuna e deploya o modelo jurema-7b — LLM especializado em Direito Previdenciário
  e Direitos PCD para o escritório Dra. Luciana Pinho. Cobre: preparação de dataset (ShareGPT/ChatML),
  fine-tuning via Unsloth QLoRA, exportação GGUF, criação de Ollama Modelfile, deploy local,
  avaliação e iteração. Use when: treinar jurema, fine-tune jurema, criar dataset jurídico,
  dataset triagem, exportar GGUF, Ollama Modelfile, treinar modelo local, jurema-7b,
  modelo previdenciário, dataset advogada, dataset PCD, legal fine-tune, preparar dados triagem,
  LoRA adapter, QLoRA training, deploy Ollama, avaliar modelo jurídico, melhorar jurema,
  criar modelo ollama, train legal model, dataset whatsapp bot.
tools: [read, search, web, edit, execute, todo]
---

# Skill: jurema-7b-trainer

Treina e implanta o modelo **jurema-7b** — um LLM 7B fine-tunado para o escritório da Dra. Luciana de Jesus Ribeiro Pinho (OAB/MT 7973-B), especialista em Direito Previdenciário, Direitos PCD e Direito Cível.

## Contexto do Projeto

| Item | Valor |
|------|-------|
| **Modelo alvo** | jurema-7b (local via Ollama) |
| **Base recomendada** | Qwen 2.5 7B Instruct ou Llama 3.1 8B Instruct |
| **Quantização** | Q4_K_M (~4.4 GB) para produção, Q8_0 para avaliação |
| **Hardware mínimo** | GPU 6 GB VRAM **ou** CPU com 12 GB RAM |
| **Disco** | ~10 GB (modelo + dados) |
| **Ollama serve** | `http://localhost:11434` |
| **Projeto backend** | `backend/src/services/aiProvider.js` + `backend/src/config/KNOWLEDGE_BASE.md` |
| **Domínio** | Direito Previdenciário (11 subtipos), Direitos PCD (8 subtipos), Cível complementar |

## Dependências de Skills

| Skill | Uso nesta workflow |
|-------|--------------------|
| `direito-brasileiro` | Legislação de referência (Lei 8.213/91, Lei 13.146/2015, EC 103/2019, Lei 12.764/2012) |
| `copywriting-persuasion` | Tom de voz acolhedor, empático, linguagem simples pt-BR |

---

## FASE 0 — Pré-requisitos

Antes de tudo, verifique:

```bash
# Hardware
node scripts/check-hardware.js

# Ollama instalado
ollama --version

# Python + Unsloth (para fine-tuning)
python --version   # 3.10+
pip show unsloth    # se não tiver: pip install unsloth
```

Para GPU NVIDIA: CUDA 11.8+ e driver 525+. Se CPU-only, ajustar `OLLAMA_NUM_GPU=0`.

---

## FASE 1 — Preparação do Dataset

O dataset é a parte MAIS importante. Qualidade > quantidade.

### 1.1 Fontes de dados do projeto

Extraia dados de conversação dessas fontes:

| Fonte | Caminho | Conteúdo |
|-------|---------|----------|
| **KNOWLEDGE_BASE.md** | `backend/src/config/KNOWLEDGE_BASE.md` | 10 seções: perfil, áreas, tipos de caso, documentos, assinaturas, fluxo, sistema, regras IA, FAQ |
| **aiProvider.js** | `backend/src/services/aiProvider.js` | System prompts (BASE_SYSTEM_PROMPT, buildTriageSystemPrompt, buildClassifyPrompt, buildCaseAnalysisPrompt), regras de extração, stub responses |
| **caseRequirements.js** | `backend/src/config/caseRequirements.js` | Requisitos documentais por tipo de caso |
| **Testes** | `backend/tests/ai-flow-test.js` | 95 cenários de conversa ponta-a-ponta |
| **Testes** | `backend/tests/wpp-delivery-test.js` | 56 cenários de pipeline de mensagens |

### 1.2 Formato do Dataset

Usar formato **ChatML** (padrão do Unsloth e Ollama):

```json
{
  "messages": [
    {"role": "system", "content": "<system prompt da triagem>"},
    {"role": "user", "content": "Oi, preciso de ajuda com minha aposentadoria"},
    {"role": "assistant", "content": "Oi! 😊 Claro, posso te ajudar! Me conta: você quer se aposentar por idade ou por tempo de contribuição?"},
    {"role": "user", "content": "Por tempo de contribuição, tenho 32 anos de carteira assinada"},
    {"role": "assistant", "content": "{\"message\": \"Entendi! 32 anos de contribuição é bastante 💪 Pra eu entender melhor, você é homem ou mulher? E sabe me dizer sua idade?\", \"extracted\": {\"area\": \"previdenciario\", \"tipo_caso\": \"aposentadoria_tempo\", \"tempo_contribuicao\": \"32 anos\"}, \"phase\": \"case_info\"}"}
  ]
}
```

### 1.3 Categorias de exemplos necessários

Gere exemplos para CADA cenário abaixo. Mínimo **100 exemplos total**, ideal **500+**:

#### A. Triagem Conversacional (prioridade máxima — 60% do dataset)

Para cada um dos 19 tipos de caso (11 previdenciário + 8 PCD):
- 3-5 conversas completas (welcome → case_info → personal_data → complete)
- Variações de linguagem coloquial vs formal
- Casos com dados incompletos / respostas confusas
- Extrações de CPF, RG, telefone, endereço em formatos variados

**Campos de extração (TRIAGE_FIELDS):**
```
case_info: area, tipo_caso, tempo_contribuicao, detalhes, documentos, descricao_livre
personal_data: client_name, cpf, rg, telefone_contato, rua, numero
```

**Valores válidos:**
- area: `previdenciario`, `direitos_pcd`
- tipo_caso prev: `aposentadoria_tempo`, `aposentadoria_idade`, `aposentadoria_invalidez`, `aposentadoria_especial`, `aposentadoria_rural`, `auxilio_doenca`, `bpc_loas`, `pensao_morte`, `revisao_beneficio`, `planejamento_prev`, `outro_previdenciario`
- tipo_caso PCD: `bpc_loas_pcd`, `inclusao_escolar`, `cotas_pcd`, `acessibilidade`, `isencao_fiscal`, `combate_capacitismo`, `autismo_direitos`, `outro_pcd`
- documentos: `doc_cnis`, `doc_ctps`, `doc_laudos_med`, `doc_guias_inss`, `doc_carta_inss`, `doc_certidao_obito`, `doc_ppp`, `doc_laudo_deficiencia`, `doc_carteirinha_pcd`, `doc_comprovante_renda`, `doc_outros_prev`, `doc_outros_pcd`, `doc_nenhum`

#### B. Classificação de Intenção (15% do dataset)

Pares: mensagem → categoria (`triagem`, `duvida`, `agendamento`, `atendente`, `saudacao`, `geral`)

```json
{"messages": [
  {"role": "system", "content": "Classifique a intenção. Responda APENAS com a categoria."},
  {"role": "user", "content": "Quero saber se tenho direito a BPC"},
  {"role": "assistant", "content": "triagem"}
]}
```

#### C. Dúvidas Jurídicas (15% do dataset)

Perguntas sobre:
- Tipos de aposentadoria e requisitos
- BPC/LOAS (renda, documentos, CadÚnico)
- Direitos PCD (Lei 13.146/2015, CIPTEA, cotas, isenções)
- Documentos necessários por tipo de caso
- Prazos (decadencial 10 anos, prescrição 5 anos)
- Reforma da Previdência (EC 103/2019)

#### D. Análise de Caso (10% do dataset)

Recebe dados de triagem completa → gera resumo + direitos + documentos + próximos passos.

### 1.4 Geração Sintética de Dados

Use um LLM maior (Groq Llama 3.3 70B ou GPT-4) para gerar conversas:

```
Prompt para gerar dados sintéticos:

Você vai gerar conversas realistas entre um cliente e a assistente virtual 
do escritório da Dra. Luciana Pinho (advogada previdenciarista, OAB/MT 7973-B).

O formato é ChatML com roles: system, user, assistant.

A assistente deve:
- Falar como amiga simpática, não como robô
- Usar palavras simples (NÃO: "solicitação", "prosseguir", "fornecer")
- Respostas CURTAS: 2-3 linhas
- Usar 1-2 emojis por mensagem
- Confirmar o que entendeu antes de perguntar mais
- Perguntar UMA coisa por vez

Gere 5 conversas completas de triagem para o tipo de caso: [TIPO]
Cada conversa deve ter 8-15 turnos e coletar: area, tipo_caso, detalhes, 
documentos, client_name, cpf, rg, telefone, rua, numero.

O assistant responde em JSON: {"message": "...", "extracted": {...}, "phase": "..."}
```

### 1.5 Script de preparação

Crie `backend/scripts/prepare-training-data.js` que:
1. Lê KNOWLEDGE_BASE.md e extrai Q&A de cada seção
2. Lê aiProvider.js e extrai pares input/output do stubProvider
3. Lê testes e extrai cenários como conversas
4. Combina tudo em `dataset/jurema-training.jsonl` (formato ChatML)
5. Divide 90/10 em train/eval

Consulte `references/dataset-preparation.md` para templates detalhados.

---

## FASE 2 — Fine-tuning com Unsloth

### 2.1 Ambiente

```bash
# Google Colab (grátis, GPU T4)
# OU local com GPU 6+ GB VRAM

pip install unsloth
pip install "unsloth[colab-new] @ git+https://github.com/unslothai/unsloth.git"
```

### 2.2 Script de treino

Consulte `references/fine-tuning-guide.md` para o notebook completo. Resumo:

```python
from unsloth import FastLanguageModel
import torch

# 1. Carregar modelo base (QLoRA 4-bit)
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="unsloth/Qwen2.5-7B-Instruct-bnb-4bit",  # ou llama-3.1-8b
    max_seq_length=4096,
    dtype=None,
    load_in_4bit=True,
)

# 2. Adicionar adaptador LoRA
model = FastLanguageModel.get_peft_model(
    model,
    r=16,                    # rank — 16 é bom equilíbrio
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj",
                    "gate_proj", "up_proj", "down_proj"],
    lora_alpha=16,
    lora_dropout=0,
    bias="none",
    use_gradient_checkpointing="unsloth",
    random_state=3407,
)

# 3. Preparar dataset
from unsloth.chat_templates import get_chat_template
tokenizer = get_chat_template(tokenizer, chat_template="chatml")

from datasets import load_dataset
dataset = load_dataset("json", data_files="dataset/jurema-training.jsonl", split="train")

def formatting_func(examples):
    convos = examples["messages"]
    texts = [tokenizer.apply_chat_template(
        convo, tokenize=False, add_generation_prompt=False
    ) for convo in convos]
    return {"text": texts}

dataset = dataset.map(formatting_func, batched=True)

# 4. Treinar
from trl import SFTTrainer
from transformers import TrainingArguments

trainer = SFTTrainer(
    model=model,
    tokenizer=tokenizer,
    train_dataset=dataset,
    dataset_text_field="text",
    max_seq_length=4096,
    dataset_num_proc=2,
    packing=False,
    args=TrainingArguments(
        per_device_train_batch_size=2,
        gradient_accumulation_steps=4,
        warmup_steps=5,
        num_train_epochs=3,        # 1-3 épocas; evitar overfitting
        learning_rate=2e-4,
        fp16=not torch.cuda.is_bf16_supported(),
        bf16=torch.cuda.is_bf16_supported(),
        logging_steps=1,
        optim="adamw_8bit",
        weight_decay=0.01,
        lr_scheduler_type="linear",
        seed=3407,
        output_dir="outputs",
    ),
)

trainer_stats = trainer.train()

# 5. Exportar GGUF para Ollama
model.save_pretrained_gguf(
    "jurema-7b-gguf",
    tokenizer,
    quantization_method="q4_k_m",  # ~4.4 GB, melhor equilíbrio qualidade/tamanho
)
```

### 2.3 Hiperparâmetros recomendados

| Parâmetro | Valor | Nota |
|-----------|-------|------|
| `r` (LoRA rank) | 16 | Aumentar para 32 se perda estiver alta |
| `lora_alpha` | 16 | Normalmente igual a r |
| `learning_rate` | 2e-4 | Reduzir para 5e-5 se overfitting |
| `num_train_epochs` | 2-3 | Monitorar eval loss — parar se subir |
| `max_seq_length` | 4096 | Conversas de triagem são longas |
| `per_device_train_batch_size` | 2 | Com gradient_accumulation=4, batch efetivo=8 |
| `quantization` | Q4_K_M | Para export final ao Ollama |

**Sinais de problema:**
- Loss não desce → dataset ruim ou learning_rate muito baixo
- Loss vai a 0 → overfitting — reduzir epochs ou aumentar dataset
- Loss ideal para domínio jurídico: **0.5 – 1.0**

---

## FASE 3 — Criar Ollama Modelfile e Deploy

### 3.1 Modelfile

Consulte `references/modelfile-template.md` para o template completo.

```dockerfile
# Modelfile para jurema-7b
FROM ./jurema-7b-gguf/unsloth.Q4_K_M.gguf

# Parâmetros de inferência
PARAMETER temperature 0.3
PARAMETER top_p 0.9
PARAMETER num_ctx 4096
PARAMETER repeat_penalty 1.1
PARAMETER stop "<|im_end|>"
PARAMETER stop "<|endoftext|>"

# System prompt padrão (BASE_SYSTEM_PROMPT do aiProvider.js)
SYSTEM """
Você é a assistente virtual do escritório da Dra. Luciana de Jesus Ribeiro Pinho, 
advogada com mais de 20 anos de experiência (OAB/MT 7973-B), especialista em 
Direito Previdenciário, Direito da Pessoa com Deficiência (PCD) e Direito Cível.

Regras de conduta:
- Responda SEMPRE em português do Brasil
- Seja empática e acolhedora
- Use linguagem simples e acessível
- Seja breve (máximo 3 parágrafos)
- NUNCA invente informações jurídicas
- Não mencione valores de honorários
"""

# Template (ChatML para Qwen2.5 / Llama 3)
TEMPLATE """
{{- if .System }}<|im_start|>system
{{ .System }}<|im_end|>
{{ end }}
{{- range .Messages }}
<|im_start|>{{ .Role }}
{{ .Content }}<|im_end|>
{{ end }}
<|im_start|>assistant
"""

# Exemplos de conversa para few-shot learning
MESSAGE user Oi, preciso de ajuda com minha aposentadoria
MESSAGE assistant Oi! 😊 Claro, tô aqui pra te ajudar! Me conta: você quer se aposentar por idade ou por tempo de contribuição? Ou é outra situação?
MESSAGE user Tenho 30 anos de contribuição e quero saber se posso me aposentar
MESSAGE assistant Que legal, 30 anos é bastante! 💪 Pra eu te orientar melhor, preciso saber: você é homem ou mulher? E qual sua idade atual? Assim consigo ver qual regra de transição é melhor pra você. _Esta é uma orientação preliminar. Para análise completa, consulte a Dra. Luciana._

LICENSE """
Uso exclusivo do escritório Dra. Luciana de Jesus Ribeiro Pinho (OAB/MT 7973-B).
Modelo treinado com dados proprietários. Proibida redistribuição.
"""
```

### 3.2 Criar e registrar no Ollama

```bash
# A partir do diretório onde está o GGUF exportado
ollama create jurema-7b -f Modelfile

# Testar
ollama run jurema-7b "Oi, preciso de ajuda com BPC/LOAS"

# Verificar
ollama list | grep jurema
```

### 3.3 Integração com backend

O backend já está configurado em `backend/src/config/env.js`:
```javascript
OLLAMA_MODEL: process.env.OLLAMA_MODEL || 'jurema-7b',
OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
OLLAMA_TIMEOUT: Number(process.env.OLLAMA_TIMEOUT) || 120000,
```

Basta ter `AI_PROVIDER=ollama` no `.env` e o modelo `jurema-7b` registrado.

---

## FASE 4 — Avaliação

### 4.1 Testes automáticos

```bash
cd backend
AI_PROVIDER=ollama node tests/ai-flow-test.js    # 95 cenários
```

### 4.2 Avaliação manual — checklist

| Critério | Passa? | Nota |
|----------|--------|------|
| Responde em pt-BR coloquial | | |
| Tom acolhedor e empático | | |
| Extrai area/tipo_caso corretamente | | |
| Extrai CPF (11 dígitos) como cpf | | |
| Extrai RG (7-10 dígitos) como rg | | |
| Responde em JSON na triagem | | |
| Não inventa leis ou artigos | | |
| Disclaimer presente nas dúvidas | | |
| Encaminha Cível/DH/ESG para humano | | |
| Respostas ≤ 3 parágrafos | | |

### 4.3 Cenários de teste prioritários

1. **Aposentadoria por tempo** — cliente com 33 anos de CTPS
2. **BPC/LOAS PCD** — mãe de criança autista, renda baixa
3. **Pensão por morte** — viúva, marido era aposentado
4. **Inclusão escolar** — escola recusou matrícula de PCD
5. **Isenção fiscal** — PCD quer comprar carro
6. **Direito Cível** — deve redirecionar para humano
7. **Saudação simples** — "oi" → resposta acolhedora
8. **Dados pessoais** — sequência CPF → RG → telefone → endereço
9. **Linguagem coloquial** — "quero me aposentar logo"
10. **Edge case** — mensagem vazia, caracteres especiais, emojis

---

## FASE 5 — Iteração

Se os resultados não forem satisfatórios:

1. **Aumentar dataset** — gerar mais exemplos sintéticos com Groq/GPT-4
2. **Melhorar qualidade** — remover exemplos ambíguos ou incorretos
3. **Ajustar hiperparâmetros** — reduzir learning_rate, aumentar epochs
4. **Trocar modelo base** — tentar Llama 3.1 8B se Qwen não funcionar (ou vice-versa)
5. **Aumentar rank LoRA** — de 16 para 32 ou 64
6. **Repeated training** — NÃO re-treinar modelo já fine-tunado; combinar datasets e retreinar do zero

---

## Referências

| Arquivo | Conteúdo |
|---------|----------|
| `references/dataset-preparation.md` | Templates de conversa, script de geração, validação |
| `references/fine-tuning-guide.md` | Notebook Unsloth completo, Colab links, troubleshooting |
| `references/ollama-deployment.md` | Modelfile avançado, docker-compose, monitoramento |
| `references/modelfile-template.md` | Template Modelfile completo com todos os parâmetros |

## Legislação de Referência (via skill `direito-brasileiro`)

- **CF/88** art. 201-202 (Previdência Social)
- **Lei 8.213/91** (Planos de Benefícios da Previdência)
- **EC 103/2019** (Reforma da Previdência)
- **Lei 13.146/2015** (Estatuto da Pessoa com Deficiência — LBI)
- **Lei 12.764/2012** (Direitos da Pessoa com TEA — Lei Berenice Piana)
- **Lei 13.977/2020** (CIPTEA — Lei Romeo Mion)
- **Lei 8.742/93** (LOAS — Lei Orgânica da Assistência Social)
