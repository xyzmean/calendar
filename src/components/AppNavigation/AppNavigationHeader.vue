<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import { t } from '@nextcloud/l10n'
import { computed } from 'vue'
import NcAppNavigationSearch from '@nextcloud/vue/components/NcAppNavigationSearch'
import AppNavigationMiniMonth from '@/components/AppNavigation/AppNavigationMiniMonth.vue'
import useSettingsStore from '@/store/settings.js'

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
		     the top bar of the grid (CalendarTopBar), and «new event» to the
		     column heading (AppNavigationHeading); what is left here is the
		     month to page. -->
		<AppNavigationMiniMonth />
	</header>
</template>

<style lang="scss" scoped>
.app-navigation-header__filter {
	padding: 0;
	margin-bottom: var(--default-grid-baseline);
}
</style>
