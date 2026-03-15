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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Min Items</TableHead>
                <TableHead>Max Items</TableHead>
                <TableHead>Fee (R)</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialTiers.map((tier) => (
                <TableRow key={tier.id}>
                  {editingId === tier.id ? (
                    <>
                      <TableCell>
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
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
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
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
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
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSave(tier.id)}
                            disabled={loading}
                            className="text-green-500 hover:text-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleCancel}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{tier.minItems}</TableCell>
                      <TableCell>{tier.maxItems}</TableCell>
                      <TableCell>R{tier.feeAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(tier)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(tier.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
              {initialTiers.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground"
                  >
                    No tiers defined.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
