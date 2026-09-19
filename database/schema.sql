CREATE TABLE IF NOT EXISTS waste_recommendations (
  id SERIAL PRIMARY KEY,
  waste_type VARCHAR(100) NOT NULL,
  quantity_kg NUMERIC(10,2) NOT NULL,
  purity_percent NUMERIC(5,2) NOT NULL,
  moisture_percent NUMERIC(5,2) NOT NULL,
  contamination_percent NUMERIC(5,2) NOT NULL,
  market_demand NUMERIC(5,2) NOT NULL,
  transport_distance_km NUMERIC(8,2) NOT NULL,
  buyer_availability NUMERIC(5,2) NOT NULL,
  pathway VARCHAR(30) NOT NULL,
  buyer_name VARCHAR(150) NOT NULL,
  revenue NUMERIC(12,2) NOT NULL,
  transport_cost NUMERIC(12,2) NOT NULL,
  processing_cost NUMERIC(12,2) NOT NULL,
  net_profit NUMERIC(12,2) NOT NULL,
  co2_saved NUMERIC(8,2) NOT NULL,
  confidence_score NUMERIC(5,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS factory_partners (
  id SERIAL PRIMARY KEY,
  partner_name VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL,
  region VARCHAR(100) NOT NULL,
  capacity_kg NUMERIC(12,2) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS eco_link_routes (
  id SERIAL PRIMARY KEY,
  route_name VARCHAR(150) NOT NULL,
  total_weight_kg NUMERIC(12,2) NOT NULL,
  factory_count INTEGER NOT NULL,
  route_cost NUMERIC(12,2) NOT NULL,
  co2_reduction NUMERIC(8,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO factory_partners (partner_name, category, region, capacity_kg, is_active)
VALUES
  ('GreenTex Recycling', 'Textile', 'Hyderabad', 12000, TRUE),
  ('EcoFabric Circuit', 'Reuse', 'Pune', 9000, TRUE),
  ('Thermal Energy Recovery', 'Energy', 'Nagpur', 18000, TRUE),
  ('Safe Disposal Partner', 'Disposal', 'Bengaluru', 6000, TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO eco_link_routes (route_name, total_weight_kg, factory_count, route_cost, co2_reduction)
VALUES
  ('North Cluster Loop', 750, 3, 4200, 1.8),
  ('Industrial Belt Route', 980, 4, 5100, 2.1)
ON CONFLICT DO NOTHING;
