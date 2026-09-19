from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import numpy as np

app = FastAPI(title='ReLoop AI Service')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)


class WasteInput(BaseModel):
    wasteType: str
    quantity: float
    purity: float
    moisture: float
    contamination: float
    marketDemand: float
    transportDistance: float
    buyerAvailability: float


RESPONSE_MAP = {
    'reuse': {
        'pathway': 'reuse',
        'buyer': 'EcoFabric Circuit',
        'revenue': 6200,
        'transportCost': 1200,
        'processingCost': 550,
        'netProfit': 4450,
        'co2Saved': 0.9,
        'confidence': 88,
    },
    'recycle': {
        'pathway': 'recycle',
        'buyer': 'GreenTex Recycling',
        'revenue': 8500,
        'transportCost': 1800,
        'processingCost': 700,
        'netProfit': 6000,
        'co2Saved': 1.2,
        'confidence': 92,
    },
    'recovery': {
        'pathway': 'recovery',
        'buyer': 'Thermal Energy Recovery',
        'revenue': 5100,
        'transportCost': 1500,
        'processingCost': 900,
        'netProfit': 2700,
        'co2Saved': 1.5,
        'confidence': 84,
    },
    'disposal': {
        'pathway': 'disposal',
        'buyer': 'Safe Disposal Partner',
        'revenue': 1500,
        'transportCost': 2100,
        'processingCost': 500,
        'netProfit': -1100,
        'co2Saved': 0.2,
        'confidence': 71,
    },
}


def evaluate_waste(input_data: WasteInput) -> str:
    score = (
        input_data.purity
        - input_data.contamination * 0.6
        + input_data.marketDemand * 0.4
        + input_data.buyerAvailability * 0.35
        - input_data.transportDistance * 0.35
        + min(input_data.quantity / 1000, 6) * 200
    )

    if score >= 75:
        return 'recycle'
    if score >= 58:
        return 'reuse'
    if score >= 42:
        return 'recovery'
    return 'disposal'


@app.get('/health')
def health():
    return {"status": "ok", "service": "ReLoop AI"}


@app.post('/predict')
def predict(data: WasteInput):
    pathway = evaluate_waste(data)
    base = RESPONSE_MAP[pathway]
    quantity_factor = max(1, data.quantity / 500)

    result = {
        **base,
        'revenue': round(base['revenue'] * quantity_factor),
        'transportCost': round(base['transportCost'] * (1 + data.transportDistance / 120)),
        'processingCost': round(base['processingCost'] * (1 + data.contamination / 100)),
        'netProfit': round(base['netProfit'] * quantity_factor),
        'co2Saved': round(base['co2Saved'] * quantity_factor, 1),
        'confidence': min(99, max(60, base['confidence'] + round((data.purity - data.moisture) / 4))),
    }
    return result


@app.get('/')
def index():
    return {"message": "ReLoop AI service is running."}
