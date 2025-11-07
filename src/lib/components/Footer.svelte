<script>
	import { SITE_CONFIG } from '$lib/config/site.js';
	import { onMount } from 'svelte';
	
	let showBackToTop = false;
	let footerElement;
	
	onMount(() => {
		const checkScroll = () => {
			// Check if page is scrollable
			const isScrollable = document.documentElement.scrollHeight > window.innerHeight;
			
			if (!isScrollable) {
				showBackToTop = false;
				return;
			}
			
			// Check if user has scrolled down at least 300px
			const hasScrolled = window.scrollY > 300;
			
			showBackToTop = hasScrolled;
		};
		
		// Set up IntersectionObserver to detect when footer is in view
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						// Footer is in view, show back to top
						const isScrollable = document.documentElement.scrollHeight > window.innerHeight;
						showBackToTop = isScrollable;
					}
				});
			},
			{ threshold: 0.1 } // Trigger when 10% of footer is visible
		);
		
		if (footerElement) {
			observer.observe(footerElement);
		}
		
		// Listen to scroll events
		window.addEventListener('scroll', checkScroll);
		
		// Initial check
		checkScroll();
		
		// Cleanup
		return () => {
			window.removeEventListener('scroll', checkScroll);
			if (footerElement) {
				observer.unobserve(footerElement);
			}
		};
	});
</script>

<footer bind:this={footerElement}>
	<div class="footer-bottom">
		<p>&copy; {new Date().getFullYear()} {SITE_CONFIG.author}. All rights reserved.</p>
		{#if showBackToTop}
			<a href="#top" class="back-to-top">Back to top ↑</a>
		{/if}
	</div>
</footer>

<style>
	footer {
		margin-top: auto;
		border-top: 1px solid var(--border);
		background: var(--bg-secondary);
		padding: 2rem 1.5rem;
	}

	.footer-bottom {
		max-width: 700px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.footer-bottom p {
		color: var(--text-secondary);
		font-size: 0.85em;
		margin: 0;
	}

	.back-to-top {
		color: var(--text-secondary);
		font-size: 0.85em;
		text-decoration: none;
		transition: color 0.2s ease, opacity 0.3s ease;
		animation: fadeIn 0.3s ease;
	}

	.back-to-top:hover {
		color: var(--accent);
		text-decoration: none;
	}
	
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(5px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 768px) {
		footer {
			padding: 1.5rem;
		}

		.footer-bottom {
			flex-direction: column;
			text-align: center;
			gap: 0.5rem;
		}
	}
</style>

