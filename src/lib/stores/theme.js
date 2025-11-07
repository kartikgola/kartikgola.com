import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Create a writable store for theme
function createThemeStore() {
	const { subscribe, set, update } = writable('light');

	return {
		subscribe,
		set,
		initialize: () => {
			if (!browser) return;
			
			const savedTheme = localStorage.getItem('theme');
			const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
			
			set(theme);
			document.documentElement.setAttribute('data-theme', theme);
			
			// Listen for system theme changes (only if user hasn't manually set a preference)
			if (!savedTheme) {
				const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
				const handleSystemThemeChange = (e) => {
					// Only update if user hasn't manually set a preference
					if (!localStorage.getItem('theme')) {
						const newTheme = e.matches ? 'dark' : 'light';
						set(newTheme);
						document.documentElement.setAttribute('data-theme', newTheme);
					}
				};
				
				// Use addEventListener for better browser compatibility
				if (mediaQuery.addEventListener) {
					mediaQuery.addEventListener('change', handleSystemThemeChange);
				} else {
					// Fallback for older browsers
					mediaQuery.addListener(handleSystemThemeChange);
				}
			}
		},
		toggle: () => {
			update(current => {
				const newTheme = current === 'light' ? 'dark' : 'light';
				
				if (browser) {
					localStorage.setItem('theme', newTheme);
					document.documentElement.setAttribute('data-theme', newTheme);
				}
				
				return newTheme;
			});
		}
	};
}

export const theme = createThemeStore();
