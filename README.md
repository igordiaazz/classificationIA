# Classificação de Imagens com CNN + FastAPI

API RESTful para classificação de imagens usando uma **Rede Neural Convolucional (CNN)** treinada no dataset **CIFAR-10**. O projeto cobre todo o ciclo: treinamento do modelo, serving com FastAPI e containerização com Docker.

## Arquitetura

```
Imagem (upload)
      │
      ▼
┌─────────────┐     ┌──────────────────┐     ┌──────────────┐
│  FastAPI     │────▶│  model_loader.py │────▶│  CNN (CPU)   │
│  POST /predict│     │  (pré-processa)  │     │  (PyTorch)   │
└─────────────┘     └──────────────────┘     └──────┬───────┘
      ▲                                               │
      │                                               ▼
      │                                        ┌──────────────┐
      └────────────────────────────────────────│  JSON Response│
                                               │ {"classe":    │
                                               │  "gato",      │
                                               │  "confianca": │
                                               │   0.86}       │
                                               └──────────────┘
```

## Tecnologias

- **PyTorch 2.12** — Treinamento da CNN
- **FastAPI** — Framework web para a API REST
- **Uvicorn** — Servidor ASGI
- **Docker** — Containerização
- **CIFAR-10** — Dataset com 60.000 imagens (10 classes, 32×32)

## Classes (em português)

| Classe    | Tradução      |
|-----------|---------------|
| avião     | airplane      |
| automóvel | automobile    |
| pássaro   | bird          |
| gato      | cat           |
| veado     | deer          |
| cachorro  | dog           |
| sapo      | frog          |
| cavalo    | horse         |
| navio     | ship          |
| caminhão  | truck         |

## Estrutura do Projeto

```
classificationIA/
├── app/
│   ├── main.py           # FastAPI (endpoints /health e /predict)
│   ├── model_loader.py   # Carregamento do modelo e inferência
│   └── schemas.py        # Schemas Pydantic (request/response)
├── training/
│   └── train.py          # Script de treinamento da CNN
├── models/               # Pesos do modelo (ignorado pelo Git)
├── data/                 # Dataset CIFAR-10 (ignorado pelo Git)
├── run.py                # Inicialização rápida da API
├── Dockerfile            # Build da imagem Docker
├── requirements.txt      # Dependências Python
└── .gitignore
```

## Modelo — CNN

Arquitetura com 3 blocos convolucionais:

```
Input (3×32×32)
    │
Conv2d(3→32, 3×3) → BatchNorm → ReLU → MaxPool(2×2)
    │
Conv2d(32→64, 3×3) → BatchNorm → ReLU → MaxPool(2×2)
    │
Conv2d(64→128, 3×3) → BatchNorm → ReLU → MaxPool(2×2)
    │
Dropout(0.25) → Flatten → Dense(2048→256) → ReLU
    │
Dense(256→10) → Output (10 classes)
```

Acurácia no teste: **~80%** com 10 épocas.

## Como Usar

### 1. Treinar o Modelo

```bash
python training/train.py
```

O script baixa o CIFAR-10 automaticamente, treina por 10 épocas e salva o modelo em `models/cifar10_cnn.pt`.

### 2. Executar a API

```bash
# Opção 1 — Direto com Python
python run.py

# Opção 2 — Com Uvicorn
uvicorn app.main:app --reload

# Opção 3 — Docker
docker build -t classificacao-ia .
docker run -p 8000:8000 classificacao-ia
```

Acesse a documentação interativa em **http://127.0.0.1:8000/docs**.

### 3. Testar a API

```bash
# Health check
curl http://127.0.0.1:8000/health

# Classificar imagem
curl -X POST http://127.0.0.1:8000/predict \
  -F "file=@cachorro.jpg"
```

Resposta esperada:

```json
{
  "classe": "cachorro",
  "confianca": 0.9345
}
```

## Endpoints

### `GET /health`

Retorna o status da API.

**Resposta:**
```json
{ "status": "ok" }
```

### `POST /predict`

Recebe uma imagem e retorna a classe predita com o nível de confiança.

**Parâmetros:**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| file | image/* | Arquivo de imagem (JPEG, PNG, etc.) |

**Resposta (200):**
```json
{
  "classe": "gato",
  "confianca": 0.8619
}
```

**Erros:**
| Status | Significado |
|--------|-------------|
| 415 | Tipo de arquivo não suportado (enviou PDF, TXT, etc.) |
| 400 | Arquivo inválido ou corrompido |
| 500 | Erro interno ao processar a imagem |

## Docker

```bash
# Build
docker build -t classificacao-ia .

# Executar
docker run -p 8000:8000 classificacao-ia
```

A imagem usa `python:3.12-slim` com PyTorch CPU (~2 GB).

## Git

O repositório segue commits semânticos:

```
feat: projeto inicial de classificacao de imagens com CNN
fix: adiciona run.py para facilitar inicializacao
chore: adiciona .idea/ ao gitignore
```

## Licença

Este projeto é de uso educacional — desenvolvido como exemplo de aplicação de Deep Learning + API REST + Docker.
