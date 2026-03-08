import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPredictions } from "@/lib/prediction-store";

const HistoryPage = () => {
  const predictions = useMemo(() => getPredictions(), []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Prediction History</h2>
        <p className="text-sm text-muted-foreground mt-1">{predictions.length} total predictions recorded</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">All Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left font-medium text-muted-foreground">Timestamp</th>
                  <th className="py-2 text-left font-medium text-muted-foreground">Gender</th>
                  <th className="py-2 text-left font-medium text-muted-foreground">Contract</th>
                  <th className="py-2 text-left font-medium text-muted-foreground">Internet</th>
                  <th className="py-2 text-left font-medium text-muted-foreground">Tenure</th>
                  <th className="py-2 text-left font-medium text-muted-foreground">Monthly</th>
                  <th className="py-2 text-left font-medium text-muted-foreground">Total</th>
                  <th className="py-2 text-left font-medium text-muted-foreground">Model</th>
                  <th className="py-2 text-left font-medium text-muted-foreground">Result</th>
                  <th className="py-2 text-right font-medium text-muted-foreground">Churn %</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map(p => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-2.5 text-muted-foreground whitespace-nowrap">{new Date(p.timestamp).toLocaleString()}</td>
                    <td className="py-2.5">{p.customerData.gender}</td>
                    <td className="py-2.5">{p.customerData.contract}</td>
                    <td className="py-2.5">{p.customerData.internetService}</td>
                    <td className="py-2.5">{p.customerData.tenure} mo</td>
                    <td className="py-2.5">${p.customerData.monthlyCharges}</td>
                    <td className="py-2.5">${p.customerData.totalCharges}</td>
                    <td className="py-2.5 font-mono text-xs">{p.model}</td>
                    <td className="py-2.5">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${p.prediction === "Churn" ? "bg-churn/10 text-churn" : "bg-retain/10 text-retain"}`}>
                        {p.prediction}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-mono">{(p.churnProbability * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoryPage;
