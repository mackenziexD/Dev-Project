import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

export function middleware(request: NextRequest) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");

  if (!accessToken && request.nextUrl.pathname !== "/") {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  if (request.nextUrl.pathname.startsWith("/admin") && request.cookies.get("isAdmin")?.value !== "true") {
    console.log("Redirecting to /dashboard for admin");
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    response.cookies.set("showToast", JSON.stringify({ type: "error", message: "You do not have permission to access this page." }), { path: "/", httpOnly: false });
    return response;
  }
  
  if (request.nextUrl.pathname.startsWith("/staff") && !(request.cookies.get("isStaff")?.value === "true" || request.cookies.get("isAdmin")?.value === "true")) {
      console.log("Redirecting to /dashboard for staff");
      const response = NextResponse.redirect(new URL("/dashboard", request.url));
      response.cookies.set("showToast", JSON.stringify({ type: "error", message: "You do not have permission to access this page." }), { path: "/", httpOnly: false });
      return response;
  }

  return NextResponse.next();

}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};