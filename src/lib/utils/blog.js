import { marked } from 'marked';

// Configure marked options for proper code block handling
marked.use({
	headerIds: true,
	mangle: false,
	renderer: {
		heading(text, level) {
			// Create a slug from the heading text
			const slug = slugify(text);
			
			// Return heading with anchor link
			return `
				<h${level} id="${slug}">
					${text}
					<a href="#${slug}" class="heading-anchor" aria-label="Link to this section" title="Copy link to this section">
						<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
							<path d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"/>
						</svg>
					</a>
				</h${level}>
			`;
		},
		code(code, language) {
			const lang = language || 'plaintext';
			
			// Check if this is a GitHub Gist embed
			// Format: ```gist:username/gistId or ```gist:gistId or ```gist:username/gistId:filename
			if (lang.startsWith('gist:')) {
				const gistInfo = lang.replace('gist:', '').split(':');
				const gistPath = gistInfo[0]; // e.g., "username/gistId" or just "gistId"
				const fileName = gistInfo[1] || null; // optional filename
				
				// Extract gist ID (last part after /, or the whole thing if no /)
				// This is used for the container ID
				const gistId = gistPath.includes('/') ? gistPath.split('/').pop() : gistPath;
				
				// Store the full path for the script URL (GitHub needs username/gistId)
				const gistFullPath = gistPath;
				
				// Debug logging (only in browser/dev mode)
				if (typeof console !== 'undefined' && process?.env?.NODE_ENV !== 'production') {
					console.log('[Markdown Renderer] Processing Gist:', { lang, gistPath, gistId, fileName });
				}
				
				// Return a placeholder that we'll replace with the Gist component
				// We'll use a custom data attribute that our post component can detect
				return `<div class="gist-embed" data-gist-id="${gistId}" data-gist-path="${gistFullPath}" ${fileName ? `data-gist-file="${fileName}"` : ''}></div>`;
			}
			
			// Map common language aliases to Prism-supported languages
			const languageMap = {
				'js': 'javascript',
				'ts': 'typescript',
				'py': 'python',
				'rb': 'ruby',
				'sh': 'bash',
				'yml': 'yaml',
				'md': 'markdown'
			};
			
			// Get the normalized language for Prism
			const prismLang = languageMap[lang] || lang;
			
			// Check if this is a GitHub file reference
			// Format: ```code:path/to/file.js
			//         ```code:path/to/file.js:10-20 (line range)
			//         ```code:path/to/file.js@branch (specific branch)
			//         ```code:path/to/file.js:10-20@branch (line range + branch)
			//         ```code:username/repo/path/to/file.js (different repo)
			//         ```code:repo/path/to/file.js (different repo, same username)
			//         ```code:username/repo/path/to/file.js:10-20@branch (all options)
			if (lang.startsWith('code:')) {
				let filePath = lang.replace('code:', '').trim();
				let lineRange = null;
				let branch = null;
				let username = null;
				let repo = null;
				
				// Parse line range (e.g., :10-20)
				const lineRangeMatch = filePath.match(/:(\d+)-(\d+)/);
				if (lineRangeMatch) {
					lineRange = {
						start: parseInt(lineRangeMatch[1], 10),
						end: parseInt(lineRangeMatch[2], 10)
					};
					filePath = filePath.replace(/:(\d+)-(\d+)/, '');
				}
				
				// Parse branch (e.g., @main or @v1.0.0)
				const branchMatch = filePath.match(/@([\w.-]+)$/);
				if (branchMatch) {
					branch = branchMatch[1];
					filePath = filePath.replace(/@[\w.-]+$/, '');
				}
				
				// Parse repository specification (e.g., username/repo/path or repo/path)
				// Check if path starts with something that looks like username/repo
				const pathParts = filePath.split('/');
				// Only parse as username/repo if we have at least 3 parts (username, repo, and at least one path component)
				// and the file has an extension (to avoid false positives with paths like src/utils/helper)
				if (pathParts.length >= 3) {
					const firstPart = pathParts[0];
					const secondPart = pathParts[1];
					const lastPart = pathParts[pathParts.length - 1];
					// Check if last part has a file extension and first two parts don't have extensions
					// This indicates username/repo/path/to/file.ext format
					if (lastPart.includes('.') && !firstPart.includes('.') && !secondPart.includes('.')) {
						// This looks like username/repo/path format
						username = firstPart;
						repo = secondPart;
						filePath = pathParts.slice(2).join('/');
					}
				}
				
				// Build data attributes
				let attrs = `data-file-path="${filePath}"`;
				if (lineRange) {
					attrs += ` data-line-start="${lineRange.start}" data-line-end="${lineRange.end}"`;
				}
				if (branch) {
					attrs += ` data-branch="${branch}"`;
				}
				if (username) {
					attrs += ` data-username="${username}"`;
				}
				if (repo) {
					attrs += ` data-repo="${repo}"`;
				}
				
				// Return a placeholder that will be replaced with actual file content
				return `<div class="github-code-embed" ${attrs}></div>`;
			}
			
			// Escape HTML entities in code to prevent XSS
			const escapeHtml = (str) => {
				return str
					.replace(/&/g, '&amp;')
					.replace(/</g, '&lt;')
					.replace(/>/g, '&gt;')
					.replace(/"/g, '&quot;')
					.replace(/'/g, '&#039;');
			};
			
			// Return code block with Prism-compatible class names
			const escapedCode = escapeHtml(code);
			return `<pre><code class="language-${prismLang}">${escapedCode}</code></pre>`;
		}
	}
});

// Simple frontmatter parser that works in the browser
function parseFrontmatter(content) {
	const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
	const match = content.match(frontmatterRegex);
	
	if (!match) {
		return {
			metadata: {},
			body: content
		};
	}
	
	const [, frontmatterStr, body] = match;
	const metadata = {};
	
	// Parse YAML-like frontmatter
	const lines = frontmatterStr.split('\n');
	for (const line of lines) {
		const colonIndex = line.indexOf(':');
		if (colonIndex === -1) continue;
		
		const key = line.substring(0, colonIndex).trim();
		let value = line.substring(colonIndex + 1).trim();
		
		// Remove quotes if present
		if ((value.startsWith('"') && value.endsWith('"')) || 
		    (value.startsWith("'") && value.endsWith("'"))) {
			value = value.slice(1, -1);
		}
		
		// Handle arrays (tags)
		if (value.startsWith('[') && value.endsWith(']')) {
			const arrayContent = value.slice(1, -1);
			if (arrayContent.trim()) {
				metadata[key] = arrayContent.split(',').map(item => 
					item.trim().replace(/^['"]|['"]$/g, '')
				);
			} else {
				metadata[key] = [];
			}
		} else if (value === 'true' || value === 'false') {
			metadata[key] = value === 'true';
		} else {
			metadata[key] = value;
		}
	}
	
	return { metadata, body };
}

// Dynamic markdown loading function
async function getMarkdownPosts() {
	// Use Vite's import.meta.glob to dynamically import markdown files
	const postFiles = import.meta.glob('../../posts/*.md', { as: 'raw' });
	const posts = [];

	for (const path in postFiles) {
		try {
			const content = await postFiles[path]();
			const slug = path.split('/').pop()?.replace('.md', '') || '';
			
			// Parse frontmatter manually (browser-compatible approach)
			const { metadata, body } = parseFrontmatter(content);
			
			posts.push({
				slug,
				title: metadata.title || 'Untitled',
				date: metadata.date || new Date().toISOString().split('T')[0],
				excerpt: metadata.excerpt || '',
				tags: metadata.tags || [],
				draft: metadata.draft === true || metadata.draft === 'true',
				content: body
			});
		} catch (error) {
			console.error(`Error processing ${path}:`, error);
		}
	}

	return posts;
}

export async function getAllPosts() {
	const posts = await getMarkdownPosts();
	return posts
		.filter(post => !post.draft)
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPost(slug) {
	const posts = await getMarkdownPosts();
	const post = posts.find(p => p.slug === slug);
	
	if (!post) {
		return null;
	}
	
	// Remove the first H1 heading from content since we display the title separately
	let contentToProcess = post.content;
	const firstH1Regex = /^#\s+.+$/m;
	contentToProcess = contentToProcess.replace(firstH1Regex, '');
	
	// Process markdown content
	const htmlContent = marked(contentToProcess);
	
	return {
		...post,
		content: htmlContent
	};
}

export async function getRecentPosts(limit = 5) {
	const allPosts = await getAllPosts();
	return allPosts
		.filter(post => !post.draft)
		.slice(0, limit);
}

export async function searchPosts(query) {
	if (!query || query.trim() === '') {
		return await getAllPosts();
	}
	
	const allPosts = await getAllPosts();
	const searchTerm = query.toLowerCase().trim();
	
	return allPosts.filter(post => {
		const titleMatch = post.title.toLowerCase().includes(searchTerm);
		const excerptMatch = post.excerpt.toLowerCase().includes(searchTerm);
		const tagMatch = post.tags.some(tag => tag.toLowerCase().includes(searchTerm));
		
		return titleMatch || excerptMatch || tagMatch;
	});
}

export function formatDate(dateString) {
	const options = {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	};
	return new Date(dateString).toLocaleDateString('en-US', options);
}

export function slugify(text) {
	return text
		.toString()
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-')
		.replace(/[^\w\-]+/g, '')
		.replace(/\-\-+/g, '-')
		.replace(/^-+/, '')
		.replace(/-+$/, '');
}