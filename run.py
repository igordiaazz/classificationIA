import uvicorn

if __name__ == "__main__":
    print("=" * 50)
    print("API de Classificacao de Imagens")
    print("=" * 50)
    print("Servidor iniciado em:")
    print("  -> http://127.0.0.1:8000")
    print("  -> http://127.0.0.1:8000/docs (documentacao)")
    print("  -> http://127.0.0.1:8000/health (health check)")
    print("=" * 50)
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
