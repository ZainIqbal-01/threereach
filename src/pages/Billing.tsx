import { Check, CreditCard, Download, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const invoices = [
  { id: "INV-001", date: "Jan 1, 2026", amount: "$99.00", status: "Paid" },
  { id: "INV-002", date: "Dec 1, 2025", amount: "$99.00", status: "Paid" },
  { id: "INV-003", date: "Nov 1, 2025", amount: "$99.00", status: "Paid" },
];

const usageMetrics = [
  { label: "🔍 Scans Used", current: 42, max: 100, unit: "scans" },
  { label: "🛡️ Proof Records", current: 6, max: 50, unit: "records" },
  { label: "📡 Submissions", current: 18, max: 60, unit: "remaining" },
];

export default function Billing() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-black text-foreground">💳 Billing</h1>
        <p className="text-muted-foreground mt-1 font-semibold">Manage your subscription and track usage</p>
      </motion.div>

      <div className="grid grid-cols-12 gap-6">
        {/* Current Plan */}
        <motion.div className="col-span-5" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <div className="card-reach h-full">
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="px-3 py-1.5 rounded-full bg-electric-light text-electric text-xs font-bold border-2 border-electric/20">Current Plan</span>
                <h3 className="text-2xl font-black text-foreground mt-3">Pro Plan 🚀</h3>
                <p className="text-muted-foreground mt-1 font-bold">$99/month</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl" style={{ background: "var(--gradient-primary)" }}>
                ⚡
              </div>
            </div>
            <div className="space-y-3 mb-6">
              {["100 AI scans per month", "50 proof records stored", "60 directory submissions", "Priority support", "Weekly reports"].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-foreground font-semibold">
                  <span className="text-success">✅</span> {feature}
                </div>
              ))}
            </div>
            <div className="pt-4 border-t-2 border-border space-y-3">
              <Button className="w-full bg-electric hover:bg-electric-hover text-primary-foreground rounded-2xl font-bold btn-fun">
                Upgrade to Enterprise 🏆
              </Button>
              <Button variant="outline" className="w-full rounded-2xl border-2 font-bold">Manage Subscription</Button>
            </div>
          </div>
        </motion.div>

        {/* Usage */}
        <motion.div className="col-span-7 space-y-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
          <div className="card-reach">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">📊</span>
              <h3 className="text-lg font-black text-foreground">Monthly Usage</h3>
            </div>
            <div className="space-y-5">
              {usageMetrics.map((metric, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-foreground">{metric.label}</span>
                    <span className="text-sm text-muted-foreground font-bold">{metric.current}/{metric.max} {metric.unit}</span>
                  </div>
                  <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ background: "var(--gradient-primary)" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(metric.current / metric.max) * 100}%` }}
                      transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-reach">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-3xl">💳</span>
                <div>
                  <p className="text-sm font-bold text-foreground">Visa ending in 4242</p>
                  <p className="text-xs text-muted-foreground font-semibold">Expires 12/27</p>
                </div>
              </div>
              <Button variant="ghost" className="text-electric font-bold rounded-xl">Update</Button>
            </div>
          </div>

          <div className="card-reach">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🧾</span>
              <h3 className="text-lg font-black text-foreground">Invoice History</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Invoice</TableHead>
                  <TableHead className="font-bold">Date</TableHead>
                  <TableHead className="font-bold">Amount</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="text-right font-bold"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-bold">{inv.id}</TableCell>
                    <TableCell className="text-muted-foreground font-semibold">{inv.date}</TableCell>
                    <TableCell className="font-bold">{inv.amount}</TableCell>
                    <TableCell><span className="status-badge status-strong">{inv.status} ✅</span></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="gap-1 text-electric font-bold rounded-xl">
                        <Download className="h-4 w-4" /> PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
