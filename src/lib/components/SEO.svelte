<script>
	export let title = 'Kartik Gola - Personal Blog';
	export let description = 'Personal blog and portfolio of Kartik Gola - Software developer, tech enthusiast, and occasional blogger';
	export let keywords = 'Kartik Gola, software developer, web development, programming, blog, tech';
	export let image = 'https://kartikgola.com/og-image.jpg';
	export let url = 'https://kartikgola.com';
	export let type = 'website';
	export let author = 'Kartik Gola';
	export let publishedDate = null;
	export let modifiedDate = null;
	export let tags = [];
	export let canonicalUrl = url;
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />
	<meta name="keywords" content={keywords} />
	<meta name="author" content={author} />
	<meta name="robots" content="index, follow" />
	<meta name="language" content="English" />
	<meta name="revisit-after" content="7 days" />
	
	<!-- Canonical URL -->
	<link rel="canonical" href={canonicalUrl} />
	
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />
	<meta property="og:site_name" content="Kartik Gola" />
	<meta property="og:locale" content="en_US" />
	
	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={url} />
	<meta property="twitter:title" content={title} />
	<meta property="twitter:description" content={description} />
	<meta property="twitter:image" content={image} />
	<meta property="twitter:creator" content="@kartikgola" />
	<meta property="twitter:site" content="@kartikgola" />
	
	<!-- Article specific meta tags -->
	{#if type === 'article'}
		<meta property="article:author" content={author} />
		{#if publishedDate}
			<meta property="article:published_time" content={publishedDate} />
		{/if}
		{#if modifiedDate}
			<meta property="article:modified_time" content={modifiedDate} />
		{/if}
		{#if tags.length > 0}
			{#each tags as tag}
				<meta property="article:tag" content={tag} />
			{/each}
		{/if}
	{/if}
	
	<!-- Structured Data -->
	{#if type === 'website'}
		<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "WebSite",
			"name": "Kartik Gola",
			"description": "{description}",
			"url": "{url}",
			"author": {
				"@type": "Person",
				"name": "{author}",
				"url": "{url}",
				"sameAs": [
					"https://github.com/kartikgola",
					"https://linkedin.com/in/kartikgola",
					"https://twitter.com/kartikgola"
				]
			},
			"potentialAction": {
				"@type": "SearchAction",
				"target": "{url}/posts?search={search_term_string}",
				"query-input": "required name=search_term_string"
			}
		}
		</script>
	{:else if type === 'article'}
		<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "BlogPosting",
			"headline": "{title}",
			"description": "{description}",
			"image": "{image}",
			"url": "{url}",
			"datePublished": "{publishedDate}",
			"dateModified": "{modifiedDate || publishedDate}",
			"author": {
				"@type": "Person",
				"name": "{author}",
				"url": "https://kartikgola.com"
			},
			"publisher": {
				"@type": "Person",
				"name": "{author}",
				"url": "https://kartikgola.com"
			},
			"mainEntityOfPage": {
				"@type": "WebPage",
				"@id": "{url}"
			},
			"keywords": "{tags.join(', ')}"
		}
		</script>
	{/if}
</svelte:head>