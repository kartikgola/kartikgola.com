<script>
	import { formatDate } from '$lib/utils/blog.js';
	import SEO from '$lib/components/SEO.svelte';
	import { SITE_CONFIG } from '$lib/config/site.js';
	import { onMount, tick } from 'svelte';
	
	// Import Prism.js core (without theme CSS)
	import Prism from 'prismjs';
	
	// Import language support for common languages
	import 'prismjs/components/prism-javascript';
	import 'prismjs/components/prism-typescript';
	import 'prismjs/components/prism-python';
	import 'prismjs/components/prism-css';
	import 'prismjs/components/prism-markup'; // HTML
	import 'prismjs/components/prism-json';
	import 'prismjs/components/prism-bash';
	import 'prismjs/components/prism-yaml';
	import 'prismjs/components/prism-markdown';
	import 'prismjs/components/prism-java';
	import 'prismjs/components/prism-go';
	import 'prismjs/components/prism-rust';
	import 'prismjs/components/prism-sql';
	import 'prismjs/components/prism-jsx';
	import 'prismjs/components/prism-tsx';
	
	import { theme } from '$lib/stores/theme.js';
	
	export let data;
	
	// Track the current Prism theme link element
	let prismThemeLink = null;
	
	// GitHub repository configuration
	const githubRepo = {
		username: SITE_CONFIG.github.username,
		repo: SITE_CONFIG.github.repository,
		branch: SITE_CONFIG.github.branch
	};
	
	$: post = data.post;
	
	// Helper function to schedule browser-only operations
	function scheduleBrowserOperation(callback, delay = 100) {
		if (typeof window === 'undefined') return; // Skip during SSR
		
		tick().then(() => {
			if (typeof requestAnimationFrame !== 'undefined') {
				requestAnimationFrame(() => {
					setTimeout(callback, delay);
				});
			} else {
				setTimeout(callback, delay);
			}
		});
	}
	
	// Apply syntax highlighting to all code blocks
	function highlightCode() {
		if (typeof window === 'undefined') return;
		
		const postContent = document.querySelector('.post-content');
		if (!postContent) return;
		
		// Highlight all code blocks within the post content
		const codeBlocks = postContent.querySelectorAll('pre code[class*="language-"]');
		codeBlocks.forEach((block) => {
			Prism.highlightElement(block);
		});
	}
	
	// Setup heading anchor click handlers
	function setupHeadingAnchors() {
		if (typeof window === 'undefined') return;
		
		const postContent = document.querySelector('.post-content');
		if (!postContent) return;
		
		const headingAnchors = postContent.querySelectorAll('.heading-anchor');
		headingAnchors.forEach((anchor) => {
			anchor.addEventListener('click', async (e) => {
				e.preventDefault();
				const href = anchor.getAttribute('href');
				if (href) {
					// Get the full URL with hash
					const fullUrl = window.location.origin + window.location.pathname + href;
					
					try {
						await navigator.clipboard.writeText(fullUrl);
						
						// Show visual feedback
						const originalTitle = anchor.getAttribute('title');
						anchor.setAttribute('title', '✓ Link copied!');
						anchor.classList.add('copied');
						
						// Reset after 2 seconds
						setTimeout(() => {
							anchor.setAttribute('title', originalTitle || 'Copy link to this section');
							anchor.classList.remove('copied');
						}, 2000);
					} catch (err) {
						console.error('Failed to copy link:', err);
					}
				}
			});
		});
	}
	
	// Load the appropriate Prism theme based on current theme
	function loadPrismTheme(currentTheme) {
		if (typeof document === 'undefined') return;
		
		// Remove existing Prism theme if any
		if (prismThemeLink) {
			prismThemeLink.remove();
		}
		
		// Create new link element for the appropriate theme
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.id = 'prism-theme';
		
		// Use Okaidia theme (dark/Monokai-like) for dark mode, default Prism theme for light mode
		if (currentTheme === 'dark') {
			link.href = 'https://cdn.jsdelivr.net/npm/prismjs@1.30.0/themes/prism-okaidia.min.css';
		} else {
			link.href = 'https://cdn.jsdelivr.net/npm/prismjs@1.30.0/themes/prism.min.css';
		}
		
		document.head.appendChild(link);
		prismThemeLink = link;
		
		// Re-highlight code after theme loads
		link.onload = () => {
			scheduleBrowserOperation(() => {
				highlightCode();
			}, 50);
		};
	}
	
	// Reactive statement to load appropriate theme when theme changes
	$: if (typeof window !== 'undefined' && $theme) {
		loadPrismTheme($theme);
	}
	
	// Reactive statement to process content when post changes
	$: if (post?.content) {
		// Only run in browser
		if (typeof window !== 'undefined') {
			scheduleBrowserOperation(() => {
				highlightCode();
				embedGists();
				embedGitHubFiles();
				executePostScripts();
				setupHeadingAnchors();
			}, 100);
		}
	}
	
	onMount(async () => {
		// Only run in browser
		if (typeof window === 'undefined') return;
		
		// Load initial Prism theme based on current theme
		loadPrismTheme($theme);
		
		// Process existing embeds and apply syntax highlighting
		scheduleBrowserOperation(() => {
			highlightCode();
			embedGists();
			embedGitHubFiles();
			executePostScripts();
			setupHeadingAnchors();
		}, 200);
	});
	
	// Generic script loader with dependency management for markdown posts
	// Usage: External libs use data-global attribute, inline scripts use data-wait-for
	
	// Helper function to wait for a global variable to be available
	async function waitForGlobal(globalName, timeout = 3000, interval = 50) {
		const startTime = Date.now();
		
		while (typeof window[globalName] === 'undefined') {
			// Check if timeout exceeded
			if (Date.now() - startTime > timeout) {
				console.warn(`[Script Loader] Timeout waiting for ${globalName} to load`);
				return false;
			}
			
			// Wait before checking again
			await new Promise(resolve => setTimeout(resolve, interval));
		}
		
		return true;
	}
	
	async function executePostScripts() {
		// Only run in browser
		if (typeof document === 'undefined') return;
		
		const postContent = document.querySelector('.post-content');
		if (!postContent) return;
		
		// Find all script tags in the post content
		const scripts = postContent.querySelectorAll('script[type="text/post-script"]');
		
		// Execute scripts in sequence to handle dependencies
		for (const oldScript of scripts) {
			// Skip if already executed
			if (oldScript.hasAttribute('data-executed')) {
				continue;
			}
			
			// Mark as executed
			oldScript.setAttribute('data-executed', 'true');
			
			// Create a new script element (needed because innerHTML scripts don't execute)
			const newScript = document.createElement('script');
			
			// Copy attributes except type
			Array.from(oldScript.attributes).forEach((attr) => {
				if (attr.name !== 'type' && attr.name !== 'data-executed') {
					newScript.setAttribute(attr.name, attr.value);
				}
			});
			
			// Handle script loading
			if (oldScript.src) {
				// External script - wait for it to load
				await new Promise((resolve, reject) => {
					newScript.src = oldScript.src;
					newScript.onload = resolve;
					newScript.onerror = reject;
					document.head.appendChild(newScript);
				});
				
				// Check if script has a data-global attribute specifying what to wait for
				const globalToWaitFor = oldScript.getAttribute('data-global');
				if (globalToWaitFor) {
					await waitForGlobal(globalToWaitFor);
				} else {
					// Fallback: wait a bit for library initialization
					await new Promise(resolve => setTimeout(resolve, 100));
				}
			} else {
				// Inline script
				// Check if it has dependencies via data-wait-for attribute
				const waitFor = oldScript.getAttribute('data-wait-for');
				if (waitFor) {
					// Support comma-separated list of globals
					const globals = waitFor.split(',').map(g => g.trim());
					for (const globalName of globals) {
						await waitForGlobal(globalName);
					}
				}
				
				// Execute the inline script
				newScript.textContent = oldScript.textContent;
				oldScript.parentNode.insertBefore(newScript, oldScript.nextSibling);
			}
		}
	}
	
	function embedGists() {
		// Only run in browser
		if (typeof document === 'undefined') return;
		
		// Find all gist placeholder divs within post content and replace with actual GitHub Gist embeds
		const postContent = document.querySelector('.post-content');
		if (!postContent) {
			console.warn('[Gist Embed] Post content not found');
			return;
		}
		
		const gistEmbeds = postContent.querySelectorAll('.gist-embed');
		
		if (gistEmbeds.length === 0) {
			return;
		}
		
		gistEmbeds.forEach((div) => {
			const gistId = div.getAttribute('data-gist-id');
			const gistPath = div.getAttribute('data-gist-path') || gistId; // Fallback to gistId if path not available
			const fileName = div.getAttribute('data-gist-file');
			
			if (!gistId) {
				return;
			}
			
			// Skip if already processed (has script tag or already has gist content)
			if (div.querySelector('script') || div.querySelector('.gist')) {
				return;
			}
			
			// GitHub's script expects container ID format: gist-{gistId}
			// The gistId should be just the ID part (e.g., "3210919")
			const containerId = `gist-${gistId}`;
			
			// Set the container ID BEFORE adding the script
			// GitHub's script will look for this ID to render the Gist
			div.id = containerId;
			div.className = 'gist-container';
			
			// Ensure the container is visible and ready
			div.style.minHeight = '100px'; // Reserve space for loading
			
			// Create and append GitHub's gist script
			// GitHub's embed script URL format: https://gist.github.com/{username}/{gistId}.js
			const script = document.createElement('script');
			let gistUrl = `https://gist.github.com/${gistPath}.js`;
			
			// Add file parameter if specified
			if (fileName) {
				gistUrl += `?file=${encodeURIComponent(fileName)}`;
			}
			
			// Set script attributes
			script.src = gistUrl;
			script.async = true;
			
			// Handle script load events
			script.onload = () => {
				// Remove min-height after content loads
				setTimeout(() => {
					div.style.minHeight = '';
				}, 1000);
			};
			
			script.onerror = () => {
				console.error('[Gist Embed] Failed to load gist:', gistUrl);
				div.innerHTML = `<p style="color: var(--text-secondary); padding: 1em;">Failed to load Gist. <a href="https://gist.github.com/${gistPath}" target="_blank" rel="noopener">View on GitHub</a></p>`;
			};
			
			// Append script to the container
			// GitHub's script will automatically find the container by ID and render the Gist
			div.appendChild(script);
		});
	}
	
	async function embedGitHubFiles() {
		// Only run in browser
		if (typeof document === 'undefined') return;
		
		// Find all GitHub file placeholder divs and fetch the actual code
		const postContent = document.querySelector('.post-content');
		if (!postContent) return;
		
		const fileEmbeds = postContent.querySelectorAll('.github-code-embed');
		
		for (const div of fileEmbeds) {
			const filePath = div.getAttribute('data-file-path');
			const lineStart = div.getAttribute('data-line-start');
			const lineEnd = div.getAttribute('data-line-end');
			const branch = div.getAttribute('data-branch') || githubRepo.branch;
			const username = div.getAttribute('data-username') || githubRepo.username;
			const repo = div.getAttribute('data-repo') || githubRepo.repo;
			
			if (!filePath) continue;
			
			// Skip if already processed
			if (div.querySelector('pre')) continue;
			
			// Show loading state
			div.innerHTML = '<div class="code-loading">Loading code from GitHub...</div>';
			
			try {
				// Fetch raw file content from GitHub
				const rawUrl = `https://raw.githubusercontent.com/${username}/${repo}/${branch}/${filePath}`;
				const response = await fetch(rawUrl);
				
				if (!response.ok) {
					throw new Error(`Failed to fetch: ${response.status}`);
				}
				
				let code = await response.text();
				
				// Extract line range if specified
				if (lineStart && lineEnd) {
					const lines = code.split('\n');
					const start = Math.max(0, parseInt(lineStart, 10) - 1);
					const end = Math.min(lines.length, parseInt(lineEnd, 10));
					code = lines.slice(start, end).join('\n');
				}
				
				// Detect language from file extension
				const extension = filePath.split('.').pop() || '';
				const languageMap = {
					'js': 'javascript',
					'jsx': 'javascript',
					'ts': 'typescript',
					'tsx': 'typescript',
					'py': 'python',
					'java': 'java',
					'css': 'css',
					'html': 'html',
					'svelte': 'svelte',
					'json': 'json',
					'md': 'markdown',
					'sh': 'bash',
					'bash': 'bash'
				};
				const language = languageMap[extension.toLowerCase()] || extension.toLowerCase();
				
				// Create code block structure
				const wrapper = document.createElement('div');
				wrapper.className = 'code-wrapper';
				
				// Create header
				const header = document.createElement('div');
				header.className = 'code-header';
				
				const label = document.createElement('span');
				label.className = 'language-label';
				label.textContent = `${filePath}`;
				header.appendChild(label);
				
				const githubLink = document.createElement('a');
				// Build GitHub URL with line range if specified
				let githubUrl = `https://github.com/${username}/${repo}/blob/${branch}/${filePath}`;
				if (lineStart && lineEnd) {
					githubUrl += `#L${lineStart}-L${lineEnd}`;
				}
				githubLink.href = githubUrl;
				githubLink.target = '_blank';
				githubLink.rel = 'noopener';
				githubLink.className = 'github-link';
				githubLink.textContent = 'View on GitHub';
				header.appendChild(githubLink);
				
				// Create copy button
				const copyButton = document.createElement('button');
				copyButton.className = 'copy-button';
				copyButton.textContent = 'Copy';
				copyButton.setAttribute('aria-label', 'Copy code');
				copyButton.addEventListener('click', async () => {
					try {
						await navigator.clipboard.writeText(code);
						copyButton.textContent = '✓ Copied!';
						setTimeout(() => {
							copyButton.textContent = 'Copy';
						}, 2000);
					} catch (err) {
						console.error('Failed to copy:', err);
					}
				});
				header.appendChild(copyButton);
				
				// Create pre/code element
				const pre = document.createElement('pre');
				const codeElement = document.createElement('code');
				codeElement.className = `language-${language}`;
				codeElement.textContent = code;
				pre.appendChild(codeElement);
				
				wrapper.appendChild(header);
				wrapper.appendChild(pre);
				
				// Replace loading state with code block
				div.replaceWith(wrapper);
				
			} catch (error) {
				console.error('Error fetching GitHub file:', error);
				div.innerHTML = `<div class="code-error">Failed to load code from GitHub: ${filePath}<br><small>Error: ${error.message}</small></div>`;
			}
		}
	}
	
</script>

<SEO 
	title="{post.title} - {SITE_CONFIG.title}"
	description={post.excerpt}
	keywords={post.tags.join(', ')}
	url="{SITE_CONFIG.url}/posts/{post.slug}"
	type="article"
	publishedDate={post.date}
	tags={post.tags}
	canonicalUrl="{SITE_CONFIG.url}/posts/{post.slug}"
/>

<article class="post">
	<h1 class="post-title">{post.title}</h1>
	
	<div class="post-meta">
		<time class="post-date">{formatDate(post.date)}</time>
		{#if post.tags && post.tags.length > 0}
			<span class="tags">
				Tags: 
				{#each post.tags as tag, i}
					<a href="/tags/{tag.toLowerCase()}">{tag}</a>{#if i < post.tags.length - 1}, {/if}
				{/each}
			</span>
		{/if}
	</div>
	
	<div class="post-content">
		{@html post.content}
	</div>
	
	<hr />
	
	<p><a href="/posts">← Back to all posts</a></p>
</article>

<style>
	.post {
		max-width: 700px;
		margin: 0 auto;
	}

	.post-title {
		margin-bottom: 0.75em;
	}

	.post-meta {
		color: var(--text-secondary);
		font-size: 0.9em;
		margin-bottom: 2.5em;
		padding-bottom: 1.5em;
		border-bottom: 1px solid var(--border);
	}

	.tags {
		margin-left: 1em;
	}

	.post-content {
		line-height: 1.7;
		margin-top: 1.5em;
	}

	.post-content :global(h2),
	.post-content :global(h3),
	.post-content :global(h4) {
		margin-top: 2em;
		margin-bottom: 0.75em;
		position: relative;
		scroll-margin-top: 80px; /* Offset for fixed headers */
	}
	
	/* Heading anchor links */
	.post-content :global(.heading-anchor) {
		position: relative;
		margin-left: 0.5em;
		color: var(--text-secondary);
		opacity: 0;
		text-decoration: none;
		transition: opacity 0.2s ease, color 0.2s ease;
		display: inline-flex;
		align-items: center;
		vertical-align: middle;
	}
	
	.post-content :global(h2:hover .heading-anchor),
	.post-content :global(h3:hover .heading-anchor),
	.post-content :global(h4:hover .heading-anchor),
	.post-content :global(h5:hover .heading-anchor),
	.post-content :global(h6:hover .heading-anchor) {
		opacity: 1;
	}
	
	.post-content :global(.heading-anchor:hover) {
		color: var(--accent);
	}
	
	.post-content :global(.heading-anchor.copied) {
		color: #22c55e;
	}
	
	.post-content :global(.heading-anchor svg) {
		width: 18px;
		height: 18px;
		vertical-align: middle;
	}
	
	/* On touch devices, make anchor links always visible but subtle */
	@media (hover: none) {
		.post-content :global(.heading-anchor) {
			opacity: 0.4;
		}
		
		.post-content :global(.heading-anchor:active) {
			opacity: 1;
		}
	}

	.post-content :global(p) {
		margin-bottom: 1.25em;
	}

	.post-content :global(ul),
	.post-content :global(ol) {
		margin: 1.25em 0;
		padding-left: 2em;
	}

	.post-content :global(li) {
		margin: 0.5em 0;
		line-height: 1.6;
	}

	/* Inline code styling (not inside pre) */
	.post-content :global(code:not(pre code)) {
		background: var(--bg-secondary);
		padding: 0.2em 0.4em;
		font-size: 0.9em;
		border-radius: 3px;
		font-family: Menlo, Monaco, "Courier New", monospace;
		font-feature-settings: "calt" 0, "liga" 0;
		font-variant-numeric: tabular-nums;
		font-variant-ligatures: normal;
		font-weight: 400;
		color: var(--text-primary);
	}

	/* Code block container - let Prism handle the background */
	.post-content :global(pre) {
		overflow-x: auto;
		margin: 1.5em 0;
		border-radius: 6px;
		font-size: 0.9em;
		line-height: 1.6;
		/* Prism theme provides background */
	}

	.post-content :global(pre code) {
		background: none !important;
		padding: 0;
		border-radius: 0;
		font-family: Menlo, Monaco, "Courier New", monospace;
		font-feature-settings: "calt" 0, "liga" 0;
	}
	
	/* Ensure Prism code blocks have proper padding and shadow */
	.post-content :global(pre[class*="language-"]) {
		padding: 1.25em;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		border: none;
	}
	
	/* Override for light theme to have subtle shadow */
	:global([data-theme='light']) .post-content :global(pre[class*="language-"]) {
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
		border: 1px solid #e1e4e8;
	}
	
	/* Override for dark theme to have deeper shadow */
	:global([data-theme='dark']) .post-content :global(pre[class*="language-"]) {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}
	
	/* Fix: Remove white background from operators and punctuation in light theme */
	:global([data-theme='light']) .post-content :global(.token.operator),
	:global([data-theme='light']) .post-content :global(.token.punctuation),
	:global([data-theme='light']) .post-content :global(.token.entity),
	:global([data-theme='light']) .post-content :global(.token.url) {
		background: transparent !important;
	}
	
	/* Inline code inside headings */
	.post-content :global(h1 code),
	.post-content :global(h2 code),
	.post-content :global(h3 code),
	.post-content :global(h4 code) {
		font-size: 0.85em;
	}

	.post-content :global(blockquote) {
		border-left: 3px solid var(--border);
		padding-left: 1.25em;
		padding-top: 0.25em;
		padding-bottom: 0.25em;
		margin: 1.5em 0;
		font-style: italic;
		color: var(--text-secondary);
	}

	hr {
		border: none;
		border-top: 1px solid var(--border);
		margin: 3em 0 2em 0;
	}
	
	/* GitHub Gist container styling */
	:global(.gist-container) {
		margin: 1.5em 0;
	}
	
	:global(.gist-container .gist) {
		margin: 0;
	}
	
	:global(.gist-container .gist-file) {
		margin-bottom: 0;
		border: 1px solid var(--border);
		border-radius: 6px;
		overflow: hidden;
		background: var(--code-bg);
	}
	
	:global(.gist-container .gist-data) {
		background: var(--code-bg);
		border-bottom: 1px solid var(--border);
	}
	
	:global(.gist-container .gist-meta) {
		background: var(--bg-secondary);
		color: var(--text-secondary);
		font-size: 12px;
		padding: 8px 16px;
		border-top: 1px solid var(--border);
	}
	
	:global(.gist-container .gist-meta a) {
		color: var(--link-color);
		text-decoration: none;
	}
	
	:global(.gist-container .gist-meta a:hover) {
		text-decoration: underline;
	}
	
	/* GitHub file embed styling */
	:global(.code-wrapper) {
		position: relative;
		margin: 1.5em 0;
	}
	
	:global(.code-header) {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 16px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-bottom: none;
		border-radius: 6px 6px 0 0;
		font-size: 12px;
		gap: 12px;
	}
	
	:global(.language-label) {
		color: var(--text-secondary);
		font-weight: 500;
		text-transform: uppercase;
		font-size: 11px;
		letter-spacing: 0.5px;
		font-family: inherit;
	}
	
	:global(.copy-button) {
		padding: 4px 12px;
		background: var(--bg-primary);
		border: 1px solid var(--border);
		border-radius: 4px;
		color: var(--text-primary);
		font-size: 12px;
		cursor: pointer;
		transition: all 0.2s;
		font-family: inherit;
		font-weight: 500;
	}
	
	:global(.copy-button:hover) {
		background: var(--accent);
		color: white;
		border-color: var(--accent);
	}
	
	:global(.copy-button:active) {
		transform: scale(0.95);
	}
	
	:global(.code-wrapper pre) {
		margin-top: 0 !important;
		border-radius: 0 0 6px 6px !important;
	}
	
	:global(.code-loading) {
		padding: 2em;
		text-align: center;
		color: var(--text-secondary);
		font-style: italic;
	}
	
	:global(.code-error) {
		padding: 1em;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 6px;
		color: var(--text-secondary);
		font-size: 0.9em;
	}
	
	:global(.code-error small) {
		display: block;
		margin-top: 0.5em;
		color: var(--text-secondary);
		opacity: 0.8;
	}
	
	:global(.github-link) {
		margin-left: auto;
		margin-right: 12px;
		font-size: 12px;
		color: var(--link-color);
		text-decoration: none;
	}
	
	:global(.github-link:hover) {
		text-decoration: underline;
	}
</style>