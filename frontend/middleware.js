export default function middleware(request) {
	const url = new URL(request.url);

	if (url.pathname.startsWith('/api')) {
		const backendUri = process.env.BACKEND_URI;

		if (!backendUri) {
			return new Response(JSON.stringify({ error: 'BACKEND_URI not configured' }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const targetUrl = `${backendUri.replace(/\/$/, '')}${url.pathname}${url.search}`;

		return fetch(targetUrl, {
			method: request.method,
			headers: request.headers,
			body: request.body,
			// Prevents the browser from following redirects automatically
			redirect: 'manual',
		});
	}
}

export const config = {
	matcher: "/api/:path*",
};
