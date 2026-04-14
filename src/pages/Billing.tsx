import { useState } from "react";
import { Check, CreditCard, Download, Zap, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StarAgent } from "@/components/StarAgent";
import { toast } from "@/hooks/use-toast";

const invoices = [
  { id: "INV-001", date: "Jan 1, 2026", amount: "$99.00", status: "Paid" },
  { id: "INV-002", date: "Dec 1, 2025", amount: "$99.00", status: "Paid" },
  { id: "INV-003", date: "Nov 1, 2025", amount: "$99.00", status: "Paid" },
];

export default function Billing() {
  const [plan, setPlan] = useState("pro");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showUpdateCard, setShowUpdateCard] = useState(false);
  const [cardNumber, setCardNumber] = useState("");

  const usageMetrics = [
    { label: "Scans Used", current: 42, max: plan === "enterprise" ? 500 : 100, unit: "scans" },
    { label: "Proof Records", current: 6, max: plan === "enterprise" ? 200 : 50, unit: "records" },
    { label: "Submissions", current: 18, max: plan === "enterprise" ? 200 : 60, unit: "remaining" },
  ];

  const handleUpgrade = () => {
    setPlan("enterprise");
    setShowUpgrade(false);
    toast({ title: "🎉 Upgraded to Enterprise!", description: "You now have access to all premium features" });
  };

  const handleUpdateCard = () => {
    if (cardNumber.length < 4) {
      toast({ title: "Invalid card", variant: "destructive" });
      return;
    }
    setShowUpdateCard(false);
    setCardNumber("");
    toast({ title: "💳 Card updated!", description: `Card ending in ${cardNumber.slice(-4)} saved` });
  };

  const downloadInvoice = (id: string) => {
    const content = `INVOICE: ${id}\nThree Reach AI - ${plan === "enterprise" ? "Enterprise" : "Pro"} Plan\nAmount: $99.00\nStatus: Paid`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "📥 Invoice downloaded" });
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center gap-4">
        <StarAgent mood="happy" size={48} animate={true} />
        <div>
          <h1 className="text-xl font-bold text-foreground">Billing</h1>
          <p className="text-sm text-muted-foreground">Manage your subscription and view usage</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Current Plan */}
        <div className="col-span-5">
          <div className="card-reach h-full">
            <div className="flex items-start justify-between mb-5">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-medium">Current Plan</span>
                <h3 className="text-xl font-bold text-foreground mt-2">{plan === "enterprise" ? "Enterprise Plan" : "Pro Plan"}</h3>
                <p className="text-sm text-muted-foreground">{plan === "enterprise" ? "$299/month" : "$99/month"}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                {plan === "enterprise" ? <Star className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
              </div>
            </div>

            <div className="space-y-2.5 mb-5">
              {(plan === "enterprise" 
                ? ["500 AI scans per month", "200 proof records stored", "200 directory submissions", "Dedicated support", "Custom reports", "API access"]
                : ["100 AI scans per month", "50 proof records stored", "60 directory submissions", "Priority support", "Weekly reports"]
              ).map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-foreground">
                  <Check className="h-3.5 w-3.5 text-accent shrink-0" />
                  {feature}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border/60 space-y-2.5">
              {plan !== "enterprise" && (
                <Button onClick={() => setShowUpgrade(true)} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-10 text-xs">
                  Upgrade to Enterprise
                </Button>
              )}
              <Button variant="outline" onClick={() => toast({ title: "Subscription portal", description: "Redirecting to billing portal..." })} className="w-full rounded-xl h-10 text-xs">
                Manage Subscription
              </Button>
            </div>
          </div>
        </div>

        {/* Usage & Invoices */}
        <div className="col-span-7 space-y-5">
          <div className="card-reach">
            <h3 className="text-sm font-semibold text-foreground mb-5">Monthly Usage</h3>
            <div className="space-y-4">
              {usageMetrics.map((metric, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-foreground">{metric.label}</span>
                    <span className="text-xs text-muted-foreground">{metric.current} / {metric.max} {metric.unit}</span>
                  </div>
                  <Progress value={(metric.current / metric.max) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </div>

          <div className="card-reach">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                  <CreditCard className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">Visa ending in 4242</p>
                  <p className="text-[10px] text-muted-foreground">Expires 12/27</p>
                </div>
              </div>
              <Button variant="ghost" onClick={() => setShowUpdateCard(true)} className="text-primary text-xs">Update</Button>
            </div>
          </div>

          <div className="card-reach">
            <h3 className="text-sm font-semibold text-foreground mb-3">Invoice History</h3>
            <div className="rounded-xl border border-border/60 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/50">
                    <TableHead className="text-[11px] uppercase tracking-wider">Invoice</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider">Date</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider">Amount</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider">Status</TableHead>
                    <TableHead className="text-right text-[11px] uppercase tracking-wider"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id} className="hover:bg-secondary/30">
                      <TableCell className="text-xs font-medium">{inv.id}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{inv.date}</TableCell>
                      <TableCell className="text-xs">{inv.amount}</TableCell>
                      <TableCell><span className="status-badge status-strong">{inv.status}</span></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => downloadInvoice(inv.id)} className="gap-1 text-primary text-xs h-7">
                          <Download className="h-3.5 w-3.5" /> PDF
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm animate-fade-in" onClick={() => setShowUpgrade(false)}>
          <div className="bg-card rounded-2xl border border-border/60 p-6 max-w-md w-full mx-4 animate-scale-in shadow-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Upgrade to Enterprise</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowUpgrade(false)} className="h-7 w-7 p-0"><X className="h-4 w-4" /></Button>
            </div>
            <div className="text-center py-4">
              <StarAgent mood="excited" size={64} />
              <h4 className="text-lg font-bold text-foreground mt-3">$299/month</h4>
              <p className="text-xs text-muted-foreground mt-1">Unlock full potential with unlimited features</p>
            </div>
            <div className="space-y-2 my-4">
              {["500 AI scans/month", "200 proof records", "Dedicated support", "Custom reports", "Full API access"].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-foreground">
                  <Check className="h-3.5 w-3.5 text-accent" /> {f}
                </div>
              ))}
            </div>
            <Button onClick={handleUpgrade} className="w-full rounded-xl h-10 bg-primary hover:bg-primary/90 text-primary-foreground text-xs">
              Confirm Upgrade
            </Button>
          </div>
        </div>
      )}

      {/* Update Card Modal */}
      {showUpdateCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm animate-fade-in" onClick={() => setShowUpdateCard(false)}>
          <div className="bg-card rounded-2xl border border-border/60 p-6 max-w-sm w-full mx-4 animate-scale-in shadow-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Update Payment Method</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowUpdateCard(false)} className="h-7 w-7 p-0"><X className="h-4 w-4" /></Button>
            </div>
            <div className="space-y-3">
              <Input placeholder="Card number" value={cardNumber} onChange={e => setCardNumber(e.target.value)} className="h-10 rounded-xl text-xs" />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="MM/YY" className="h-10 rounded-xl text-xs" />
                <Input placeholder="CVC" className="h-10 rounded-xl text-xs" />
              </div>
              <Button onClick={handleUpdateCard} className="w-full rounded-xl h-10 bg-primary hover:bg-primary/90 text-primary-foreground text-xs">
                Save Card
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}