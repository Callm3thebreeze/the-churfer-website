import type { APIRoute } from "astro";

export const prerender = false;

const redirectToAdmin: APIRoute = ({ params, request, redirect }) => {
	const suffix = params.path ? `/${params.path}` : "";
	const url = new URL(request.url);

	return redirect(`/_emdash/admin${suffix}${url.search}`, 307);
};

export const GET = redirectToAdmin;