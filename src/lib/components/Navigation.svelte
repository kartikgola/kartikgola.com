<script>
	import { page } from '$app/stores';
	
	const navItems = [
		{ href: '/', label: 'Home' },
		{ href: '/about', label: 'About' },
		{ href: '/posts', label: 'Posts' },
		{ href: '/links', label: 'Links' }
	];
</script>

<nav class="navigation">
	<ul class="nav-list">
		{#each navItems as item}
			<li class="nav-item">
				<a 
					href={item.href} 
					class="nav-link"
					class:active={$page.url.pathname === item.href}
				>
					{item.label}
				</a>
			</li>
		{/each}
	</ul>
</nav>

<style>
	.navigation {
		display: flex;
		align-items: center;
	}

	.nav-list {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0;
		gap: 24px;
	}

	.nav-link {
		text-decoration: none;
		color: var(--link-color);
		padding: 4px 0;
		display: inline-block;
	}

	.nav-link:visited {
		color: var(--link-visited);
	}

	.nav-link:hover {
		text-decoration: underline;
	}

	.nav-link.active {
		font-weight: 600;
		text-decoration: underline;
	}

	@media (max-width: 768px) {
		.nav-list {
			gap: 16px;
			flex-wrap: wrap;
		}
	}
</style>