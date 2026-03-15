import { query } from "./_generated/server";

const getFeeForQuantity = (tiers: any[], quantity: number) => {
  if (quantity === 0) return 0;
  const tier = tiers.find(
    (t: any) => quantity >= t.minItems && quantity <= t.maxItems,
  );
  if (tier) return tier.feeAmount;

  // If not found in explicit tiers, check if it exceeds the highest tier
  const sortedTiers = [...tiers].sort(
    (a: any, b: any) => b.maxItems - a.maxItems,
  );
  const highestTier = sortedTiers[0];
  if (highestTier && quantity > highestTier.maxItems) {
    return highestTier.feeAmount;
  }
  return 0;
};

// Helper for grouping by week
function getWeekOfMonth(date: Date): number {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  return Math.ceil((date.getDate() + firstDay) / 7);
}

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();
    const runnerOrders = await ctx.db.query("runnerOrders").collect();
    const tiers = await ctx.db.query("runnerFeeTiers").collect();

    const totalOrders = orders.length + runnerOrders.length;
    const completedOrders =
      orders.filter((o) => o.status === "COMPLETED").length +
      runnerOrders.filter((o) => o.status === "COMPLETED").length;

    // Calculate revenue for runner orders based on fee tiers
    const runnerRevenue = runnerOrders
      .filter((o) => o.itemsPaid && o.runnerFeePaid)
      .reduce((sum, o) => {
        const totalQuantity = o.items.reduce((s, item) => s + item.quantity, 0);
        return sum + getFeeForQuantity(tiers, totalQuantity);
      }, 0);

    // Calculate revenue for regular orders (using grandTotal)
    const ordersRevenue = orders
      .filter((o) => o.itemsPaid && o.runnerFeePaid)
      .reduce((sum, o) => sum + o.grandTotal, 0);

    const totalRevenue = runnerRevenue + ordersRevenue;

    const pendingPayments =
      orders.filter((o) => !o.itemsPaid || !o.runnerFeePaid).length +
      runnerOrders.filter((o) => !o.itemsPaid || !o.runnerFeePaid).length;
    const ordersToBuy =
      orders.filter((o) => o.status === "PENDING").length +
      runnerOrders.filter((o) => o.status === "PENDING").length;

    // Breakdown Initialization
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const monthName = now.toLocaleString("default", { month: "long" });

    const weeklyRevenue: {
      [week: string]: { total: number; runner: number; orders: number };
    } = {
      [`Week 1 of ${monthName}`]: { total: 0, runner: 0, orders: 0 },
      [`Week 2 of ${monthName}`]: { total: 0, runner: 0, orders: 0 },
      [`Week 3 of ${monthName}`]: { total: 0, runner: 0, orders: 0 },
      [`Week 4 of ${monthName}`]: { total: 0, runner: 0, orders: 0 },
      [`Week 5 of ${monthName}`]: { total: 0, runner: 0, orders: 0 },
    };
    const monthlyRevenue: {
      [month: string]: { total: number; runner: number; orders: number };
    } = {};
    const yearlyRevenue: {
      [year: string]: { total: number; runner: number; orders: number };
    } = {};

    // Order counts per period
    const weeklyOrders: {
      [week: string]: {
        total: number;
        completed: number;
        pending: number;
        pendingPayment: number;
      };
    } = {};
    const monthlyOrders: {
      [month: string]: {
        total: number;
        completed: number;
        pending: number;
        pendingPayment: number;
      };
    } = {};
    const yearlyOrders: {
      [year: string]: {
        total: number;
        completed: number;
        pending: number;
        pendingPayment: number;
      };
    } = {};

    // Initialize weekly orders
    Object.keys(weeklyRevenue).forEach((week) => {
      weeklyOrders[week] = {
        total: 0,
        completed: 0,
        pending: 0,
        pendingPayment: 0,
      };
    });

    // Helper to aggregate orders
    const aggregateOrders = (allOrders: any[]) => {
      allOrders.forEach((o) => {
        const date = new Date(o._creationTime);
        const isCompleted = o.status === "COMPLETED";
        const hasPendingPayment = !o.itemsPaid || !o.runnerFeePaid;
        const isPending = o.status === "PENDING";

        // Weekly (only for current month)
        if (
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        ) {
          const weekNum = getWeekOfMonth(date);
          const weekKey = `Week ${weekNum} of ${monthName}`;
          if (weeklyOrders[weekKey]) {
            weeklyOrders[weekKey].total++;
            if (isCompleted) weeklyOrders[weekKey].completed++;
            if (isPending) weeklyOrders[weekKey].pending++;
            if (hasPendingPayment) weeklyOrders[weekKey].pendingPayment++;
          }
        }

        // Monthly
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        if (!monthlyOrders[monthKey])
          monthlyOrders[monthKey] = {
            total: 0,
            completed: 0,
            pending: 0,
            pendingPayment: 0,
          };
        monthlyOrders[monthKey].total++;
        if (isCompleted) monthlyOrders[monthKey].completed++;
        if (isPending) monthlyOrders[monthKey].pending++;
        if (hasPendingPayment) monthlyOrders[monthKey].pendingPayment++;

        // Yearly
        const yearKey = String(date.getFullYear());
        if (!yearlyOrders[yearKey])
          yearlyOrders[yearKey] = {
            total: 0,
            completed: 0,
            pending: 0,
            pendingPayment: 0,
          };
        yearlyOrders[yearKey].total++;
        if (isCompleted) yearlyOrders[yearKey].completed++;
        if (isPending) yearlyOrders[yearKey].pending++;
        if (hasPendingPayment) yearlyOrders[yearKey].pendingPayment++;
      });
    };

    aggregateOrders(orders);
    aggregateOrders(runnerOrders);

    // Aggregate Runner Orders Revenue
    runnerOrders
      .filter((o) => o.itemsPaid && o.runnerFeePaid)
      .forEach((o) => {
        const date = new Date(o._creationTime);
        const quantity = o.items.reduce((s, item) => s + item.quantity, 0);
        const revenue = getFeeForQuantity(tiers, quantity);

        // Weekly (only for current month)
        if (
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        ) {
          const weekNum = getWeekOfMonth(date);
          const weekKey = `Week ${weekNum} of ${monthName}`;
          if (weeklyRevenue[weekKey]) {
            weeklyRevenue[weekKey].total += revenue;
            weeklyRevenue[weekKey].runner += revenue;
          }
        }

        // Monthly
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        if (!monthlyRevenue[monthKey])
          monthlyRevenue[monthKey] = { total: 0, runner: 0, orders: 0 };
        monthlyRevenue[monthKey].total += revenue;
        monthlyRevenue[monthKey].runner += revenue;

        // Yearly
        const yearKey = String(date.getFullYear());
        if (!yearlyRevenue[yearKey])
          yearlyRevenue[yearKey] = { total: 0, runner: 0, orders: 0 };
        yearlyRevenue[yearKey].total += revenue;
        yearlyRevenue[yearKey].runner += revenue;
      });

    // Aggregate Regular Orders Revenue
    orders
      .filter((o) => o.itemsPaid && o.runnerFeePaid)
      .forEach((o) => {
        const date = new Date(o._creationTime);
        const revenue = o.grandTotal;

        // Weekly (only for current month)
        if (
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        ) {
          const weekNum = getWeekOfMonth(date);
          const weekKey = `Week ${weekNum} of ${monthName}`;
          if (weeklyRevenue[weekKey]) {
            weeklyRevenue[weekKey].total += revenue;
            weeklyRevenue[weekKey].orders += revenue;
          }
        }

        // Monthly
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        if (!monthlyRevenue[monthKey])
          monthlyRevenue[monthKey] = { total: 0, runner: 0, orders: 0 };
        monthlyRevenue[monthKey].total += revenue;
        monthlyRevenue[monthKey].orders += revenue;

        // Yearly
        const yearKey = String(date.getFullYear());
        if (!yearlyRevenue[yearKey])
          yearlyRevenue[yearKey] = { total: 0, runner: 0, orders: 0 };
        yearlyRevenue[yearKey].total += revenue;
        yearlyRevenue[yearKey].orders += revenue;
      });

    return {
      totalOrders,
      completedOrders,
      totalRevenue,
      runnerRevenue,
      ordersRevenue,
      pendingPayments,
      ordersToBuy,
      weeklyRevenue,
      monthlyRevenue,
      yearlyRevenue,
      weeklyOrders,
      monthlyOrders,
      yearlyOrders,
    };
  },
});
