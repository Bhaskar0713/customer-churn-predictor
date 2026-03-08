import { useMemo } from "react";
import { Activity, TrendingDown, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/StatsCard";
import { getPredictions, getStats } from "@/lib/prediction-store";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = {
  churn: "hsl(0, 72%, 55%)",
  retain: "hsl(152, 60%, 42%)",
  primary: "hsl(220, 72%, 50%)",
};

const Dashboard = () => {
  const stats = useMemo(() => getStats(), []);
  const predictions = useMemo(() => getPredictions(), []);

  const barData = useMemo(() => {
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("en", { month: "short", day: "numeric" });
      const dayPreds = predictions.filter(p => p.timestamp.startsWith(key));
      return {
        date: label,
        Churn: dayPreds.filter(p => p.prediction === "Churn").length,
        Retain: dayPreds.filter(p => p.prediction === "Retain").length,
      };
    });
    return last7;
  }, [predictions]);

  const pieData = [
    { name: "Churn", value: stats.churnCount },
    { name: "Retain", value: stats.retainCount },
  ];

  const recentPredictions = predictions.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Analytics Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">Overview of customer churn predictions and model performance</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Predictions" value={stats.total} subtitle="All time" icon={Users} variant="primary" />
        <StatsCard title="Churn Predicted" value={stats.churnCount} subtitle={`${stats.total > 0 ? ((stats.churnCount / stats.total) * 100).toFixed(1) : 0}% of total`} icon={TrendingDown} variant="churn" />
        <StatsCard title="Retained" value={stats.retainCount} subtitle={`${stats.total > 0 ? ((stats.retainCount / stats.total) * 100).toFixed(1) : 0}% of total`} icon={TrendingUp} variant="retain" />
        <StatsCard title="Avg Churn Prob" value={`${(stats.avgChurnProb * 100).toFixed(1)}%`} subtitle="Across all predictions" icon={Activity} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Predictions Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                  <Bar dataKey="Churn" fill={COLORS.churn} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Retain" fill={COLORS.retain} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Churn Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    <Cell fill={COLORS.churn} />
                    <Cell fill={COLORS.retain} />
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Recent Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left font-medium text-muted-foreground">Time</th>
                  <th className="py-2 text-left font-medium text-muted-foreground">Contract</th>
                  <th className="py-2 text-left font-medium text-muted-foreground">Tenure</th>
                  <th className="py-2 text-left font-medium text-muted-foreground">Monthly</th>
                  <th className="py-2 text-left font-medium text-muted-foreground">Model</th>
                  <th className="py-2 text-left font-medium text-muted-foreground">Result</th>
                  <th className="py-2 text-right font-medium text-muted-foreground">Probability</th>
                </tr>
              </thead>
              <tbody>
                {recentPredictions.map(p => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="py-2.5 text-muted-foreground">{new Date(p.timestamp).toLocaleDateString()}</td>
                    <td className="py-2.5">{p.customerData.contract}</td>
                    <td className="py-2.5">{p.customerData.tenure} mo</td>
                    <td className="py-2.5">${p.customerData.monthlyCharges}</td>
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

export default Dashboard;
