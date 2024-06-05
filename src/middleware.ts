export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    "/((?!api/auth|file|login|error|r2.svg|_next/static|_next/image|favicon.ico|robots.txt).*)",
  ],
};
