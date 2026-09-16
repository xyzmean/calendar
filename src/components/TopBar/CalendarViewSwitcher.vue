<!--
  - SPDX-FileCopyrightText: 2026 xcloud
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import { t } from '@nextcloud/l10n'
import { NcActionButton, NcActions } from '@nextcloud/vue'
import { useHotKey } from '@nextcloud/vue/composables/useHotKey'
import { computed } from 'vue'
import ViewComfy from 'vue-material-design-icons/ViewComfy.vue'
import ViewDay from 'vue-material-design-icons/ViewDay.vue'
import ViewGrid from 'vue-material-design-icons/ViewGrid.vue'
import ViewList from 'vue-material-design-icons/ViewList.vue'
import ViewModule from 'vue-material-design-icons/ViewModule.vue'
import ViewWeek from 'vue-material-design-icons/ViewWeek.vue'
import { useCalendarNavigation } from '@/composables/useCalendarNavigation'

const { view, selectView } = useCalendarNavigation()

const views = computed(() => [{
	id: 'timeGridDay',
	icon: ViewDay,
	label: t('calendar', 'Day'),
}, {
	id: 'timeGridWeek',
	icon: ViewWeek,
	label: t('calendar', 'Week'),
}, {
	id: 'dayGridMonth',
	icon: ViewModule,
	label: t('calendar', 'Month'),
}, {
	id: 'multiMonthYear',
	icon: ViewComfy,
	label: t('calendar', 'Year'),
}, {
	id: 'listMonth',
	icon: ViewList,
	label: t('calendar', 'List'),
}])

/**
 * The three views the design names get a segment each. The menu keeps all
 * five: year and list do not fit the track and are not in the design, but
 * dropping them would drop a feature — and on a narrow window, where the
 * segments do not fit either, the menu is the only way to switch.
 */
const segments = computed(() => views.value.slice(0, 3))

const currentIcon = computed(() => views.value.find((entry) => entry.id === view.value)?.icon ?? ViewGrid)

useHotKey(['d', '1'], () => selectView('timeGridDay'))
useHotKey(['w', '2'], () => selectView('timeGridWeek'))
useHotKey(['m', '3'], () => selectView('dayGridMonth'))
useHotKey(['y', '4'], () => selectView('multiMonthYear'))
useHotKey(['l', '5'], () => selectView('listMonth'))
</script>

<template>
	<div class="calendar-view-switcher" role="group" :aria-label="t('calendar', 'Change view')">
		<button
			v-for="segment in segments"
			:key="segment.id"
			type="button"
			class="calendar-view-switcher__segment"
			:class="{ 'calendar-view-switcher__segment--active': view === segment.id }"
			:aria-pressed="view === segment.id"
			@click="selectView(segment.id)">
			{{ segment.label }}
		</button>
		<NcActions
			class="calendar-view-switcher__more"
			:title="t('calendar', 'Change view')"
			menuAlign="right">
			<template #icon>
				<component :is="currentIcon" :size="20" />
			</template>
			<NcActionButton
				v-for="entry in views"
				:key="entry.id"
				:closeAfterClick="true"
				@click="selectView(entry.id)">
				<template #icon>
					<component :is="entry.icon" :size="20" />
				</template>
				{{ entry.label }}
			</NcActionButton>
		</NcActions>
	</div>
</template>

<style lang="scss" scoped>
.calendar-view-switcher {
	display: flex;
	align-items: center;
	gap: 4px;
	padding: 3px;
	border-radius: 10px;
	background-color: var(--color-background-dark);

	&__segment {
		height: 28px;
		padding: 0 12px;
		border: none;
		border-radius: 8px;
		background-color: transparent;
		color: var(--color-text-maxcontrast);
		font-size: 13.5px;
		font-weight: 500;
		white-space: nowrap;
		cursor: pointer;

		&:hover {
			color: var(--color-main-text);
		}

		&--active {
			background-color: var(--color-background-hover);
			color: var(--color-main-text);
			font-weight: 600;
			// Latte's two greys sit close together (#e6e9ef track, #ccd0da
			// plate — 1.25:1); the edge is what separates them there. Mocha
			// does not need it and barely shows it.
			box-shadow: 0 1px 2px rgba(0, 0, 0, 0.16);
		}

		// The three labels plus the menu are 272px of the bar. What is left for
		// the date is not the window but the window minus the rail and the
		// navigation column, so the segments have to go while the window still
		// looks wide: measured at 1024px, where the column is open and the date
		// was left reading «14 — 2…». Below this width the menu is the switcher
		// — it carries all five views anyway.
		@media only screen and (max-width: 1200px) {
			display: none;
		}
	}

	&__more {
		:deep(.button-vue) {
			height: 28px !important;
			min-height: 28px !important;
			width: 28px !important;
			min-width: 28px !important;
			border-radius: 8px !important;
		}
	}
}
</style>
