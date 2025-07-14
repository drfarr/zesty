"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useDashboardData } from "@/hooks/use-dashboard";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { Loader2, Package, RefreshCw, Scale, TrendingUp } from "lucide-react";

const chartConfig = {
  totalWeight: {
    label: "Total Weight (kg)",
    color: "hsl(var(--chart-1))",
  },
  itemCount: {
    label: "Item Count",
    color: "hsl(var(--chart-2))",
  },
  expired: {
    label: "Expired",
    color: "hsl(var(--destructive))",
  },
  critical: {
    label: "Critical (≤3 days)",
    color: "hsl(var(--orange))",
  },
  warning: {
    label: "Warning (4-7 days)",
    color: "hsl(var(--yellow))",
  },
  good: {
    label: "Good (8-30 days)",
    color: "hsl(var(--chart-1))",
  },
  longTerm: {
    label: "Long-term (>30 days)",
    color: "hsl(var(--chart-2))",
  },
};

const pieColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
  "hsl(var(--chart-7))",
  "hsl(var(--chart-8))",
];

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
};

const Dashboard = () => {
  const {
    surplusData,
    metadata,
    daysRemainingByCategory,
    daysRemainingSummary,
    loading,
    error,
    refetchAll,
  } = useDashboardData();

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Dashboard</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={refetchAll} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 px-6  py-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ingredients Dashboard</h1>
          <p className="text-muted-foreground">Overview of your ingredient surplus by category</p>
        </div>
        <Button onClick={refetchAll} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader />
            ) : (
              <>
                <div className="text-2xl font-bold">{metadata?.totalCategories}</div>
                <p className="text-xs text-muted-foreground">Active ingredient categories</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Weight</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader />
            ) : (
              <>
                <div className="text-2xl font-bold">{metadata?.totalWeight.toFixed(2)} kg</div>
                <p className="text-xs text-muted-foreground">Combined ingredient weight</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader />
            ) : (
              <>
                <div className="text-2xl font-bold">{metadata?.totalItems}</div>
                <p className="text-xs text-muted-foreground">Individual ingredient items</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Days Remaining</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader />
            ) : (
              <>
                {" "}
                <div className="text-2xl font-bold">
                  {daysRemainingSummary?.averageDaysRemaining.toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">Until expiry date</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Items</CardTitle>
            <TrendingUp className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader />
            ) : (
              <>
                <div className="text-2xl font-bold text-destructive">
                  {(daysRemainingSummary?.overallStatusCounts?.expired ?? 0) +
                    (daysRemainingSummary?.overallStatusCounts?.critical ?? 0)}
                </div>
                <p className="text-xs text-muted-foreground">Expired or ≤3 days</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Expiry Status by Category Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Expiry Status by Category</CardTitle>
          <CardDescription>Item count breakdown by expiry status for each category</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader />
          ) : (
            <ChartContainer config={chartConfig} className="min-h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={daysRemainingByCategory}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="categoryName"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                    className="text-sm"
                  />
                  <YAxis
                    label={{ value: "Number of Items", angle: -90, position: "insideLeft" }}
                    className="text-sm"
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => [
                          `${value} items`,
                          typeof name === "string"
                            ? name
                                .replace("statusCounts.", "")
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase())
                            : String(name),
                        ]}
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="statusCounts.expired"
                    fill="var(--color-expired)"
                    name="Expired"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="statusCounts.critical"
                    fill="var(--color-critical)"
                    name="Critical"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="statusCounts.warning"
                    fill="var(--color-warning)"
                    name="Warning"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="statusCounts.good"
                    fill="var(--color-good)"
                    name="Good"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="statusCounts.longTerm"
                    fill="var(--color-longTerm)"
                    name="Long-term"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Surplus Weight Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Total Surplus Weight by Category</CardTitle>
            <CardDescription>Weight distribution across ingredient categories</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader />
            ) : (
              <ChartContainer config={chartConfig} className="min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={surplusData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="categoryName"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                      className="text-sm"
                    />
                    <YAxis
                      label={{ value: "Weight (kg)", angle: -90, position: "insideLeft" }}
                      className="text-sm"
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar
                      dataKey="totalWeight"
                      fill="var(--color-totalWeight)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Surplus Weight Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weight Distribution by Category</CardTitle>
            <CardDescription>
              Percentage breakdown of total weight across categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader />
            ) : (
              <ChartContainer config={chartConfig} className="min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={surplusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ categoryName, percent }) =>
                        `${categoryName}: ${(percent * 100).toFixed(1)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="totalWeight"
                    >
                      {surplusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value) => [`${Number(value).toFixed(2)} kg`, "Weight"]}
                        />
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Days Remaining Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Days Remaining by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Days Remaining Distribution by Category</CardTitle>
            <CardDescription>Expiry status breakdown for each ingredient category</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader />
            ) : (
              <ChartContainer config={chartConfig} className="min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={daysRemainingByCategory}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="categoryName"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                      className="text-sm"
                    />
                    <YAxis className="text-sm" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar
                      dataKey="statusCounts.expired"
                      stackId="status"
                      fill="var(--color-expired)"
                      name="Expired"
                    />
                    <Bar
                      dataKey="statusCounts.critical"
                      stackId="status"
                      fill="var(--color-critical)"
                      name="Critical"
                    />
                    <Bar
                      dataKey="statusCounts.warning"
                      stackId="status"
                      fill="var(--color-warning)"
                      name="Warning"
                    />
                    <Bar
                      dataKey="statusCounts.good"
                      stackId="status"
                      fill="var(--color-good)"
                      name="Good"
                    />
                    <Bar
                      dataKey="statusCounts.longTerm"
                      stackId="status"
                      fill="var(--color-longTerm)"
                      name="Long-term"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Overall Expiry Status Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Expiry Status Distribution</CardTitle>
            <CardDescription>Total count of ingredients by expiry status</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader />
            ) : (
              <ChartContainer config={chartConfig} className="min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: "Expired",
                          value: daysRemainingSummary?.overallStatusCounts.expired,
                          fill: "var(--color-expired)",
                        },
                        {
                          name: "Critical",
                          value: daysRemainingSummary?.overallStatusCounts.critical,
                          fill: "var(--color-critical)",
                        },
                        {
                          name: "Warning",
                          value: daysRemainingSummary?.overallStatusCounts.warning,
                          fill: "var(--color-warning)",
                        },
                        {
                          name: "Good",
                          value: daysRemainingSummary?.overallStatusCounts.good,
                          fill: "var(--color-good)",
                        },
                        {
                          name: "Long-term",
                          value: daysRemainingSummary?.overallStatusCounts.longTerm,
                          fill: "var(--color-longTerm)",
                        },
                      ].filter((item) => (item?.value ?? 0) > 0)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) =>
                        `${name}: ${value} (${(percent * 100).toFixed(1)}%)`
                      }
                      outerRadius={100}
                      dataKey="value"
                    ></Pie>
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value, name) => [`${value} items`, name]}
                        />
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Surplus Breakdown</CardTitle>
            <CardDescription>Weight and item distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Category</th>
                      <th className="text-left p-2 font-medium">Weight (kg)</th>
                      <th className="text-left p-2 font-medium">Items</th>
                      <th className="text-left p-2 font-medium">Avg Item (kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {surplusData.map((item, index) => (
                      <tr key={item.categoryId} className={index % 2 === 0 ? "bg-muted/50" : ""}>
                        <td className="p-2 font-medium">{item.categoryName}</td>
                        <td className="p-2">{item.totalWeight.toFixed(2)}</td>
                        <td className="p-2">{item.itemCount}</td>
                        <td className="p-2">{(item.totalWeight / item.itemCount).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Days Remaining Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Expiry Status by Category</CardTitle>
            <CardDescription>Days remaining and status distribution</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Category</th>
                      <th className="text-left p-2 font-medium">Avg Days</th>
                      <th className="text-left p-2 font-medium">Critical</th>
                      <th className="text-left p-2 font-medium">Warning</th>
                      <th className="text-left p-2 font-medium">Good</th>
                    </tr>
                  </thead>
                  <tbody>
                    {daysRemainingByCategory?.map((item, index) => (
                      <tr key={item.categoryId} className={index % 2 === 0 ? "bg-muted/50" : ""}>
                        <td className="p-2 font-medium">{item.categoryName}</td>
                        <td className="p-2">{item?.averageDaysRemaining.toFixed(1)}</td>
                        <td className="p-2">
                          <span className="text-destructive font-medium">
                            {item.statusCounts.expired + item.statusCounts.critical}
                          </span>
                        </td>
                        <td className="p-2">
                          <span className="text-yellow-600 font-medium">
                            {item.statusCounts.warning}
                          </span>
                        </td>
                        <td className="p-2">
                          <span className="text-green-600 font-medium">
                            {item.statusCounts.good + item.statusCounts.longTerm}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
