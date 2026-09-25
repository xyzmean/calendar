<!--
  - SPDX-FileCopyrightText: 2026 xcloud
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import { isRTL as isRTLFn, t } from '@nextcloud/l10n'
import { NcButton } from '@nextcloud/vue'
import { useHotKey } from '@nextcloud/vue/composables/useHotKey'
import { computed } from 'vue'
import CalendarTodayIcon from 'vue-material-design-icons/CalendarToday.vue'
import ChevronLeftIcon from 'vue-material-design-icons/ChevronLeft.vue'
import ChevronRightIcon from 'vue-material-design-icons/ChevronRight.vue'
import CalendarViewSwitcher from '@/components/TopBar/CalendarViewSwitcher.vue'
import { useCalendarNavigation } from '@/composables/useCalendarNavigation'
import formatDateRange from '@/filters/dateRangeFormat.js'

const {
	selectedDate,
	view,
	momentLocale,
	previousLabel,
	nextLabel,
	navigateTimeRangeForward,
	navigateTimeRangeBackward,
	goToToday,
} = useCalendarNavigation()

const isRTL = computed(() => isRTLFn())

const rangeLabel = computed(() => formatDateRange(selectedDate.value, view.value, momentLocale.value))

useHotKey(['n', 'j'], () => navigateTimeRangeForward())
useHotKey(['p', 'k'], () => navigateTimeRangeBackward())
useHotKey('t', () => goToToday())
</script>

<template>
	<div class="calendar-top-bar">
		<h2 class="calendar-top-bar__range">
			{{ rangeLabel }}
		</h2>
		<div class="calendar-top-bar__arrows">
			<NcButton
				class="calendar-top-bar__arrow"
				variant="tertiary"
				:aria-label="isRTL ? nextLabel : previousLabel"
				:title="isRTL ? nextLabel : previousLabel"
				@click="navigateTimeRangeBackward">
				<template #icon>
					<ChevronRightIcon v-if="isRTL" :size="20" />
					<ChevronLeftIcon v-else :size="20" />
				</template>
			</NcButton>
			<NcButton
				class="calendar-top-bar__arrow"
				variant="tertiary"
				:aria-label="isRTL ? previousLabel : nextLabel"
				:title="isRTL ? previousLabel : nextLabel"
				@click="navigateTimeRangeForward">
				<template #icon>
					<ChevronLeftIcon v-if="isRTL" :size="20" />
					<ChevronRightIcon v-else :size="20" />
				</template>
			</NcButton>
		</div>
		<NcButton
			class="calendar-top-bar__today"
			variant="tertiary"
			:aria-label="t('calendar', 'Today')"
			:title="t('calendar', 'Today')"
			@click="goToToday">
			<template #icon>
				<CalendarTodayIcon :size="18" />
			</template>
			<span class="calendar-top-bar__today-label">{{ t('calendar', 'Today') }}</span>
		</NcButton>
		<div class="calendar-top-bar__spacer" />
		<slot name="actions" />
		<CalendarViewSwitcher class="calendar-top-bar__views" />
	</div>
</template>

<style lang="scss" scoped>
.calendar-top-bar {
	display: flex;
	align-items: center;
	gap: 12px;
	flex: 0 0 60px;
	height: 60px;
	padding-inline: 20px;
	border-bottom: 1px solid var(--color-border);

	// Below the mobile breakpoint NcAppNavigation floats its own toggle over
	// the top-left corner of the content (34px at 7px from the edge, absolute,
	// in .app-navigation-toggle-wrapper). Nothing in the app can move it, so
	// the bar leaves the corner free instead of being covered by it.
	@media only screen and (max-width: 1024px) {
		padding-inline-start: 48px;
	}

	&__range {
		margin: 0;
		// The date range is the only thing here that may be shortened: every
		// other control is a fixed label that means nothing truncated
		// («Сегодня» became «Сего…» at 1024px).
		flex: 0 1 auto;
		min-width: 0;
		font-size: 17px;
		font-weight: 600;
		letter-spacing: -0.2px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	&__arrows,
	&__today,
	&__views {
		flex: 0 0 auto;
	}

	&__arrows {
		display: flex;
		align-items: center;
		gap: 2px;
	}

	&__arrow {
		// NcButton sizes itself from --size-normal (44px); the design's arrow is
		// a 30px ghost square, the same one the navigation used to carry.
		width: 30px !important;
		min-width: 30px !important;
		height: 30px !important;
		min-height: 30px !important;
		border-radius: 8px !important;
	}

	&__today {
		height: 30px !important;
		min-height: 30px !important;
		padding-inline: 12px !important;
		border-radius: 8px !important;
		font-size: 13.5px;
		font-weight: 500 !important;
		box-shadow: inset 0 0 0 1px var(--color-border);
	}

	// A phone has 390px for the whole bar. The word «Сегодня» is 60 of them,
	// and it was taking them from the date — which was left showing «1.».
	// On a wide screen the button is the word alone, as in the design. What is
	// hidden is NcButton's icon box, not the icon in it: the box is 30px wide
	// and kept its width with an empty icon, which read as a gap before the
	// word; NcButton also pads an icon-and-text button 4px on the icon side.
	&__today :deep(.button-vue__icon) {
		display: none;
	}

	@media only screen and (max-width: 768px) {
		gap: 8px;
		// padding-inline would reset the 48px the navigation toggle needs on
		// the start side, and the date went back under the toggle.
		padding-inline-end: 8px;

		.calendar-top-bar__spacer {
			display: none;
		}

		.calendar-top-bar__range {
			flex: 1 1 auto;
		}

		.calendar-top-bar__today-label {
			display: none;
		}

		.calendar-top-bar__today :deep(.button-vue__icon) {
			display: flex;
		}

		.calendar-top-bar__today {
			width: 30px !important;
			min-width: 30px !important;
			padding: 0 !important;
		}
	}

	&__spacer {
		flex-grow: 1;
	}
}
</style>
