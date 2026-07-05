import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const isPublicRoute = createRouteMatcher(["/login(.*)", "/unauthorized(.*)"]);

const isProtectedRoute = createRouteMatcher(["/(dashboard)(.*)"]);

// Admin status rarely changes — cache it per user so we don't pay a
// Convex round-trip on every navigation. Fluid Compute reuses instances,
// so this map survives across requests. 5-minute TTL.
const ADMIN_CACHE_TTL_MS = 5 * 60 * 1000;
const adminCache = new Map<string, { isAdmin: boolean; expires: number }>();

async function checkIsAdmin(userId: string): Promise<boolean> {
  const cached = adminCache.get(userId);
  if (cached && cached.expires > Date.now()) {
    return cached.isAdmin;
  }
  const isAdmin = await convex.query(api.auth.isAdmin, {
    clerkUserId: userId,
  });
  adminCache.set(userId, {
    isAdmin,
    expires: Date.now() + ADMIN_CACHE_TTL_MS,
  });
  return isAdmin;
}

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId } = await auth();

    if (!userId) {
      const { redirectToSignIn } = await auth();
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    const isAdmin = await checkIsAdmin(userId);

    if (!isAdmin) {
      const url = new URL(req.url);
      url.pathname = "/unauthorized";
      return Response.redirect(url);
    }
  } else if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
