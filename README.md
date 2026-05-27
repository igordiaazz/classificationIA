🧠 Classificação de Imagens com CNN + FastAPI

![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-2.2+-EE4C2C?logo=pytorch&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)

Uma API RESTful completa para classificação de imagens utilizando uma **Rede Neural Convolucional (CNN)** treinada no dataset **CIFAR-10**. 

Este projeto aborda todo o ciclo de vida de um modelo de Machine Learning básico: desde o **treinamento da rede neural**, passando pelo **serving com FastAPI**, até o empacotamento e **containerização com Docker**.

---

## 🏗️ Arquitetura da Solução

O fluxo da aplicação foi desenhado para ser simples e eficiente, rodando a inferência diretamente na CPU:

```text
📸 Imagem (Upload via POST)
      │
      ▼
┌───────────────┐     ┌──────────────────┐     ┌───────────────┐
│    FastAPI    │────▶│ model_loader.py  │────▶│   CNN (CPU)   │
│ POST /predict │     │ (Pré-processa)   │     │   (PyTorch)   │
└───────────────┘     └──────────────────┘     └───────┬───────┘
      ▲                                                │
      │                                                ▼
      │                                        ┌───────────────┐
      └────────────────────────────────────────│ JSON Response │
                                               │ {             │
                                               │  "classe": "gato",
                                               │  "confianca": 0.86
                                               │ }             │
                                               └───────────────┘