import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const models = [
  { name: "Decision Tree", accuracy: 79.2, precision: 76.5, recall: 72.1, f1: 74.2, color: "hsl(38, 92%, 50%)" },
  { name: "Random Forest", accuracy: 84.7, precision: 82.3, recall: 78.9, f1: 80.5, color: "hsl(152, 60%, 42%)" },
  { name: "Gradient Boosting", accuracy: 86.3, precision: 84.1, recall: 81.5, f1: 82.8, color: "hsl(220, 72%, 50%)" },
];

const featureImportance = [
  { feature: "Contract", importance: 0.28 },
  { feature: "Tenure", importance: 0.22 },
  { feature: "Monthly Charges", importance: 0.16 },
  { feature: "Internet Service", importance: 0.12 },
  { feature: "Payment Method", importance: 0.08 },
  { feature: "Total Charges", importance: 0.06 },
  { feature: "Paperless Billing", importance: 0.04 },
  { feature: "Senior Citizen", importance: 0.04 },
];

const ModelInfo = () => (
  <div className="space-y-6 max-w-5xl">
    <div>
      <h2 className="text-2xl font-bold text-foreground">Model Information</h2>
      <p className="text-sm text-muted-foreground mt-1">Comparison of trained ML models and feature analysis</p>
    </div>

    <div className="grid gap-4 md:grid-cols-3">
      {models.map(m => (
        <Card key={m.name} className={`shadow-sm ${m.name === "Gradient Boosting" ? "ring-2 ring-primary/30" : ""}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{m.name}</CardTitle>
              {m.name === "Gradient Boosting" && <Badge variant="default" className="text-xs">Best</Badge>}
            </div>
            <CardDescription>Performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              ["Accuracy", m.accuracy],
              ["Precision", m.precision],
              ["Recall", m.recall],
              ["F1 Score", m.f1],
            ].map(([label, val]) => (
              <div key={label as string}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">{label as string}</span>
                  <span className="font-mono font-medium">{val as number}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${val as number}%`, backgroundColor: m.color }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>

    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Feature Importance (Gradient Boosting)</CardTitle>
        <CardDescription>Top features contributing to churn prediction</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={featureImportance} layout="vertical" margin={{ left: 100 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis type="category" dataKey="feature" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" width={100} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
              <Bar dataKey="importance" fill="hsl(220, 72%, 50%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default ModelInfo;
