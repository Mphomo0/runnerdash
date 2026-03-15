import { getRunnerOrders } from "@/app/actions/runner-orders"

export const dynamic = 'force-dynamic'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { format } from "date-fns"
import { Plus, Search, MoreHorizontal } from "lucide-react"

export default async function RunnerOrdersPage({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const { search } = await searchParams
  const orders = await getRunnerOrders(search)

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Runner Orders</h2>
        <Link href="/runner-orders/new">
          <Button style={{ border: '1px solid white' }}>
            <Plus className="mr-2 h-4 w-4" /> New Runner Order
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        <form className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="search"
            placeholder="Search customer..."
            name="search"
            defaultValue={search}
            className="h-9 w-[150px] lg:w-[250px]"
          />
          <Button type="submit" size="sm" variant="secondary">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Date</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  <Link href={`/runner-orders/${order.id}`} className="hover:underline">
                    {order.id.slice(-6)}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{order.customerName}</span>
                    <span className="text-xs text-muted-foreground">{order.customerPhone}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={
                    order.status === 'COMPLETED' ? 'success' :
                      order.status === 'PENDING' ? 'warning' : 'secondary'
                  }>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>{order.items.length}</TableCell>
                <TableCell>R{order.grandTotal.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge variant={order.runnerFeePaid ? "success" : "destructive"} className="w-fit text-[10px] px-1 py-0">
                      Fee: {order.runnerFeePaid ? "Paid" : "Unpaid"}
                    </Badge>
                    <Badge variant={order.itemsPaid ? "success" : "destructive"} className="w-fit text-[10px] px-1 py-0">
                      Items: {order.itemsPaid ? "Paid" : "Unpaid"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">{format(order.createdAt, 'MMM d, yyyy')}</TableCell>
                <TableCell>
                  <Link href={`/runner-orders/${order.id}`}>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No runner orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
