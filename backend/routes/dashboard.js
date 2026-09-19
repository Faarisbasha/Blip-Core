const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    items: [
      { id: 1, waste_type: 'Cotton Waste', buyer: 'GreenTex Recycling', net_profit: 6000, pathway: 'recycle' },
      { id: 2, waste_type: 'Plastic Scraps', buyer: 'EcoFlow Upcycle', net_profit: 5400, pathway: 'reuse' },
      { id: 3, waste_type: 'Wood Waste', buyer: 'BioFuel Nexus', net_profit: 2900, pathway: 'recovery' }
    ]
  });
});

module.exports = router;
