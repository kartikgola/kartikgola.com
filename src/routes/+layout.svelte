<script>
	import '../app.css';
	import Navigation from '$lib/components/Navigation.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { onMount } from 'svelte';
	import { theme } from '$lib/stores/theme.js';

	onMount(() => {
		// Initialize theme from localStorage or system preference
		theme.initialize();
	});
</script>

<!-- SEO will be handled by individual pages -->

<div class="app" id="top">
	<header>
		<nav class="container">
			<div class="nav-brand">
				<a href="/" class="brand-link">Kartik Gola</a>
			</div>
			<Navigation />
			<ThemeToggle />
		</nav>
	</header>

	<main class="container">
		<slot />
	</main>

	<Footer />
</div>