import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const privateRoutes = ["/private", "/dashboard", "/admin"];
const adminRoutes = ["/dashboard"];

export async function proxy(req) {
  const token = await getToken({ req });
  const reqPath = req.nextUrl.pathname;
  const isAuthenticated = Boolean(token);
  const isUser = token?.role === "user";
  const isAdmin = token?.role === "admin";
  const isPrivate = privateRoutes.some((route) => reqPath.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => reqPath.startsWith(route));

  if (!isAuthenticated && isPrivate) {
    const desireUrl = new URL("/api/auth/signin", req.url);
    desireUrl.searchParams.set("callbackUrl", reqPath);
    return NextResponse.redirect(desireUrl);
  }

  if (isAuthenticated && !isAdmin && isAdminRoute) {
    const desireUrl = new URL("/forbidden", req.url);
    return NextResponse.rewrite(desireUrl);
  }

  console.log("From Proxy", { isAuthenticated, isUser, reqPath, isPrivate });

  return NextResponse.next();
}

// Alternatively, you can use a default export:
// export default function proxy(request) { ... }

export const config = {
  matcher: ["/private/:path*", "/dashboard/:path*", "/admin/:path*"],
};
