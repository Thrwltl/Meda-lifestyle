import { withAuth } from "next-auth/middleware";
export default withAuth({
  callbacks: { authorized: ({ token, req }) => req.nextUrl.pathname.startsWith("/admin") ? token?.role === "ADMIN" : !!token },
});
export const config = { matcher: ["/account/:path*", "/checkout/:path*", "/admin/:path*", "/api/admin/:path*"] };
