# 🧠 classificationIA

![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-EE4C2C?logo=pytorch&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/Licença-MIT-green)

Plataforma completa de classificação de imagens usando uma CNN treinada no CIFAR-10, com frontend React, API Gateway Node.js, backend Python/FastAPI e PostgreSQL para histórico de predições.

## 📌 Visão Geral

O projeto cobre o ciclo completo de um modelo de classificação de imagens: treinar uma CNN do zero, exportá-la como modelo TorchScript, servir predições via API REST e disponibilizar uma interface web com histórico persistido em banco de dados.

**🏷️ Classes suportadas:** avião, automóvel, pássaro, gato, veado, cachorro, sapo, cavalo, navio, caminhão

## 🏗️ Arquitetura

```
Navegador → React (Vite) → Node.js (Express) → Python (FastAPI) → CNN (TorchScript)
                              ↕
                         PostgreSQL (histórico)
```

O fluxo de uma predição:
1. Usuário faz upload de uma imagem no frontend React
2. O frontend envia a imagem para o API Gateway Node.js
3. O Node.js encaminha para o backend Python/FastAPI
4. O Python executa a inferência com PyTorch e retorna classe + confiança
5. O Node.js salva o resultado no PostgreSQL e retorna ao frontend

## 📁 Estrutura do Projeto

```
classificationIA/
├── backend/                   # API Python/FastAPI
│   ├── app/
│   │   ├── main.py            # Rotas da API (+ CORS, /models)
│   │   ├── model_loader.py    # Carregamento do modelo e inferência
│   │   └── schemas.py         # Schemas Pydantic
│   ├── training/
│   │   └── train.py           # Definição da CNN e loop de treinamento
│   ├── Dockerfile
│   └── requirements.txt
├── node-backend/              # API Gateway Node.js + TypeScript
│   ├── src/
│   │   ├── index.ts           # Servidor Express (porta 3001)
│   │   ├── config.ts          # Configurações (variáveis de ambiente)
│   │   ├── prisma.ts          # Cliente Prisma
│   │   └── routes/
│   │       ├── predict.ts     # Proxy de predição + salvamento no DB
│   │       └── history.ts     # CRUD do histórico
│   ├── prisma/schema.prisma   # Modelo PredictionHistory
│   └── Dockerfile
├── frontend/                  # React + TypeScript + Tailwind (Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx       # Upload e classificação
│   │   │   ├── History.tsx    # Histórico paginado
│   │   │   └── HistoryDetail.tsx  # Detalhe da predição
│   │   ├── components/
│   │   │   ├── Layout.tsx     # Navbar + estrutura base
│   │   │   ├── ImageUploader.tsx  # Drag-and-drop upload
│   │   │   └── ResultCard.tsx     # Exibição do resultado
│   │   └── api.ts             # Cliente HTTP
│   └── Dockerfile
├── database/
│   └── init.sql               # Schema inicial do PostgreSQL
├── docker-compose.yml         # Orquestração dos 4 serviços
├── package.json               # Monorepo com npm workspaces
└── README.md
```

## 🚀 Como Usar

### ✅ Requisitos

- Node.js 20+
- Python 3.12+
- PyTorch 2.0+
- Docker e Docker Compose (opcional)

### 📦 Instalação

```bash
git clone https://github.com/igordiaazz/classificationIA.git
cd classificationIA
npm install
```

### 🎓 Treinar o Modelo

```bash
cd backend
pip install -r requirements.txt --extra-index-url https://download.pytorch.org/whl/cpu
python3 training/train.py
```

O dataset CIFAR-10 é baixado automaticamente. Dois arquivos são salvos em `backend/models/`:
- `cifar10_cnn.pth` — state dict puro
- `cifar10_cnn.pt` — TorchScript (usado pela API)

O treinamento roda por 10 épocas. Acurácia esperada no teste: ~75–80%.

### ▶️ Desenvolvimento Local

```bash
# 1. Subir o PostgreSQL
docker compose up postgres -d

# 2. Rodar as migrações do Prisma
npm run db:migrate

# 3. Iniciar os 3 serviços em paralelo
npm run dev
```

| Serviço | Porta |
|---------|-------|
| Frontend (React/Vite) | http://localhost:5173 |
| Node.js (Express) | http://localhost:3001 |
| Python (FastAPI) | http://localhost:8000 |

### 🐳 Docker Compose (Produção)

```bash
docker compose up --build
```

## 📡 Referência da API

### Python/FastAPI (porta 8000)

#### `GET /health`
Retorna o status do servidor Python.
```json
{ "status": "ok" }
```

#### `GET /models`
Retorna as classes suportadas pelo modelo.
```json
{
  "classes": ["aviao", "automovel", "passaro", "gato", ...],
  "model": "CNN CIFAR-10"
}
```

#### `POST /predict`
Classifica uma imagem enviada via upload.
**Request:** `multipart/form-data` com o campo `file`
**Response:**
```json
{ "classe": "gato", "confianca": 0.8631 }
```

### Node.js/Express (porta 3001)

#### `POST /api/predict`
Proxy para o backend Python. Aceita multipart e retorna o resultado com ID do histórico.
```json
{
  "id": "uuid",
  "classe": "gato",
  "confianca": 0.8631,
  "filename": "gato.jpg",
  "createdAt": "2026-06-30T..."
}
```

#### `GET /api/history?page=1&limit=20`
Histórico paginado de predições.
```json
{
  "data": [{ "id": "uuid", "filename": "...", "predictedClass": "...", "confidence": 0.86, "createdAt": "..." }],
  "pagination": { "page": 1, "limit": 20, "total": 42, "totalPages": 3 }
}
```

#### `GET /api/history/:id`
Detalhe completo de uma predição (inclui `imageData` em base64).
#### `DELETE /api/history/:id`
Remove um registro do histórico.

## 🛠️ Stack

| Componente | Tecnologia |
|------------|------------|
| 🔥 Deep learning | PyTorch 2.0+ / torchvision |
| 🐍 API de inferência | FastAPI + Uvicorn |
| ⚡ API Gateway | Node.js + Express + TypeScript |
| 🗄️ Banco de dados | PostgreSQL 16 + Prisma ORM |
| 🎨 Frontend | React 18 + TypeScript + Vite |
| 💅 Estilização | Tailwind CSS 3 |
| 🐳 Containerização | Docker Compose |

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
