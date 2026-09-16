<!--
  - SPDX-FileCopyrightText: 2026 xcloud
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import { t } from '@nextcloud/l10n'
import moment from '@nextcloud/moment'
import { NcButton } from '@nextcloud/vue'
import { computed, ref, watch } from 'vue'
import ChevronLeftIcon from 'vue-material-design-icons/ChevronLeft.vue'
import ChevronRightIcon from 'vue-material-design-icons/ChevronRight.vue'
import { useCalendarNavigation } from '@/composables/useCalendarNavigation'

interface Day {
	key: string
	label: string
	date: Date
	outside: boolean
	weekend: boolean
	today: boolean
	selected: boolean
	inRange: boolean
	rangeStart: boolean
	rangeEnd: boolean
}

const { selectedDate, view, momentLocale, navigateToDate } = useCalendarNavigation()

/**
 * Which month the grid shows. It follows the calendar, but paging it with the
 * arrows does not move the calendar: looking ahead is not the same as going
 * there, and the design gives the grid its own two arrows for that.
 */
const shownMonth = ref(moment(selectedDate.value).startOf('month').toDate())

watch(selectedDate, (date) => {
	shownMonth.value = moment(date).startOf('month').toDate()
})

const monthLabel = computed(() => moment(shownMonth.value).locale(momentLocale.value).format('MMMM YYYY'))

const weekdays = computed<string[]>(() => {
	const data = moment().locale(momentLocale.value).localeData()
	const first = data.firstDayOfWeek()
	const names = data.weekdaysMin()
	return Array.from({ length: 7 }, (_, index) => names[(first + index) % 7])
})

/**
 * The days the calendar itself is showing, so the grid can band them.
 */
const range = computed<{ from: number, to: number }>(() => {
	const current = moment(selectedDate.value).locale(momentLocale.value)
	switch (view.value) {
		case 'timeGridDay':
			return { from: current.startOf('day').valueOf(), to: moment(selectedDate.value).endOf('day').valueOf() }

		case 'timeGridWeek':
			return { from: current.startOf('week').valueOf(), to: moment(selectedDate.value).locale(momentLocale.value).endOf('week').valueOf() }

		// A month view bands the whole grid, which says nothing; the header
		// above already names the month.
		default:
			return { from: 0, to: 0 }
	}
})

const weeks = computed<Day[][]>(() => {
	const startOfMonth = moment(shownMonth.value).locale(momentLocale.value).startOf('month')
	const endOfMonth = moment(shownMonth.value).locale(momentLocale.value).endOf('month')
	const cursor = startOfMonth.clone().startOf('week')
	const today = moment().locale(momentLocale.value).startOf('day')
	const selected = moment(selectedDate.value).locale(momentLocale.value).startOf('day')

	const rows: Day[][] = []
	// Six rows always: a month can span six weeks, and a grid that changes
	// height moves the calendar list underneath it every time you page.
	for (let row = 0; row < 6; row++) {
		const days: Day[] = []
		for (let column = 0; column < 7; column++) {
			const day = cursor.clone()
			const stamp = day.valueOf()
			const inRange = range.value.to > 0 && stamp >= range.value.from && stamp <= range.value.to
			days.push({
				key: day.format('YYYY-MM-DD'),
				label: day.format('D'),
				date: day.toDate(),
				outside: day.isBefore(startOfMonth, 'day') || day.isAfter(endOfMonth, 'day'),
				weekend: [0, 6].includes(day.day()),
				today: day.isSame(today, 'day'),
				selected: day.isSame(selected, 'day'),
				inRange,
				rangeStart: inRange && column === 0,
				rangeEnd: inRange && column === 6,
			})
			cursor.add(1, 'day')
		}
		// The band is a row of the grid, so its rounded ends are the first and
		// the last banded cell of that row, not of the whole month.
		const banded = days.filter((day) => day.inRange)
		if (banded.length > 0) {
			banded.forEach((day) => {
				day.rangeStart = false
				day.rangeEnd = false
			})
			banded[0].rangeStart = true
			banded[banded.length - 1].rangeEnd = true
		}
		rows.push(days)
	}

	return rows
})

function showPreviousMonth(): void {
	shownMonth.value = moment(shownMonth.value).subtract(1, 'month').toDate()
}

function showNextMonth(): void {
	shownMonth.value = moment(shownMonth.value).add(1, 'month').toDate()
}
</script>

<template>
	<div class="mini-month">
		<div class="mini-month__header">
			<span class="mini-month__title">{{ monthLabel }}</span>
			<NcButton
				class="mini-month__arrow"
				variant="tertiary"
				:aria-label="t('calendar', 'Previous month')"
				:title="t('calendar', 'Previous month')"
				@click="showPreviousMonth">
				<template #icon>
					<ChevronLeftIcon :size="18" />
				</template>
			</NcButton>
			<NcButton
				class="mini-month__arrow"
				variant="tertiary"
				:aria-label="t('calendar', 'Next month')"
				:title="t('calendar', 'Next month')"
				@click="showNextMonth">
				<template #icon>
					<ChevronRightIcon :size="18" />
				</template>
			</NcButton>
		</div>

		<div class="mini-month__weekdays">
			<span v-for="(weekday, index) in weekdays" :key="index" class="mini-month__weekday">{{ weekday }}</span>
		</div>

		<div class="mini-month__grid">
			<template v-for="(week, rowIndex) in weeks" :key="rowIndex">
				<button
					v-for="day in week"
					:key="day.key"
					type="button"
					class="mini-month__day"
					:class="{
						'mini-month__day--outside': day.outside,
						'mini-month__day--weekend': day.weekend,
						'mini-month__day--today': day.today,
						'mini-month__day--in-range': day.inRange,
						'mini-month__day--range-start': day.rangeStart,
						'mini-month__day--range-end': day.rangeEnd,
					}"
					:aria-current="day.today ? 'date' : undefined"
					@click="navigateToDate(day.date)">
					<span class="mini-month__number">{{ day.label }}</span>
				</button>
			</template>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.mini-month {
	padding-inline: 6px;
	margin-bottom: 8px;

	&__header {
		display: flex;
		align-items: center;
		gap: 2px;
		padding-inline: 6px;
		margin-bottom: 4px;
	}

	&__title {
		flex-grow: 1;
		font-size: 15px;
		font-weight: 600;
		text-transform: capitalize;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	&__arrow {
		width: 28px !important;
		min-width: 28px !important;
		height: 28px !important;
		min-height: 28px !important;
		border-radius: 8px !important;
	}

	&__weekdays {
		display: grid;
		grid-template-columns: repeat(7, minmax(0, 1fr));
	}

	&__weekday {
		text-align: center;
		font-size: 11px;
		font-weight: 500;
		color: var(--color-text-maxcontrast);
		text-transform: lowercase;
		padding-block: 2px;
	}

	&__grid {
		display: grid;
		grid-template-columns: repeat(7, minmax(0, 1fr));
	}

	&__day {
		height: 30px;
		padding: 0;
		border: none;
		background-color: transparent;
		color: var(--color-main-text);
		font-size: 12.5px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;

		&--weekend {
			color: var(--color-text-maxcontrast);
		}

		&--outside {
			opacity: 0.45;
		}

		&--in-range {
			// The design bands the shown week in 10% of the accent; the ready
			// token --color-primary-element-light is a solid block that reads
			// as a selection of every day in it.
			background-color: color-mix(in srgb, var(--color-primary-element) 12%, transparent);
			font-weight: 600;
		}

		&--range-start {
			border-start-start-radius: 8px;
			border-end-start-radius: 8px;
		}

		&--range-end {
			border-start-end-radius: 8px;
			border-end-end-radius: 8px;
		}

		&:hover .mini-month__number {
			background-color: var(--color-background-hover);
		}

		&--today .mini-month__number {
			background-color: var(--color-primary-element);
			color: var(--color-primary-element-text);
			font-weight: 700;
		}
	}

	&__number {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 26px;
		height: 26px;
		border-radius: 50%;
	}
}
</style>
