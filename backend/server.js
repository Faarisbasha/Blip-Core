const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/reloop_ai',
});

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
  }
};

function evaluateWaste(input) {
  const purityScore = input.purity;
  const contaminationPenalty = input.contamination * 0.6;
  const demandBoost = input.marketDemand * 0.4;
  const availabilityBoost = input.buyerAvailability * 0.35;
  const logisticsPenalty = input.transportDistance * 0.35;
  const quantityBonus = Math.min(input.quantity / 1000, 6) * 200;

  const score = purityScore - contaminationPenalty + demandBoost + availabilityBoost - logisticsPenalty + quantityBonus;

  if (score >= 75) return 'recycle';
  if (score >= 58) return 'reuse';
  if (score >= 42) return 'recovery';
  return 'disposal';
}

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    return res.json({ status: 'ok', db: 'connected' });
  } catch (error) {
    return res.json({ status: 'ok', db: 'offline', message: 'Database not initialized yet' });
  }
});

app.post('/api/recommendation', (req, res) => {
  const input = req.body;

  if (!input || !input.wasteType) {
    return res.status(400).json({ error: 'Waste inputs are required.' });
  }

  const pathway = evaluateWaste(input);
  const base = responseMap[pathway];
  const quantityFactor = Math.max(1, input.quantity / 500);

  const payload = {
    ...base,
    revenue: Math.round(base.revenue * quantityFactor),
    transportCost: Math.round(base.transportCost * (1 + input.transportDistance / 120)),
    processingCost: Math.round(base.processingCost * (1 + input.contamination / 100)),
    netProfit: Math.round(base.netProfit * quantityFactor),
    co2Saved: Number((base.co2Saved * quantityFactor).toFixed(1)),
    confidence: Math.min(99, Math.max(60, base.confidence + Math.round((input.purity - input.moisture) / 4)))
  };

  return res.json(payload);
});

app.get('/api/dashboard', async (req, res) => {
  const query = `
    SELECT * FROM waste_recommendations
    ORDER BY created_at DESC
    LIMIT 10;
  `;

  try {
    const result = await pool.query(query);
    return res.json({ items: result.rows });
  } catch (error) {
    return res.json({
      items: [
        {
          id: 1,
          waste_type: 'Cotton Waste',
          buyer: 'GreenTex Recycling',
          net_profit: 6000,
          pathway: 'recycle'
        }
      ]
    });
  }
});

app.listen(port, () => {
  console.log(`ReLoop AI backend running on http://localhost:${port}`);
});
