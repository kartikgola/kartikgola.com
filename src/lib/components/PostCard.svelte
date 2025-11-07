<script>
	import { formatDate } from '$lib/utils/blog.js';
	
	export let post;
	export let highlightTag = null; // Optional: highlight a specific tag
</script>

<article class="post-card">
	<a href="/posts/{post.slug}" class="post-link">
		<div class="post-content">
			<h3 class="post-title">{post.title}</h3>
			<p class="post-date">{formatDate(post.date)}</p>
			<p class="post-excerpt">{post.excerpt}</p>
			<div class="post-tags">
				{#each post.tags as tag}
					<a 
						href="/tags/{tag.toLowerCase()}" 
						class="tag-link"
						on:click|stopPropagation
					>
						<span 
							class="tag" 
							class:highlight={highlightTag && tag.toLowerCase() === highlightTag.toLowerCase()}
						>
							{tag}
						</span>
					</a>
				{/each}
			</div>
		</div>
	</a>
</article>

<style>
	.post-card {
		border: 1px solid var(--border);
		border-radius: 12px;
		background: var(--bg-secondary);
		overflow: hidden;
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.post-card:hover {
		transform: translateY(-3px);
		box-shadow: 0 8px 25px var(--shadow);
	}

	.post-link {
		text-decoration: none;
		color: inherit;
		display: block;
	}

	.post-content {
		padding: 1.5rem;
	}

	.post-title {
		color: var(--text-primary);
		font-weight: 600;
		font-size: 1.4rem;
		margin-bottom: 0.5rem;
		line-height: 1.3;
	}

	.post-date {
		color: var(--text-secondary);
		font-size: 0.9em;
		margin-bottom: 1rem;
	}

	.post-excerpt {
		color: var(--text-secondary);
		line-height: 1.6;
		margin-bottom: 1rem;
	}

	.post-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.tag-link {
		text-decoration: none;
	}

	.tag {
		background: var(--tag-bg);
		color: var(--tag-text);
		font-size: 0.7em;
		padding: 0.15rem 0.4rem;
		border-radius: 3px;
		font-weight: 500;
		display: inline-block;
		transition: all 0.2s ease;
		border: 1px solid var(--tag-border);
	}

	.tag:hover {
		background: var(--tag-hover-bg);
		color: var(--tag-hover-text);
		transform: scale(1.05);
	}

	.tag.highlight {
		background: var(--accent);
		color: white;
		border-color: var(--accent);
		box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
	}

	@media (max-width: 768px) {
		.post-content {
			padding: 1rem;
		}

		.post-title {
			font-size: 1.2rem;
		}
	}
</style>
