import { getAllPosts } from '$lib/utils/blog.js';
import { error } from '@sveltejs/kit';

export async function entries() {
	const allPosts = await getAllPosts();
	const tags = new Set();
	
	// Collect all unique tags
	allPosts.forEach(post => {
		if (post.tags) {
			post.tags.forEach(tag => tags.add(tag.toLowerCase()));
		}
	});
	
	return Array.from(tags).map(tag => ({
		tag
	}));
}

export async function load({ params }) {
	const tagName = params.tag;
	const allPosts = await getAllPosts();
	
	// Filter posts by tag
	const taggedPosts = allPosts.filter(post => 
		post.tags && post.tags.some(tag => 
			tag.toLowerCase() === tagName.toLowerCase()
		)
	);
	
	if (taggedPosts.length === 0) {
		throw error(404, `No posts found for tag: ${tagName}`);
	}
	
	return {
		tag: tagName,
		posts: taggedPosts
	};
}