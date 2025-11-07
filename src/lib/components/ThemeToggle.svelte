<script>
	import { theme } from '$lib/stores/theme.js';
	
	function toggleTheme() {
		theme.toggle();
	}
</script>

<button 
	class="theme-toggle" 
	on:click={toggleTheme}
	aria-label="Toggle theme"
	title="Toggle theme"
>
	{#if $theme === 'light'}
		🌙
	{:else}
		☀️
	{/if}
</button>

<style>
	.theme-toggle {
		background: none;
		border: 1px solid var(--border);
		padding: 6px 12px;
		cursor: pointer;
		font-size: 14px;
		color: var(--text-primary);
		font-family: inherit;
		border-radius: 4px;
		transition: background 0.2s ease;
	}

	.theme-toggle:hover {
		background: var(--bg-secondary);
	}

	.theme-toggle:active {
		transform: scale(0.95);
	}
</style>