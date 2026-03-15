"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface ConfirmDeleteButtonProps {
    onDelete: () => Promise<void>
}

export function ConfirmDeleteButton({ onDelete }: ConfirmDeleteButtonProps) {
    const [confirming, setConfirming] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleConfirm = async () => {
        try {
            setLoading(true)
            await onDelete()
        } catch (error) {
            console.error(error)
            alert("Failed to delete order. Please try again.")
            setConfirming(false)
            setLoading(false)
        }
    }

    if (confirming) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-destructive">Are you sure?</span>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleConfirm}
                    disabled={loading}
                >
                    {loading ? "Deleting..." : "Yes, Delete"}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirming(false)}
                    disabled={loading}
                >
                    Cancel
                </Button>
            </div>
        )
    }

    return (
        <Button variant="destructive" onClick={() => setConfirming(true)}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
        </Button>
    )
}
