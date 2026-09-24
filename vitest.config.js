/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	test: {
		include: ['tests/javascript/unit/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
		setupFiles: [
			'tests/javascript/unit/setup.js',
		],
		globals: true,
		environment: 'jsdom',
		// The TimePicker tests build their dates in local time and compare them
		// with UTC instants, which holds only where the machine is on UTC — as
		// upstream CI is. On a machine in Moscow four of them failed without a
		// change to the code. The workers inherit this; the tests set their own
		// zone where the zone is what they test.
		env: {
			TZ: 'UTC',
		},
		// Required for transforming CSS files
		pool: 'vmForks',
		// Increase timeouts for slow CI environments
		testTimeout: 300000, // 2 minutes per test
		hookTimeout: 60000, // 60 seconds for hooks,
		server: {
			deps: {
				// Workaround "SyntaxError: Cannot use import statement outside a module"
				// caused by "import { Picker, Emoji, EmojiIndex } from 'emoji-mart-vue-fast/src'"
				// in NcEmojiPicker.vue
				inline: '@nextcloud/vue',
			},
		},
	},
})
