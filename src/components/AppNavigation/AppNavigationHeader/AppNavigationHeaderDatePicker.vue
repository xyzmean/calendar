<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import { isRTL as isRTLFn } from '@nextcloud/l10n'
import { NcButton, NcDateTimePicker } from '@nextcloud/vue'
import { useHotKey } from '@nextcloud/vue/composables/useHotKey'
import { computed, toRef } from 'vue'
import { useCalendarNavigation } from '@/composables/useCalendarNavigation'
import formatDateRange from '@/filters/dateRangeFormat.js'

const props = defineProps<{
	isWidget?: boolean
}>()

// The embedded and widget headers are the only place this picker is left in:
// the main layout navigates from the top bar of the grid. The navigation
// itself is the same one, so it comes from the same composable.
const {
	selectedDate,
	view,
	momentLocale,
	previousLabel,
	nextLabel,
	navigateToDate,
	navigateTimeRangeForward,
	navigateTimeRangeBackward,
} = useCalendarNavigation(toRef(props, 'isWidget'))

const isRTL = computed(() => isRTLFn())

function dateFormatWrapper(date: Date): string {
	return formatDateRange(date, view.value, momentLocale.value)
}

useHotKey(['n', 'j'], () => navigateTimeRangeForward())
useHotKey(['p', 'k'], () => navigateTimeRangeBackward())
</script>

<template>
	<div class="datepicker-button-section">
		<NcButton
			v-if="!props.isWidget"
			:aria-label="isRTL ? nextLabel : previousLabel"
			:class="{ 'datepicker-button-section__right': isRTL, 'datepicker-button-section__left': !isRTL }"
			:name="isRTL ? nextLabel : previousLabel"
			@click="navigateTimeRangeBackward">
			<template #icon>
				<ChevronRightIcon v-if="isRTL" :size="22" />
				<ChevronLeftIcon v-else :size="22" />
			</template>
		</NcButton>
		<NcDateTimePicker
			class="datepicker-button-section__datepicker"
			:format="dateFormatWrapper"
			:modelValue="selectedDate"
			:type="view === 'multiMonthYear' ? 'year' : 'date'"
			@update:modelValue="navigateToDate" />
		<NcButton
			v-if="!props.isWidget"
			:aria-label="isRTL ? previousLabel : nextLabel"
			:class="{ 'datepicker-button-section__right': !isRTL, 'datepicker-button-section__left': isRTL }"
			:name="isRTL ? previousLabel : nextLabel"
			@click="navigateTimeRangeForward">
			<template #icon>
				<ChevronLeftIcon v-if="isRTL" :size="22" />
				<ChevronRightIcon v-else :size="22" />
			</template>
		</NcButton>
	</div>
</template>

<style lang="scss" scoped>
.datepicker-button-section__datepicker {
	:deep(input) {
		border-radius: 0 !important;
		text-align: center;
		border: 1px solid var(--color-primary-element-light-hover) !important;
		font-weight: bold;
		background-color: var(--color-primary-element-light) !important;
		margin: 0 !important;

		padding: 0 !important;
		width: calc(var(--default-grid-baseline) * 54) !important;
	}

	:deep(.dp__input_not_clearable) {
		padding: 0 !important;
	}

	:deep(.dp__input_icon) {
		display: none;
	}
}
</style>
