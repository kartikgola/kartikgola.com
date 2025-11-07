<script>
	import SEO from '$lib/components/SEO.svelte';
	import { SITE_CONFIG } from '$lib/config/site.js';
	import { formatDate } from '$lib/utils/blog.js';
	
	export let data;
	
	$: tag = data.tag;
	$: posts = data.posts;
</script>

<SEO 
	title="Posts tagged '{tag}' - {SITE_CONFIG.title}"
	description="Browse all blog posts tagged with {tag} by {SITE_CONFIG.author}. Find related articles and tutorials."
	keywords="{tag}, blog posts, articles, tutorials, {tag} development"
	url="{SITE_CONFIG.url}/tags/{tag.toLowerCase()}"
/>

<section class="tagged-posts">
	<h1>Posts tagged "{tag}"</h1>
	<p>{posts.length} post{posts.length === 1 ? '' : 's'} found</p>
	
	<table>
		<tbody>
			{#each posts as post}
				<tr>
					<td class="date">{formatDate(post.date)}</td>
					<td>
						<a href="/posts/{post.slug}">{post.title}</a>
						{#if post.excerpt}
							<br />
							<span class="excerpt">{post.excerpt}</span>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
	
	<hr />
	
	<p><a href="/posts">← Back to all posts</a></p>
</section>

<style>
	.tagged-posts {
		max-width: 700px;
		margin: 0 auto;
	}

	h1 {
		margin-bottom: 0.5em;
	}

	.tagged-posts > p {
		color: var(--text-secondary);
		margin-bottom: 1em;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		margin: 1.5em 0 2em 0;
	}

	td {
		padding: 1em 0;
		vertical-align: top;
		border-bottom: 1px solid var(--border);
	}

	.date {
		white-space: nowrap;
		padding-right: 1.5em;
		color: var(--text-secondary);
		font-size: 0.9em;
		width: 140px;
	}

	.excerpt {
		display: block;
		font-size: 0.9em;
		color: var(--text-secondary);
		margin-top: 0.5em;
		line-height: 1.5;
	}

	hr {
		border: none;
		border-top: 1px solid var(--border);
		margin: 3em 0 2em 0;
	}

	@media (max-width: 768px) {
		table {
			display: block;
		}

		tbody, tr {
			display: block;
		}

		td {
			display: block;
			width: 100%;
			padding: 0.75em 0;
		}

		.date {
			padding-right: 0;
			width: auto;
			font-size: 0.85em;
		}
	}
</style>