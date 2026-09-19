export type WastePathway = 'reuse' | 'recycle' | 'recovery' | 'disposal';

export interface WasteInput {
  wasteType: string;
  quantity: number;
  purity: number;
  moisture: number;
  contamination: number;
  marketDemand: number;
  transportDistance: number;
  buyerAvailability: number;
}

export interface RecommendationResult {
  pathway: WastePathway;
  buyer: string;
  revenue: number;
  transportCost: number;
  processingCost: number;
  netProfit: number;
  co2Saved: number;
  confidence: number;
}
