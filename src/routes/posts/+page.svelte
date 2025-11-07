<script>
	import { formatDate, searchPosts } from '$lib/utils/blog.js';
	import SEO from '$lib/components/SEO.svelte';
	import { PAGE_META, SITE_CONFIG } from '$lib/config/site.js';
	
	export let data;
	
	let searchQuery = '';
	let filteredPosts = data?.posts || [];
	
	$: posts = data?.posts || [];
	
	async function handleSearch(event) {
		const query = event.target.value;
		searchQuery = query;
		filteredPosts = await searchPosts(query);
	}
	
	// Initialize filtered posts
	$: if (posts) {
		filteredPosts = posts;
	}
</script>

<SEO 
	title={PAGE_META.posts.title}
	description={PAGE_META.posts.description}
	keywords={PAGE_META.posts.keywords}
	url="{SITE_CONFIG.url}/posts"
/>

<section class="posts">
	<h1>All Posts</h1>
	
	<div class="search-box">
		<input
			type="text"
			bind:value={searchQuery}
			on:input={handleSearch}
			placeholder="Search posts..."
		/>
	</div>
	
	{#if searchQuery}
		<p class="search-info">
			{filteredPosts.length} result{filteredPosts.length === 1 ? '' : 's'} for "{searchQuery}"
		</p>
	{/if}
	
	{#if filteredPosts.length > 0}
		<table class="post-table">
			<tbody>
				{#each filteredPosts as post}
					<tr>
						<td class="post-title-cell">
							<a href="/posts/{post.slug}">{post.title}</a>
							<div class="post-meta">
								{post.excerpt}
							</div>
						</td>
						<td class="post-date-cell">{formatDate(post.date)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{:else}
		<p>
			{#if searchQuery}
				No posts found matching "{searchQuery}".
			{:else}
				No posts available yet.
			{/if}
		</p>
	{/if}
</section>

<style>
	.posts {
		max-width: 700px;
		margin: 0 auto;
	}

	h1 {
		margin-bottom: 1em;
	}

	.search-box {
		margin: 1.5em 0;
	}

	.search-box input {
		width: 100%;
		padding: 0.75em 1em;
		border: 1px solid var(--border);
		background: var(--bg-primary);
		color: var(--text-primary);
		font-family: inherit;
		font-size: inherit;
		border-radius: 4px;
	}

	.search-box input:focus {
		outline: 2px solid var(--accent);
		outline-offset: 0;
	}

	.search-info {
		font-style: italic;
		color: var(--text-secondary);
		margin: 1em 0;
	}

	.post-table {
		width: 100%;
		border-collapse: collapse;
		margin: 1.5em 0 2em 0;
	}

	.post-table td {
		padding: 1em 0;
		border-bottom: 1px solid var(--border);
		vertical-align: top;
	}

	.post-title-cell {
		width: 70%;
	}

	.post-meta {
		color: var(--text-secondary);
		font-size: 0.9em;
		margin-top: 0.5em;
		line-height: 1.5;
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
			padding: 0.75em 0;
		}

		.post-date-cell {
			font-size: 0.85em;
			padding-top: 0.3em;
			padding-bottom: 0.75em;
		}

		.post-meta {
			margin-bottom: 0.5em;
			margin-top: 0.4em;
		}
	}
</style>