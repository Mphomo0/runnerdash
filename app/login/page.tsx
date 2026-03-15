"use client"

import { SignIn } from "@clerk/nextjs"

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a] relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0">
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.15)_0%,_transparent_70%)] animate-[spin_25s_linear_infinite]" />
                <div className="absolute top-[20%] right-[-20%] w-[60%] h-[60%] bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.1)_0%,_transparent_70%)]" />
                <div className="absolute bottom-[-10%] left-[10%] w-[40%] h-[40%] bg-[radial-gradient(ellipse_at_center,_rgba(236,72,153,0.08)_0%,_transparent_70%)]" />
            </div>

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: "60px 60px",
                }}
            />

            <div className="relative z-10 w-full max-w-md px-4 flex flex-col items-center">
                {/* Logo / Branding */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 mb-4 shadow-lg shadow-blue-500/25">
                        <span className="text-2xl font-bold text-white">R</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Runner Dash
                    </h1>
                    <p className="text-sm text-zinc-400 mt-2">
                        Sign in to manage your orders
                    </p>
                </div>

                {/* Login Component (Requires configuring Google Google-only in Clerk Dashboard) */}
                <SignIn fallbackRedirectUrl="/" routing="hash" />

                <p className="text-center text-xs text-zinc-600 mt-6">
                    Runner Dashboard • Personal Management
                </p>
            </div>
        </div>
    )
}
