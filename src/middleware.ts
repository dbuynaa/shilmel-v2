import { type NextRequest, NextResponse } from "next/server";

import { auth } from "./auth";

// 1. Specify protected and public routes
const protectedRoutes = ["/admin"];
const publicRoutes = ["/signin", "/signup", "/"];

export default async function middleware(req: NextRequest) {
	// 2. Check if the current route is protected or public
	const path = req.nextUrl.pathname;
	const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
	const isPublicRoute = publicRoutes.includes(path);

	const session = await auth();

	// 4. Redirect to /login if the user is not authenticated
	if (isProtectedRoute && !session?.user.id) {
		return NextResponse.redirect(new URL("/signin", req.nextUrl));
	}

	// 5. Redirect to /app if the user is authenticated
	if (isProtectedRoute && session?.user && req.nextUrl.pathname === "/admin") {
		return NextResponse.redirect(new URL("/admin/home/dashboard", req.nextUrl));
	}

	return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
	matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
