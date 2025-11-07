<script>
	import { createEventDispatcher } from 'svelte';
	
	export let searchQuery = '';
	export let placeholder = 'Search posts...';
	
	const dispatch = createEventDispatcher();
	
	function handleInput(event) {
		searchQuery = event.target.value;
		dispatch('search', { query: searchQuery });
	}
	
	function clearSearch() {
		searchQuery = '';
		dispatch('search', { query: '' });
	}
</script>

<div class="search-container">
	<div class="search-input-wrapper">
		<svg class="search-icon" viewBox="0 0 20 20" fill="currentColor">
			<path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
		</svg>
		<input
			type="text"
			bind:value={searchQuery}
			on:input={handleInput}
			{placeholder}
			class="search-input"
		/>
		{#if searchQuery}
			<button
				type="button"
				class="clear-button"
				on:click={clearSearch}
				aria-label="Clear search"
			>
				<svg viewBox="0 0 20 20" fill="currentColor">
					<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
				</svg>
			</button>
		{/if}
	</div>
</div>

<style>
	.search-container {
		width: 100%;
		max-width: 400px;
	}

	.search-input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
	}

	.search-input {
		width: 100%;
		padding: 0.75rem 1rem 0.75rem 2.5rem;
		border: 2px solid var(--border);
		border-radius: 8px;
		background: var(--bg-primary);
		color: var(--text-primary);
		font-size: 1rem;
		transition: all 0.2s ease;
	}

	.search-input:focus {
		outline: none;
		border-color: var(--accent);
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.search-input::placeholder {
		color: var(--text-secondary);
	}

	.search-icon {
		position: absolute;
		left: 0.75rem;
		width: 1.25rem;
		height: 1.25rem;
		color: var(--text-secondary);
		pointer-events: none;
	}

	.clear-button {
		position: absolute;
		right: 0.5rem;
		width: 1.5rem;
		height: 1.5rem;
		border: none;
		background: none;
		color: var(--text-secondary);
		cursor: pointer;
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.clear-button:hover {
		color: var(--text-primary);
		background: var(--bg-secondary);
	}

	.clear-button svg {
		width: 1rem;
		height: 1rem;
	}

	@media (max-width: 768px) {
		.search-input {
			font-size: 16px; /* Prevent zoom on iOS */
		}
	}
</style>