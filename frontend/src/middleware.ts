import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { toast } from "react-toastify";

export function middleware(request: NextRequest) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");

  if (!accessToken && request.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  
  if (request.nextUrl.pathname.startsWith("/admin") && !request.cookies.get("isAdmin")) {
    console.log("Redirecting to /dashboard");
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    response.cookies.set("showToast", JSON.stringify({ type: "error", message: "You do not have permission to access this page." }), { path: "/", httpOnly: false });
    return response;
  }

  return NextResponse.next();

}

export const config = {
  matcher: ["/((?!api|auth|_next/static|_next/image|.*\\.png$).*)"],
};