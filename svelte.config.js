import vercel from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: vercel({
			edge: true
		}),
		csrf: {
			checkOrigin: false,
		}
	},
	optimizeDeps: {
		exclude: ['layercake']
	},
};

export default config;
