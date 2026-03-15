import { getRunnerFeeTiers } from "@/app/actions/settings"

export const dynamic = 'force-dynamic'

import { TierList } from "@/components/settings/tier-list"

export default async function SettingsPage() {
  const tiers = await getRunnerFeeTiers()

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Runner Fee Settings</h2>
      <div className="grid gap-4">
        <TierList initialTiers={tiers} />
      </div>
    </div>
  )
}
