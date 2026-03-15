"use server";

import { convex } from "@/lib/convex";
import { api } from "@/convex/_generated/api";
import { revalidatePath } from "next/cache";
import { Id } from "@/convex/_generated/dataModel";

export async function getRunnerFeeTiers() {
  return await convex.query(api.settings.getRunnerFeeTiers);
}

export async function createRunnerFeeTier(data: {
  minItems: number;
  maxItems: number;
  feeAmount: number;
}) {
  await convex.mutation(api.settings.createRunnerFeeTier, data);
  revalidatePath("/settings");
}

export async function updateRunnerFeeTier(
  id: string,
  data: { minItems: number; maxItems: number; feeAmount: number },
) {
  await convex.mutation(api.settings.updateRunnerFeeTier, {
    id: id as Id<"runnerFeeTiers">,
    ...data,
  });
  revalidatePath("/settings");
}

export async function deleteRunnerFeeTier(id: string) {
  await convex.mutation(api.settings.deleteRunnerFeeTier, {
    id: id as Id<"runnerFeeTiers">,
  });
  revalidatePath("/settings");
}
