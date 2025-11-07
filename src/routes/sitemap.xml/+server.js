import { getAllPosts } from '$lib/utils/blog.js';

export const prerender = true;

export async function GET() {
	const posts = await getAllPosts();
	
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
		<loc>https://kartikgola.com</loc>
		<lastmod>${new Date().toISOString()}</lastmod>
		<changefreq>weekly</changefreq>
		<priority>1.0</priority>
	</url>
	<url>
		<loc>https://kartikgola.com/about</loc>
		<lastmod>${new Date().toISOString()}</lastmod>
		<changefreq>monthly</changefreq>
		<priority>0.8</priority>
	</url>
	<url>
		<loc>https://kartikgola.com/posts</loc>
		<lastmod>${new Date().toISOString()}</lastmod>
		<changefreq>weekly</changefreq>
		<priority>0.9</priority>
	</url>
	<url>
		<loc>https://kartikgola.com/links</loc>
		<lastmod>${new Date().toISOString()}</lastmod>
		<changefreq>monthly</changefreq>
		<priority>0.7</priority>
	</url>
	${posts.map(post => `
	<url>
		<loc>https://kartikgola.com/posts/${post.slug}</loc>
		<lastmod>${new Date(post.date).toISOString()}</lastmod>
		<changefreq>monthly</changefreq>
		<priority>0.8</priority>
	</url>`).join('')}
	${[...new Set(posts.flatMap(post => post.tags))].map(tag => `
	<url>
		<loc>https://kartikgola.com/tags/${tag.toLowerCase()}</loc>
		<lastmod>${new Date().toISOString()}</lastmod>
		<changefreq>weekly</changefreq>
		<priority>0.5</priority>
	</url>`).join('')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
}