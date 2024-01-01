import { NextResponse } from "next/server";
export async function middleware(req) {
  const path = req.nextUrl.pathname;
  const publicPath = path === "/signin" || path === "/signup";
  const token = req.cookies.get("LetsChat")?.value || "";

  if (publicPath && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (!token && !publicPath) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }
  if (path.startsWith("/chat" && !token)) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/signin", "/signup", "/chat"],
};
