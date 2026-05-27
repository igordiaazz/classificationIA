from pydantic import BaseModel


class PredictResponse(BaseModel):
    classe: str
    confianca: float


class ErrorResponse(BaseModel):
    erro: str
    detalhe: str | None = None
