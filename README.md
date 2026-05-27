# 🧠 classificationIA

![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-EE4C2C?logo=pytorch&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/Licença-MIT-green)

API REST de classificação de imagens usando uma Rede Neural Convolucional (CNN) treinada no CIFAR-10, servida com FastAPI e empacotada com Docker.

## 📌 Visão Geral

O projeto cobre o ciclo completo de um modelo de classificação de imagens: treinar uma CNN do zero, exportá-la como modelo TorchScript e servir predições via API REST. A inferência roda em CPU, sem necessidade de GPU para deploy.

**🏷️ Classes suportadas:** avião, automóvel, pássaro, gato, veado, cachorro, sapo, cavalo, navio, caminhão

## 🏗️ Arquitetura

```
POST /predict  →  model_loader.py (pré-processamento)  →  CNN (TorchScript)  →  JSON
```

A CNN tem três blocos convolucionais (32 → 64 → 128 canais), cada um com BatchNorm e MaxPool, seguidos de Dropout e duas camadas fully connected. O treinamento usa Adam com scheduler CosineAnnealing e augmentação padrão do CIFAR-10 (random crop + horizontal flip).

## 📁 Estrutura do Projeto

```
classificationIA/
├── app/
│   ├── main.py           # Aplicação FastAPI e rotas
│   ├── model_loader.py   # Carregamento do modelo e inferência
│   └── schemas.py        # Schemas Pydantic para request/response
├── training/
│   └── train.py          # Definição da CNN e loop de treinamento
├── models/               # Pesos salvos do modelo (gerado após o treino)
├── Dockerfile
├── requirements.txt
└── run.py                # Servidor para desenvolvimento local
```

## 🚀 Como Usar

### ✅ Requisitos

- Python 3.12+
- PyTorch 2.0+

### 📦 Instalação

```bash
git clone https://github.com/seu-usuario/classificationIA.git
cd classificationIA
pip install -r requirements.txt
```

### 🎓 Treinar o Modelo

```bash
python training/train.py
```

O dataset CIFAR-10 é baixado automaticamente. Dois arquivos são salvos em `models/`:
- `cifar10_cnn.pth` — state dict puro
- `cifar10_cnn.pt` — TorchScript (usado pela API)

O treinamento roda por 10 épocas. Acurácia esperada no teste: ~75–80%.

### ▶️ Subir a API

```bash
python run.py
```

O servidor sobe em `http://127.0.0.1:8000`. Documentação interativa disponível em `/docs`.

## 📡 Referência da API

### `GET /health`

Retorna o status do servidor.

```json
{ "status": "ok" }
```

### `POST /predict`

Classifica uma imagem enviada via upload.

**Request:** `multipart/form-data` com o campo `file` contendo uma imagem JPEG ou PNG.

**Response:**

```json
{
  "classe": "gato",
  "confianca": 0.8631
}
```

**💻 Exemplo com curl:**

```bash
curl -X POST http://127.0.0.1:8000/predict \
  -F "file=@sua_imagem.jpg"
```

**⚠️ Códigos de erro:**

| Status | Motivo |
|--------|--------|
| 400 | Arquivo inválido ou corrompido |
| 415 | Tipo de arquivo não suportado (não é imagem) |
| 500 | Erro interno na inferência |

## 🐳 Docker

```bash
# Build
docker build -t classificationia .

# Run
docker run -p 8000:8000 classificationia
```

A imagem usa `python:3.12-slim` com build CPU-only do PyTorch.

> ⚠️ **Atenção:** O diretório `models/` com o arquivo `.pt` treinado precisa existir antes do build. Rode o treinamento primeiro ou copie um modelo pré-treinado para esse diretório.

## 🛠️ Stack

| Componente | Biblioteca |
|------------|------------|
| 🔥 Deep learning | PyTorch 2.0+ |
| 🖼️ Dados e transforms | torchvision |
| 📦 Exportação do modelo | TorchScript (`torch.jit`) |
| ⚡ Framework da API | FastAPI |
| 🌐 Servidor | Uvicorn |
| 🖼️ Processamento de imagens | Pillow |
| 🐳 Containerização | Docker |

## ⚙️ Configuração do Treinamento

| Parâmetro | Valor |
|-----------|-------|
| Dataset | CIFAR-10 |
| Épocas | 10 |
| Batch size | 64 |
| Otimizador | Adam (lr=0.001) |
| LR scheduler | CosineAnnealing |
| Regularização | Dropout (p=0.25), BatchNorm |
| Augmentação | RandomCrop, RandomHorizontalFlip |