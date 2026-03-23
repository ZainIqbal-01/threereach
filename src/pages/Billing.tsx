import { Check, CreditCard, Download, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const invoices = [
  { id: "INV-001", date: "Jan 1, 2026", amount: "$99.00", status: "Paid" },
  { id: "INV-002", date: "Dec 1, 2025", amount: "$99.00", status: "Paid" },
  { id: "INV-003", date: "Nov 1, 2025", amount: "$99.00", status: "Paid" },
];

const usageMetrics = [
  { label: "Scans Used", current: 42, max: 100, unit: "scans" },
  { label: "Proof Records", current: 6, max: 50, unit: "records" },
  { label: "Submissions", current: 18, max: 60, unit: "remaining" },
];

export default function Billing() {
  return (
    <div className="space-y-8 animate-slide-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy">Billing</h1>
        <p className="text-muted-foreground mt-1">
          Manage your subscription and view usage
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Current Plan */}
        <div className="col-span-5">
          <div className="card-reach h-full">
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-electric-light text-electric text-xs font-medium">
                  Current Plan
                </span>
                <h3 className="text-2xl font-bold text-navy mt-3">Pro Plan</h3>
                <p className="text-muted-foreground mt-1">$99/month</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-electric to-cyan text-white">
                <Zap className="h-6 w-6" />
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {[
                "100 AI scans per month",
                "50 proof records stored",
                "60 directory submissions",
                "Priority support",
                "Weekly reports",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-navy">
                  <Check className="h-4 w-4 text-cyan" />
                  {feature}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border space-y-3">
              <Button className="w-full bg-electric hover:bg-electric-hover text-primary-foreground">
                Upgrade to Enterprise
              </Button>
              <Button variant="outline" className="w-full">
                Manage Subscription
              </Button>
            </div>
          </div>
        </div>

        {/* Usage */}
        <div className="col-span-7">
          <div className="card-reach mb-6">
            <h3 className="text-lg font-semibold text-navy mb-6">Monthly Usage</h3>
            <div className="space-y-6">
              {usageMetrics.map((metric, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-navy">{metric.label}</span>
                    <span className="text-sm text-muted-foreground">
                      {metric.current} / {metric.max} {metric.unit}
                    </span>
                  </div>
                  <Progress value={(metric.current / metric.max) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="card-reach mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <CreditCard className="h-6 w-6 text-navy" />
                </div>
                <div>
                  <p className="text-sm font-medium text-navy">Visa ending in 4242</p>
                  <p className="text-xs text-muted-foreground">Expires 12/27</p>
                </div>
              </div>
              <Button variant="ghost" className="text-electric">
                Update
              </Button>
            </div>
          </div>

          {/* Invoices */}
          <div className="card-reach">
            <h3 className="text-lg font-semibold text-navy mb-4">Invoice History</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell className="text-muted-foreground">{invoice.date}</TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell>
                      <span className="status-badge status-strong">{invoice.status}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="gap-1 text-electric">
                        <Download className="h-4 w-4" />
                        PDF
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
  );
}
