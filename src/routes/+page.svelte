<script>
	import { formatDate } from '$lib/utils/blog.js';
	import SEO from '$lib/components/SEO.svelte';
	import { PAGE_META, SITE_CONFIG } from '$lib/config/site.js';
	
	export let data;
	
	$: posts = data?.posts || [];
</script>

<SEO 
	title={PAGE_META.home.title}
	description={PAGE_META.home.description}
	keywords={PAGE_META.home.keywords}
	url={SITE_CONFIG.url}
	type="website"
/>

<!-- <section class="hero">
	<h1><span class="hand-wave">👋</span> Hi</h1>
	<p>I'm Kartik Gola. I'm a software engineer and tech enthusiast.</p>
</section> -->

<section class="recent-posts">
	<h1>Recent Posts</h1>
	{#if posts.length > 0}
		<table class="post-table">
			<tbody>
				{#each posts.slice(0, 5) as post}
					<tr>
						<td class="post-title-cell">
							<a href="/posts/{post.slug}">{post.title}</a>
						</td>
						<td class="post-date-cell">{formatDate(post.date)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<p><a href="/posts">View all posts →</a></p>
	{:else}
		<p>No posts yet. Check back soon!</p>
	{/if}
</section>

<section class="about">
	<h1>About</h1>
	<p>
		I'm Kartik Gola, a Senior Software Engineer with 8+ years of experience building large-scale
		 backend and distributed systems.
	</p>
	<p><a href="/about">More about me →</a></p>
</section>

<style>
	.recent-posts, .about {
		margin-bottom: 3em;
	}

	.recent-posts h1, .about h1 {
		margin-bottom: 1em;
	}

	.post-table {
		width: 100%;
		border-collapse: collapse;
		margin: 1.5em 0;
	}

	.post-table td {
		padding: 0.75em 0;
		border-bottom: 1px solid var(--border);
	}

	.post-title-cell {
		width: 70%;
	}

	.post-date-cell {
		width: 30%;
		text-align: right;
		color: var(--text-secondary);
		font-size: 0.9em;
	}

	@media (max-width: 768px) {
		.post-table td {
			display: block;
			width: 100% !important;
			text-align: left !important;
		}

		.post-date-cell {
			font-size: 0.85em;
			padding-top: 0.3em;
			padding-bottom: 1em;
		}

		.recent-posts, .about {
			margin-bottom: 2.5em;
		}
	}
</style>