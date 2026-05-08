# Fine-tuning Guide — jurema-7b via Unsloth

Notebook completo para QLoRA fine-tuning do jurema-7b com Unsloth.

---

## 1. Opções de Ambiente

| Ambiente | GPU | VRAM | Custo | Nota |
|----------|-----|------|-------|------|
| **Google Colab Free** | T4 | 15 GB | Grátis | Recomendado para início |
| **Google Colab Pro** | A100 | 40 GB | ~$10/mês | Treino mais rápido |
| **Kaggle** | T4 x2 | 15 GB | Grátis | Alternativa ao Colab |
| **Local (Windows/WSL)** | RTX 3060+ | 6+ GB | Hardware próprio | Precisa CUDA 11.8+ |
| **RunPod / Vast.ai** | Variável | Variável | ~$0.30/h | Para datasets grandes |

### Instalação local (Windows via WSL ou nativo)

```bash
# WSL2 recomendado no Windows
pip install "unsloth[colab-new] @ git+https://github.com/unslothai/unsloth.git"
pip install --no-deps trl peft accelerate bitsandbytes
pip install xformers
```

### Google Colab

```python
%%capture
!pip install unsloth
!pip install --no-deps trl peft accelerate bitsandbytes
```

---

## 2. Notebook Completo

```python
# ═══════════════════════════════════════════════
# jurema-7b Fine-tuning — Unsloth QLoRA
# ═══════════════════════════════════════════════

# ──── PASSO 1: Carregar modelo base ────
from unsloth import FastLanguageModel
import torch

# Modelos base recomendados (escolher UM):
# - "unsloth/Qwen2.5-7B-Instruct-bnb-4bit"  ← recomendado (melhor pt-BR)
# - "unsloth/Meta-Llama-3.1-8B-Instruct-bnb-4bit"
# - "unsloth/gemma-2-9b-it-bnb-4bit"

BASE_MODEL = "unsloth/Qwen2.5-7B-Instruct-bnb-4bit"

model, tokenizer = FastLanguageModel.from_pretrained(
    model_name=BASE_MODEL,
    max_seq_length=4096,      # Conversas de triagem são longas
    dtype=None,               # Auto-detect (float16 ou bfloat16)
    load_in_4bit=True,        # QLoRA — economia de 75% VRAM
)

print(f"Modelo carregado: {BASE_MODEL}")
print(f"Parâmetros: {model.num_parameters():,}")


# ──── PASSO 2: Configurar LoRA adapter ────
model = FastLanguageModel.get_peft_model(
    model,
    r=16,                     # Rank — 16 é bom equilíbrio (8-64)
    target_modules=[
        "q_proj", "k_proj", "v_proj", "o_proj",  # Attention
        "gate_proj", "up_proj", "down_proj",       # MLP
    ],
    lora_alpha=16,            # Normalmente igual a r
    lora_dropout=0,           # 0 é recomendado pelo Unsloth
    bias="none",
    use_gradient_checkpointing="unsloth",  # 30% menos VRAM
    random_state=3407,
)

trainable, total = model.get_nb_trainable_parameters()
print(f"Parâmetros treináveis: {trainable:,} / {total:,} ({100*trainable/total:.2f}%)")


# ──── PASSO 3: Preparar chat template ────
from unsloth.chat_templates import get_chat_template

tokenizer = get_chat_template(
    tokenizer,
    chat_template="chatml",   # ChatML para Qwen2.5
    # Se usar Llama 3.1, trocar para: chat_template="llama-3.1"
)


# ──── PASSO 4: Carregar e formatar dataset ────
from datasets import load_dataset

# Carregar dataset local (JSONL com campo "messages")
dataset = load_dataset(
    "json",
    data_files={
        "train": "dataset/jurema-training.jsonl",
        "eval": "dataset/jurema-eval.jsonl",
    },
)

train_dataset = dataset["train"]
eval_dataset = dataset["eval"]

print(f"Train: {len(train_dataset)} exemplos")
print(f"Eval: {len(eval_dataset)} exemplos")

# Formatar com chat template
def formatting_func(examples):
    convos = examples["messages"]
    texts = [
        tokenizer.apply_chat_template(
            convo,
            tokenize=False,
            add_generation_prompt=False,
        )
        for convo in convos
    ]
    return {"text": texts}

train_dataset = train_dataset.map(formatting_func, batched=True)
eval_dataset = eval_dataset.map(formatting_func, batched=True)

# Verificar um exemplo formatado
print("─" * 60)
print("Exemplo formatado:")
print(train_dataset[0]["text"][:500])
print("─" * 60)


# ──── PASSO 5: Configurar e treinar ────
from trl import SFTTrainer
from transformers import TrainingArguments

trainer = SFTTrainer(
    model=model,
    tokenizer=tokenizer,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    dataset_text_field="text",
    max_seq_length=4096,
    dataset_num_proc=2,
    packing=False,             # False para conversas multi-turn
    args=TrainingArguments(
        # Batch
        per_device_train_batch_size=2,
        gradient_accumulation_steps=4,   # Batch efetivo = 8
        
        # Epochs e steps
        num_train_epochs=3,              # 2-3 recomendado
        # max_steps=100,                 # Descomente para testes rápidos
        
        # Learning rate
        learning_rate=2e-4,              # Reduzir pra 5e-5 se overfitting
        warmup_steps=5,
        lr_scheduler_type="linear",
        
        # Precision
        fp16=not torch.cuda.is_bf16_supported(),
        bf16=torch.cuda.is_bf16_supported(),
        
        # Otimizador
        optim="adamw_8bit",
        weight_decay=0.01,
        
        # Logging e eval
        logging_steps=1,
        eval_strategy="steps",
        eval_steps=50,                   # Avaliar a cada 50 steps
        save_strategy="steps",
        save_steps=100,
        
        # Output
        output_dir="outputs/jurema-7b",
        seed=3407,
        report_to="none",               # Trocar para "wandb" se quiser tracking
    ),
)

# Memória antes do treino
gpu_stats = torch.cuda.get_device_properties(0)
reserved = torch.cuda.max_memory_reserved() / 1024 / 1024 / 1024
print(f"GPU: {gpu_stats.name} ({gpu_stats.total_mem / 1024**3:.1f} GB)")
print(f"VRAM reservada: {reserved:.1f} GB")

# TREINAR!
print("\n🚀 Iniciando treinamento...")
trainer_stats = trainer.train()

print(f"\n✅ Treino completo!")
print(f"   Loss final: {trainer_stats.training_loss:.4f}")
print(f"   Tempo: {trainer_stats.metrics['train_runtime']:.0f}s")


# ──── PASSO 6: Testar inferência ────
FastLanguageModel.for_inference(model)

messages = [
    {"role": "system", "content": "Você é a assistente virtual do escritório da Dra. Luciana Pinho."},
    {"role": "user", "content": "Oi, preciso de ajuda com minha aposentadoria por tempo de contribuição"},
]

inputs = tokenizer.apply_chat_template(
    messages,
    tokenize=True,
    add_generation_prompt=True,
    return_tensors="pt",
).to("cuda")

from transformers import TextStreamer
text_streamer = TextStreamer(tokenizer, skip_prompt=True)

_ = model.generate(
    input_ids=inputs,
    streamer=text_streamer,
    max_new_tokens=256,
    use_cache=True,
    temperature=0.3,
    min_p=0.1,
)


# ──── PASSO 7: Salvar adapter LoRA ────
# Salva apenas o adapter (~100 MB) — não o modelo inteiro
model.save_pretrained("outputs/jurema-7b-lora")
tokenizer.save_pretrained("outputs/jurema-7b-lora")
print("✅ Adapter LoRA salvo em outputs/jurema-7b-lora/")


# ──── PASSO 8: Exportar GGUF para Ollama ────
# Q4_K_M = ~4.4 GB — melhor equilíbrio qualidade/tamanho
model.save_pretrained_gguf(
    "outputs/jurema-7b-gguf",
    tokenizer,
    quantization_method="q4_k_m",
)
print("✅ GGUF Q4_K_M exportado em outputs/jurema-7b-gguf/")

# Opcional: exportar Q8_0 para avaliação (melhor qualidade, ~7 GB)
# model.save_pretrained_gguf(
#     "outputs/jurema-7b-gguf-q8",
#     tokenizer,
#     quantization_method="q8_0",
# )
```

---

## 3. Troubleshooting

### CUDA Out of Memory
```python
# Reduzir batch size
per_device_train_batch_size=1
gradient_accumulation_steps=8

# Ou reduzir max_seq_length
max_seq_length=2048

# Ou usar gradient checkpointing (já ativo por padrão no Unsloth)
```

### Loss não diminui
1. Verificar se o dataset está formatado corretamente (rodar validação)
2. Aumentar learning_rate para 5e-4
3. Verificar se chat template correto (chatml para Qwen, llama-3.1 para Llama)
4. Verificar se há exemplos duplicados ou contraditórios

### Loss vai a zero
1. Dataset pequeno demais → gerar mais dados sintéticos
2. Muito epochs → reduzir para 1-2
3. Learning rate muito alto → reduzir para 5e-5

### Modelo "esquece" português
1. Adicionar exemplos em português generalista ao dataset
2. Misturar com dataset ShareGPT em pt-BR do HuggingFace
3. Reduzir epochs (overfitting no domínio jurídico)

### Exportação GGUF falha
```bash
# Instalar llama.cpp manualmente se o automático falhar
pip install llama-cpp-python
# Ou usar o método manual:
python -m llama_cpp.convert --outtype q4_k_m outputs/jurema-7b-lora
```

---

## 4. Métricas de Avaliação

Após o treino, avaliar com esses critérios:

```python
# Script de avaliação rápida
test_prompts = [
    # Triagem previdenciário
    {"user": "Quero me aposentar, tenho 35 anos de contribuição", "expect_area": "previdenciario"},
    # Triagem PCD
    {"user": "Meu filho é autista e precisa de BPC", "expect_area": "direitos_pcd"},
    # Classificação
    {"user": "Quero agendar consulta", "expect_class": "agendamento"},
    # Redirecionar cível
    {"user": "Tenho um problema de direito civil", "expect_redirect": True},
    # Dúvida
    {"user": "Quanto tempo preciso contribuir para aposentar por idade?", "expect_type": "duvida"},
    # Extração CPF
    {"user": "123.456.789-00", "expect_field": "cpf"},
    # Extração RG
    {"user": "503403180", "expect_field": "rg"},
]

FastLanguageModel.for_inference(model)
for test in test_prompts:
    messages = [
        {"role": "system", "content": "Triagem. Responda em JSON."},
        {"role": "user", "content": test["user"]},
    ]
    inputs = tokenizer.apply_chat_template(messages, tokenize=True, add_generation_prompt=True, return_tensors="pt").to("cuda")
    outputs = model.generate(input_ids=inputs, max_new_tokens=256, temperature=0.1)
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    print(f"Input: {test['user']}")
    print(f"Output: {response[-300:]}")
    print("─" * 40)
```

---

## 5. Links úteis

- [Unsloth Notebooks (oficiais)](https://docs.unsloth.ai/get-started/unsloth-notebooks)
- [Unsloth GitHub](https://github.com/unslothai/unsloth)
- [Unsloth Dataset Guide](https://unsloth.ai/docs/get-started/fine-tuning-llms-guide/datasets-guide)
- [Unsloth Hyperparameters Guide](https://unsloth.ai/docs/get-started/fine-tuning-llms-guide/lora-hyperparameters-guide)
- [Saving to GGUF docs](https://unsloth.ai/docs/basics/inference-and-deployment/saving-to-gguf)
- [HuggingFace TRL SFTTrainer](https://huggingface.co/docs/trl/sft_trainer)
