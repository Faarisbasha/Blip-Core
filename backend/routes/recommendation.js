const express = require('express');
const router = express.Router();

const responseMap = {
  reuse: {
    pathway: 'reuse',
    buyer: 'EcoFabric Circuit',
    revenue: 6200,
    transportCost: 1200,
    processingCost: 550,
    netProfit: 4450,
    co2Saved: 0.9,
    confidence: 88,
  },
  recycle: {
    pathway: 'recycle',
    buyer: 'GreenTex Recycling',
    revenue: 8500,
    transportCost: 1800,
    processingCost: 700,
    netProfit: 6000,
    co2Saved: 1.2,
    confidence: 92,
  },
  recovery: {
    pathway: 'recovery',
    buyer: 'Thermal Energy Recovery',
    revenue: 5100,
    transportCost: 1500,
    processingCost: 900,
    netProfit: 2700,
    co2Saved: 1.5,
    confidence: 84,
  },
  disposal: {
    pathway: 'disposal',
    buyer: 'Safe Disposal Partner',
    revenue: 1500,
    transportCost: 2100,
    processingCost: 500,
    netProfit: -1100,
    co2Saved: 0.2,
    confidence: 71,
  },
};

function evaluateWaste(input) {
  const score =
    input.purity - input.contamination * 0.6 + input.marketDemand * 0.4 + input.buyerAvailability * 0.35 - input.transportDistance * 0.35 + Math.min(input.quantity / 1000, 6) * 200;

  if (score >= 75) return 'recycle';
  if (score >= 58) return 'reuse';
  if (score >= 42) return 'recovery';
  return 'disposal';
}

router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'recommendation-api' });
});

router.post('/', (req, res) => {
  const input = req.body;

  if (!input || !input.wasteType) {
    return res.status(400).json({ error: 'Waste inputs are required.' });
  }

  const pathway = evaluateWaste(input);
  const base = responseMap[pathway];
  const quantityFactor = Math.max(1, input.quantity / 500);

  return res.json({
    ...base,
    revenue: Math.round(base.revenue * quantityFactor),
    transportCost: Math.round(base.transportCost * (1 + input.transportDistance / 120)),
    processingCost: Math.round(base.processingCost * (1 + input.contamination / 100)),
    netProfit: Math.round(base.netProfit * quantityFactor),
    co2Saved: Number((base.co2Saved * quantityFactor).toFixed(1)),
    confidence: Math.min(99, Math.max(60, base.confidence + Math.round((input.purity - input.moisture) / 4))),
  });
});

module.exports = router;
