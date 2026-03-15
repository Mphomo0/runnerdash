import { RunnerOrderForm } from "@/components/runner-order-form"

export default function NewRunnerOrderPage() {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">New Runner Order</h2>
      <RunnerOrderForm />
    </div>
  )
}
