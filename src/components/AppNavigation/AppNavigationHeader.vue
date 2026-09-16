<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import { t } from '@nextcloud/l10n'
import { computed } from 'vue'
import NcAppNavigationSearch from '@nextcloud/vue/components/NcAppNavigationSearch'
import AppNavigationHeaderNewEvent from '@/components/AppNavigation/AppNavigationHeader/AppNavigationHeaderNewEvent.vue'
import AppNavigationMiniMonth from '@/components/AppNavigation/AppNavigationMiniMonth.vue'
import useSettingsStore from '@/store/settings.js'

defineProps<{
	isPublic: boolean
}>()

const settingsStore = useSettingsStore()

const searchQuery = computed<string>({
	get: () => settingsStore.searchQuery,
	set: (val) => settingsStore.setSearchQuery(val),
})
</script>

<template>
	<header class="app-navigation-header">
		<NcAppNavigationSearch
			v-model="searchQuery"
			:label="t('calendar', 'Filter events …')"
			class="app-navigation-header__filter" />
		<!-- Date navigation, the today button and the view switcher moved to
		     the top bar of the grid (CalendarTopBar); what is left here is what
		     the design keeps in the column: create, and the month to page. -->
		<div class="new-event-today-view-section">
			<AppNavigationHeaderNewEvent v-if="!isPublic" />
		</div>
		<AppNavigationMiniMonth />
	</header>
</template>

<style lang="scss" scoped>
.app-navigation-header__filter {
	padding: 0;
	margin-bottom: var(--default-grid-baseline);
}

.new-event-today-view-section {
	margin-bottom: calc(var(--default-grid-baseline) * 2);

	:deep(.new-event) {
		width: 100%;
	}
}
</style>
