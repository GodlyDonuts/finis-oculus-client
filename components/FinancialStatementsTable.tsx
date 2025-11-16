// components/FinancialStatementsTable.tsx
"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

interface FinancialStatementsProps {
  financials: {
    annual: {
      incomeStatement: any[];
      balanceSheet: any[];
      cashFlow: any[];
    };
    quarterly: {
      incomeStatement: any[];
      balanceSheet: any[];
      cashFlow: any[];
    };
  } | null;
}

type Period = "annual" | "quarterly";

// Helper function to format the long numbers from the API
const formatValue = (value: number | string | null | undefined): string => {
  if (typeof value === 'number') {
    return (value / 1000).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }) + "k"; // Format as $1,234k
  }
  if (value) return String(value);
  return "N/A";
};

// Sub-component to render the actual table
const StatementTable = ({ data, period }: { data: any[], period: Period }) => {
  if (!data || data.length === 0) {
    return <p className="text-muted-foreground">No {period} data available.</p>;
  }

  // Get headers (dates) - assuming 4 most recent
  const headers = data.slice(0, 4).map(d => new Date(d.asOfDate).getFullYear());
  
  // Get all unique row items (e.g., "Total Revenue", "Net Income")
  // We'll just map over the first entry's keys, excluding the date
  const rowNames = Object.keys(data[0] || {}).filter(key => key !== 'asOfDate' && key !== 'periodType');

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px] text-sm">
        <thead>
          <tr className="border-b border-border/50">
            <th className="py-2 px-3 text-left font-semibold text-muted-foreground">Metric</th>
            {headers.map(header => (
              <th key={header} className="py-2 px-3 text-right font-semibold text-muted-foreground">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowNames.map(rowKey => (
            <tr key={rowKey} className="border-b border-border/50 hover:bg-muted/50">
              <td className="py-2 px-3 font-medium text-foreground">
                {/* Format the key: "totalRevenue" -> "Total Revenue" */}
                {rowKey.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
              </td>
              {data.slice(0, 4).map(entry => (
                <td key={entry.asOfDate + rowKey} className="py-2 px-3 text-right text-muted-foreground">
                  {formatValue(entry[rowKey])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export function FinancialStatementsTable({ financials }: FinancialStatementsProps) {
  const [period, setPeriod] = useState<Period>("annual");

  if (!financials) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Financial Statements</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No financial statement data available to display.</p>
        </CardContent>
      </Card>
    );
  }

  const data = financials[period];

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Financial Statements</CardTitle>
        <ToggleGroup
          type="single"
          value={period}
          onValueChange={(value: Period) => value && setPeriod(value)}
        >
          <ToggleGroupItem value="annual">Annual</ToggleGroupItem>
          <ToggleGroupItem value="quarterly">Quarterly</ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="income">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="income">Income Statement</TabsTrigger>
            <TabsTrigger value="balance">Balance Sheet</TabsTrigger>
            <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          </TabsList>
          <TabsContent value="income" className="mt-4">
            <StatementTable data={data.incomeStatement} period={period} />
          </TabsContent>
          <TabsContent value="balance" className="mt-4">
            <StatementTable data={data.balanceSheet} period={period} />
          </TabsContent>
          <TabsContent value="cashflow" className="mt-4">
            <StatementTable data={data.cashFlow} period={period} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}