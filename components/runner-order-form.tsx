"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { createRunnerOrder, updateRunnerOrder } from "@/app/actions/runner-orders"

const runnerOrderSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  customerPhone: z.string().min(1, "Phone is required"),
  notes: z.string().optional(),
  items: z.array(z.object({
    name: z.string().min(1, "Item name is required"),
    size: z.string().optional(),
    colour: z.string().optional(),
    price: z.coerce.number().min(0, "Price must be positive"),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1")
  })).min(1, "At least one item is required")
})

type RunnerOrderFormValues = z.infer<typeof runnerOrderSchema>

interface RunnerOrderFormProps {
  initialData?: any
  isEdit?: boolean
}

export function RunnerOrderForm({ initialData, isEdit }: RunnerOrderFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<RunnerOrderFormValues>({
    resolver: zodResolver(runnerOrderSchema),
    defaultValues: initialData || {
      customerName: "",
      customerPhone: "",
      notes: "",
      items: [{ name: "", size: "", colour: "", price: 0, quantity: 1 }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items"
  })

  const onSubmit = async (data: RunnerOrderFormValues) => {
    try {
      setLoading(true)
      if (isEdit) {
        await updateRunnerOrder(initialData.id, data)
      } else {
        await createRunnerOrder(data)
      }
      router.push("/runner-orders")
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Customer Name</label>
              <Input {...form.register("customerName")} placeholder="John Doe" />
              {form.formState.errors.customerName && (
                <p className="text-sm text-red-500">{form.formState.errors.customerName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input {...form.register("customerPhone")} placeholder="+1 234 567 890" />
              {form.formState.errors.customerPhone && (
                <p className="text-sm text-red-500">{form.formState.errors.customerPhone.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes (Optional)</label>
              <Input {...form.register("notes")} placeholder="Delivery instructions..." />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Items</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ name: "", size: "", colour: "", price: 0, quantity: 1 })}>
              <Plus className="h-4 w-4 mr-2" /> Add Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-start border p-4 rounded-lg relative bg-muted/20">
                <div className="grid gap-4 flex-1">
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Item Name</label>
                    <Input {...form.register(`items.${index}.name`)} placeholder="T-Shirt" />
                    {form.formState.errors.items?.[index]?.name && (
                      <p className="text-xs text-red-500">{form.formState.errors.items[index]?.name?.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Size</label>
                      <Input {...form.register(`items.${index}.size`)} placeholder="M" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Colour</label>
                      <Input {...form.register(`items.${index}.colour`)} placeholder="Black" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Price (R)</label>
                      <Input type="number" step="0.01" {...form.register(`items.${index}.price`)} />
                      {form.formState.errors.items?.[index]?.price && (
                        <p className="text-xs text-red-500">{form.formState.errors.items[index]?.price?.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Quantity</label>
                      <Input type="number" min="1" {...form.register(`items.${index}.quantity`)} />
                      {form.formState.errors.items?.[index]?.quantity && (
                        <p className="text-xs text-red-500">{form.formState.errors.items[index]?.quantity?.message}</p>
                      )}
                    </div>
                  </div>
                </div>
                <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-100" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {form.formState.errors.items && (
              <p className="text-sm text-red-500">{form.formState.errors.items.message}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading} size="lg" style={{ border: '1px solid white' }}>
          {loading ? "Saving..." : isEdit ? "Update Order" : "Create Order"}
        </Button>
      </div>
    </form>
  )
}
