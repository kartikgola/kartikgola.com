// Site-wide configuration constants
export const SITE_CONFIG = {
	title: 'Kartik Gola',
	author: 'Kartik Gola',
	description: 'Personal blog and portfolio of Kartik Gola - Software engineer, tech enthusiast, and occasional blogger.',
	url: 'https://kartikgola.com',
	email: 'hello@kartikgola.com',
	github: {
		username: 'kartikgola',
		repository: 'kartikgola.com', // Your repository name
		branch: 'master' // Default branch
	},
	social: {
		github: 'https://github.com/kartikgola',
		linkedin: 'https://linkedin.com/in/kartikgola',
		twitter: 'https://twitter.com/iamkartikgola'
	}
};

// Page-specific metadata
export const PAGE_META = {
	home: {
		title: `${SITE_CONFIG.title} - Software Engineer & Blogger`,
		description: SITE_CONFIG.description,
		keywords: 'Kartik Gola, software engineer, web development, programming, blog, tech, javascript, python, svelte'
	},
	about: {
		title: `About ${SITE_CONFIG.title} - Software Engineer`,
		description: `Learn about ${SITE_CONFIG.author}, a passionate software engineer with expertise in web development, modern frameworks, and technical writing.`,
		keywords: `about ${SITE_CONFIG.author}, software engineer, web developer, programmer, skills, experience`
	},
	posts: {
		title: `All Posts - ${SITE_CONFIG.title}`,
		description: `Browse all blog posts by ${SITE_CONFIG.author} covering web development, programming tutorials, and technology insights.`,
		keywords: 'blog posts, web development, programming, tutorials, technology, javascript, python'
	},
	links: {
		title: `Links & Social Media - ${SITE_CONFIG.title}`,
		description: `Connect with ${SITE_CONFIG.author} on various platforms. Find links to GitHub, LinkedIn, Twitter, and other social media profiles.`,
		keywords: 'contact, social media, GitHub, LinkedIn, Twitter, portfolio links'
	}
};
