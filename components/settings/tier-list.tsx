"use client";

import { useState } from "react";
import {
  createRunnerFeeTier,
  deleteRunnerFeeTier,
  updateRunnerFeeTier,
} from "@/app/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Pencil, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface Tier {
  id: string;
  minItems: number;
  maxItems: number;
  feeAmount: number;
}

export function TierList({ initialTiers }: { initialTiers: Tier[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    minItems: 0,
    maxItems: 0,
    feeAmount: 0,
  });
  const [newTier, setNewTier] = useState({
    minItems: "",
    maxItems: "",
    feeAmount: "",
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createRunnerFeeTier({
        minItems: parseInt(newTier.minItems),
        maxItems: parseInt(newTier.maxItems),
        feeAmount: parseFloat(newTier.feeAmount),
      });
      setNewTier({ minItems: "", maxItems: "", feeAmount: "" });
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tier?")) return;
    try {
      await deleteRunnerFeeTier(id);
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (tier: Tier) => {
    setEditingId(tier.id);
    setEditData({
      minItems: tier.minItems,
      maxItems: tier.maxItems,
      feeAmount: tier.feeAmount,
    });
  };

  const handleSave = async (id: string) => {
    setLoading(true);
    try {
      await updateRunnerFeeTier(id, editData);
      setEditingId(null);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Current Fee Tiers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {initialTiers.map((tier) => (
              <div
                key={tier.id}
                className="rounded-lg border bg-card p-4 shadow-sm"
              >
                {editingId === tier.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">
                          Min Items
                        </label>
                        <Input
                          type="number"
                          min="0"
                          value={editData.minItems}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              minItems: parseInt(e.target.value),
                            })
                          }
                          className="h-8"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">
                          Max Items
                        </label>
                        <Input
                          type="number"
                          min="0"
                          value={editData.maxItems}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              maxItems: parseInt(e.target.value),
                            })
                          }
                          className="h-8"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">
                        Fee (R)
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={editData.feeAmount}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            feeAmount: parseFloat(e.target.value),
                          })
                        }
                        className="h-8"
                      />
                    </div>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSave(tier.id)}
                        disabled={loading}
                        className="h-8 w-8 text-green-500 hover:text-green-700"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCancel}
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Items
                      </span>
                      <span className="font-medium">
                        {tier.minItems} - {tier.maxItems}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Fee</span>
                      <span className="font-semibold">
                        R{tier.feeAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-end gap-1 pt-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(tier)}
                        className="h-8 w-8 text-blue-500 hover:text-blue-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(tier.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {initialTiers.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              No tiers defined.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New Tier</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Min Items</label>
                <Input
                  type="number"
                  min="0"
                  value={newTier.minItems}
                  onChange={(e) =>
                    setNewTier({ ...newTier, minItems: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Items</label>
                <Input
                  type="number"
                  min="0"
                  value={newTier.maxItems}
                  onChange={(e) =>
                    setNewTier({ ...newTier, maxItems: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fee Amount (R)</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={newTier.feeAmount}
                onChange={(e) =>
                  setNewTier({ ...newTier, feeAmount: e.target.value })
                }
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              style={{ border: "1px solid white" }}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Tier
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
