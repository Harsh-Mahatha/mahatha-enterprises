import Link from "next/link";
import { BarChart3, Boxes, TrendingUp, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Text } from "@/components/ui/Typography";
import { PageHeader } from "@/components/layout/PageHeader";

const reports = [
  {
    title: "Sales",
    description: "Invoices over a date range, filterable by customer.",
    href: "/reports/sales",
    icon: TrendingUp,
  },
  {
    title: "Outstanding",
    description: "Customers who currently owe money, highest first.",
    href: "/reports/outstanding",
    icon: Wallet,
  },
  {
    title: "Stock",
    description: "Current stock for every active product.",
    href: "/reports/stock",
    icon: Boxes,
  },
  {
    title: "Stock movements",
    description: "Every stock entry, sale, and adjustment over a date range.",
    href: "/reports/stock-movements",
    icon: BarChart3,
  },
];

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Reports" description="Business reports, generated from live data." />
      <div className="grid gap-4 sm:grid-cols-2">
        {reports.map((report) => (
          <Link key={report.href} href={report.href}>
            <Card className="h-full transition-colors hover:bg-accent/50">
              <CardHeader className="flex-row items-center gap-3 space-y-0">
                <report.icon className="size-5 text-muted-foreground" />
                <CardTitle>{report.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Text variant="muted">{report.description}</Text>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
