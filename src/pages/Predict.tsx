import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Brain, TrendingDown, TrendingUp } from "lucide-react";
import { CustomerInput, addPrediction, mockPredict } from "@/lib/prediction-store";

const Predict = () => {
  const [form, setForm] = useState<CustomerInput>({
    gender: "Male",
    seniorCitizen: false,
    partner: false,
    dependents: false,
    tenure: 12,
    phoneService: true,
    internetService: "Fiber optic",
    contract: "Month-to-month",
    paperlessBilling: true,
    paymentMethod: "Electronic check",
    monthlyCharges: 70,
    totalCharges: 840,
  });

  const [result, setResult] = useState<{ churnProbability: number; retentionProbability: number; model: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = () => {
    setLoading(true);
    setTimeout(() => {
      const { churnProbability, model } = mockPredict(form);
      const retentionProbability = 1 - churnProbability;
      setResult({ churnProbability, retentionProbability, model });
      addPrediction({
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        customerData: form,
        churnProbability,
        retentionProbability,
        prediction: churnProbability > 0.5 ? "Churn" : "Retain",
        model,
      });
      setLoading(false);
    }, 800);
  };

  const update = (key: keyof CustomerInput, value: unknown) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Predict Customer Churn</h2>
        <p className="text-sm text-muted-foreground mt-1">Enter customer details to predict churn probability</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="shadow-sm lg:col-span-3">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Customer Information</CardTitle>
            <CardDescription>Fill in the customer's service details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={form.gender} onValueChange={v => update("gender", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Contract</Label>
                <Select value={form.contract} onValueChange={v => update("contract", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Month-to-month">Month-to-month</SelectItem>
                    <SelectItem value="One year">One year</SelectItem>
                    <SelectItem value="Two year">Two year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Internet Service</Label>
                <Select value={form.internetService} onValueChange={v => update("internetService", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DSL">DSL</SelectItem>
                    <SelectItem value="Fiber optic">Fiber optic</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select value={form.paymentMethod} onValueChange={v => update("paymentMethod", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronic check">Electronic check</SelectItem>
                    <SelectItem value="Mailed check">Mailed check</SelectItem>
                    <SelectItem value="Bank transfer">Bank transfer</SelectItem>
                    <SelectItem value="Credit card">Credit card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tenure (months)</Label>
                <Input type="number" min={0} max={72} value={form.tenure} onChange={e => update("tenure", +e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Monthly Charges ($)</Label>
                <Input type="number" min={0} step={0.5} value={form.monthlyCharges} onChange={e => update("monthlyCharges", +e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Total Charges ($)</Label>
                <Input type="number" min={0} step={1} value={form.totalCharges} onChange={e => update("totalCharges", +e.target.value)} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {([
                ["seniorCitizen", "Senior Citizen"],
                ["partner", "Has Partner"],
                ["dependents", "Has Dependents"],
                ["phoneService", "Phone Service"],
                ["paperlessBilling", "Paperless Billing"],
              ] as const).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between rounded-lg border p-3">
                  <Label className="cursor-pointer">{label}</Label>
                  <Switch checked={form[key] as boolean} onCheckedChange={v => update(key, v)} />
                </div>
              ))}
            </div>

            <Button onClick={handlePredict} disabled={loading} className="w-full gap-2" size="lg">
              <Brain className="h-4 w-4" />
              {loading ? "Running Model..." : "Predict Churn"}
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          {result ? (
            <>
              <Card className={`shadow-sm border-2 ${result.churnProbability > 0.5 ? "border-churn/30" : "border-retain/30"}`}>
                <CardContent className="p-6 text-center space-y-3">
                  <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${result.churnProbability > 0.5 ? "bg-churn/10" : "bg-retain/10"}`}>
                    {result.churnProbability > 0.5 ? <TrendingDown className="h-7 w-7 text-churn" /> : <TrendingUp className="h-7 w-7 text-retain" />}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Prediction</p>
                    <p className={`text-2xl font-bold ${result.churnProbability > 0.5 ? "text-churn" : "text-retain"}`}>
                      {result.churnProbability > 0.5 ? "Likely to Churn" : "Likely to Stay"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardContent className="p-5 space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Churn Probability</span>
                      <span className="font-mono font-medium text-churn">{(result.churnProbability * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full rounded-full bg-churn transition-all duration-700" style={{ width: `${result.churnProbability * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Retention Probability</span>
                      <span className="font-mono font-medium text-retain">{(result.retentionProbability * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full rounded-full bg-retain transition-all duration-700" style={{ width: `${result.retentionProbability * 100}%` }} />
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">Model Used</p>
                    <p className="font-mono text-sm font-medium">{result.model}</p>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="shadow-sm">
              <CardContent className="p-8 text-center">
                <Brain className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">Fill in customer details and click predict to see results</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Predict;
