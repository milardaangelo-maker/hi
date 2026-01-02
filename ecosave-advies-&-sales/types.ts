export interface EnergyData {
  electricityKwh: number;
  gasM3: number;
  monthlyCost: number;
  householdSize: number;
  propertyType: 'apartment' | 'terraced' | 'detached' | 'semi-detached';
}

export interface SavingsReport {
  currentAnnualCost: number;
  projectedAnnualCost: number;
  potentialSavings: number;
  tips: string[];
  roiYear: number;
}

export interface AuditRecord {
  id: string;
  clientName: string;
  address: string;
  date: string;
  notes: string;
  propertyType: string;
  status: 'pending' | 'completed' | 'analyzed';
  aiAnalysis?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
