<!--
  - SPDX-FileCopyrightText: 2026 xcloud
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import { t } from '@nextcloud/l10n'
import AppNavigationHeaderNewEvent from '@/components/AppNavigation/AppNavigationHeader/AppNavigationHeaderNewEvent.vue'

defineProps<{
	isPublic: boolean
}>()
</script>

<template>
	<!-- The column heading of the design: the app name and its «+», the same
	     row Tasks and Boards have. It fills NcAppNavigation's search slot, so
	     the theme's shell layer gives it the same height and type as theirs. -->
	<div class="navigation-heading">
		<h2 class="navigation-heading__name">
			{{ t('calendar', 'Calendar') }}
		</h2>
		<AppNavigationHeaderNewEvent v-if="!isPublic" />
	</div>
</template>

<style lang="scss" scoped>
.navigation-heading {
	display: flex;
	align-items: center;
	gap: calc(2 * var(--default-grid-baseline));
	width: 100%;

	&__name {
		flex: 1 1 auto;
		min-width: 0;
		margin: 0;
		font-size: 20px;
		font-weight: 600;
	}
}
</style>
