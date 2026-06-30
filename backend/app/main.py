from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import PredictResponse, ErrorResponse
from app.model_loader import predict_image, CIFAR10_CLASSES
from PIL import Image
import io

app = FastAPI(
    title="API de Classificacao de Imagens",
    description="Classifica imagens usando uma CNN treinada no CIFAR-10",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/models")
def get_models():
    return {"classes": CIFAR10_CLASSES, "model": "CNN CIFAR-10"}


@app.post(
    "/predict",
    response_model=PredictResponse,
    responses={
        400: {"model": ErrorResponse},
        415: {"model": ErrorResponse},
    },
)
async def predict(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=415,
            detail=f"Tipo de arquivo nao suportado: {file.content_type}. Envie uma imagem (JPEG, PNG, etc).",
        )

    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Arquivo invalido ou corrompido. Envie uma imagem valida.",
        )

    try:
        classe, confianca = predict_image(image)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao processar a imagem: {str(e)}",
        )

    return PredictResponse(classe=classe, confianca=confianca)
