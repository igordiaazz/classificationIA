from pathlib import Path
import torch
import torch.nn as nn
import torch.nn.functional as F
import torchvision.transforms as transforms
from PIL import Image

MODEL_PATH = Path(__file__).resolve().parent.parent / "models" / "cifar10_cnn.pt"

CIFAR10_CLASSES = [
    "aviao", "automovel", "passaro", "gato", "veado",
    "cachorro", "sapo", "cavalo", "navio", "caminhao",
]

transform = transforms.Compose([
    transforms.Resize((32, 32)),
    transforms.ToTensor(),
    transforms.Normalize((0.4914, 0.4822, 0.4465), (0.2470, 0.2435, 0.2616)),
])

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = None


def load_model():
    global model
    if model is None:
        model = torch.jit.load(str(MODEL_PATH), map_location=device)
        model.eval()
    return model


def predict_image(image: Image.Image) -> tuple[str, float]:
    model = load_model()
    img_tensor = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(img_tensor)
        probabilities = F.softmax(outputs, dim=1)
        confidence, predicted = probabilities.max(1)

    classe = CIFAR10_CLASSES[predicted.item()]
    confianca = round(confidence.item(), 4)
    return classe, confianca
