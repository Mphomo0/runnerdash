import { OrderForm } from "@/components/orders/order-form";

export default function NewOrderPage() {
  return (
    <div
      className="min-h-full"
      style={{ backgroundColor: "var(--bg-base)", padding: "2rem" }}
    >
      <header className="mb-8">
        <p
          className="text-base sm:text-xs font-semibold tracking-widest uppercase mb-1"
          style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}
        >
          Orders
        </p>
        <h2
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--text-primary)",
          }}
        >
          Create New Order
        </h2>
      </header>
      <OrderForm />
    </div>
  );
}
