import { NextResponse } from "next/server";

export function middleware(request) {
	const { pathname } = request.nextUrl;

	if (pathname.startsWith("/api")) {
		const backendUrl = process.env.BACKEND_URI;
		const targetUrl = new URL(pathname, backendUrl);

		return NextResponse.rewrite(targetUrl);
	}
}

export const config = {
	matcher: "/api/:path*",
};
