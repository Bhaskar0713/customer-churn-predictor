export interface PredictionRecord {
  id: string;
  timestamp: string;
  customerData: CustomerInput;
  churnProbability: number;
  retentionProbability: number;
  prediction: "Churn" | "Retain";
  model: string;
}

export interface CustomerInput {
  gender: string;
  seniorCitizen: boolean;
  partner: boolean;
  dependents: boolean;
  tenure: number;
  phoneService: boolean;
  internetService: string;
  contract: string;
  paperlessBilling: boolean;
  paymentMethod: string;
  monthlyCharges: number;
  totalCharges: number;
}

const STORAGE_KEY = "churn_predictions";

// Seed data
const seedData: PredictionRecord[] = [
  { id: "1", timestamp: "2026-03-08T09:15:00Z", customerData: { gender: "Male", seniorCitizen: false, partner: true, dependents: false, tenure: 2, phoneService: true, internetService: "Fiber optic", contract: "Month-to-month", paperlessBilling: true, paymentMethod: "Electronic check", monthlyCharges: 89.5, totalCharges: 179.0 }, churnProbability: 0.82, retentionProbability: 0.18, prediction: "Churn", model: "Gradient Boosting" },
  { id: "2", timestamp: "2026-03-08T10:30:00Z", customerData: { gender: "Female", seniorCitizen: false, partner: true, dependents: true, tenure: 48, phoneService: true, internetService: "DSL", contract: "Two year", paperlessBilling: false, paymentMethod: "Bank transfer", monthlyCharges: 55.0, totalCharges: 2640.0 }, churnProbability: 0.12, retentionProbability: 0.88, prediction: "Retain", model: "Random Forest" },
  { id: "3", timestamp: "2026-03-07T14:20:00Z", customerData: { gender: "Female", seniorCitizen: true, partner: false, dependents: false, tenure: 5, phoneService: true, internetService: "Fiber optic", contract: "Month-to-month", paperlessBilling: true, paymentMethod: "Electronic check", monthlyCharges: 95.0, totalCharges: 475.0 }, churnProbability: 0.91, retentionProbability: 0.09, prediction: "Churn", model: "Gradient Boosting" },
  { id: "4", timestamp: "2026-03-07T16:45:00Z", customerData: { gender: "Male", seniorCitizen: false, partner: true, dependents: true, tenure: 72, phoneService: true, internetService: "DSL", contract: "Two year", paperlessBilling: false, paymentMethod: "Credit card", monthlyCharges: 42.0, totalCharges: 3024.0 }, churnProbability: 0.05, retentionProbability: 0.95, prediction: "Retain", model: "Random Forest" },
  { id: "5", timestamp: "2026-03-06T11:00:00Z", customerData: { gender: "Male", seniorCitizen: false, partner: false, dependents: false, tenure: 1, phoneService: false, internetService: "Fiber optic", contract: "Month-to-month", paperlessBilling: true, paymentMethod: "Electronic check", monthlyCharges: 75.0, totalCharges: 75.0 }, churnProbability: 0.78, retentionProbability: 0.22, prediction: "Churn", model: "Gradient Boosting" },
  { id: "6", timestamp: "2026-03-06T13:30:00Z", customerData: { gender: "Female", seniorCitizen: false, partner: true, dependents: false, tenure: 34, phoneService: true, internetService: "DSL", contract: "One year", paperlessBilling: true, paymentMethod: "Mailed check", monthlyCharges: 60.0, totalCharges: 2040.0 }, churnProbability: 0.25, retentionProbability: 0.75, prediction: "Retain", model: "Random Forest" },
  { id: "7", timestamp: "2026-03-05T09:00:00Z", customerData: { gender: "Male", seniorCitizen: true, partner: false, dependents: false, tenure: 10, phoneService: true, internetService: "Fiber optic", contract: "Month-to-month", paperlessBilling: true, paymentMethod: "Electronic check", monthlyCharges: 99.0, totalCharges: 990.0 }, churnProbability: 0.87, retentionProbability: 0.13, prediction: "Churn", model: "Gradient Boosting" },
  { id: "8", timestamp: "2026-03-05T15:20:00Z", customerData: { gender: "Female", seniorCitizen: false, partner: true, dependents: true, tenure: 60, phoneService: true, internetService: "No", contract: "Two year", paperlessBilling: false, paymentMethod: "Bank transfer", monthlyCharges: 20.0, totalCharges: 1200.0 }, churnProbability: 0.03, retentionProbability: 0.97, prediction: "Retain", model: "Random Forest" },
];

export function getPredictions(): PredictionRecord[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
    return seedData;
  }
  return JSON.parse(stored);
}

export function addPrediction(record: PredictionRecord) {
  const predictions = getPredictions();
  predictions.unshift(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(predictions));
}

export function mockPredict(input: CustomerInput): { churnProbability: number; model: string } {
  // Mock ML prediction based on feature importance patterns from real telco churn data
  let score = 0.3;
  
  if (input.contract === "Month-to-month") score += 0.25;
  if (input.contract === "Two year") score -= 0.2;
  if (input.internetService === "Fiber optic") score += 0.15;
  if (input.tenure < 6) score += 0.15;
  if (input.tenure > 40) score -= 0.15;
  if (input.paperlessBilling) score += 0.05;
  if (input.paymentMethod === "Electronic check") score += 0.1;
  if (input.monthlyCharges > 80) score += 0.1;
  if (input.seniorCitizen) score += 0.05;
  if (input.partner) score -= 0.05;
  if (input.dependents) score -= 0.05;
  
  // Add slight randomness
  score += (Math.random() - 0.5) * 0.08;
  const churnProbability = Math.max(0.02, Math.min(0.98, score));
  
  const model = churnProbability > 0.5 ? "Gradient Boosting" : "Random Forest";
  return { churnProbability, model };
}

export function getStats() {
  const predictions = getPredictions();
  const total = predictions.length;
  const churnCount = predictions.filter(p => p.prediction === "Churn").length;
  const retainCount = total - churnCount;
  const avgChurnProb = total > 0 ? predictions.reduce((s, p) => s + p.churnProbability, 0) / total : 0;
  return { total, churnCount, retainCount, avgChurnProb };
}
