/**
 * SPDX-FileCopyrightText: 2026 xcloud
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ComputedRef, Ref } from 'vue'

import { t } from '@nextcloud/l10n'
import { computed, unref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useSettingsStore from '@/store/settings.js'
import useWidgetStore from '@/store/widget.js'
import {
	getDateFromFirstdayParam,
	getYYYYMMDDFromDate,
	modifyDate,
} from '@/utils/date.js'

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>

/**
 * Date and view navigation of the calendar.
 *
 * The very same three questions — which day is shown, which view is shown and
 * how do we get to another one — used to be answered by three sibling
 * components (the date picker, the today button and the view menu). The xcloud
 * layout asks them from two more places (the top bar of the grid and the mini
 * month in the navigation), so they live here once instead of four times.
 *
 * @param isWidget Whether the caller is the dashboard widget, which keeps the
 *                 shown date in a store instead of the route.
 */
export function useCalendarNavigation(isWidget: MaybeRef<boolean | undefined> = false) {
	const route = useRoute()
	const router = useRouter()
	const widgetStore = useWidgetStore()
	const settingsStore = useSettingsStore()

	const widget = computed<boolean>(() => Boolean(unref(isWidget)))

	const selectedDate = computed<Date>(() => {
		if (widget.value) {
			return getDateFromFirstdayParam(widgetStore.widgetDate)
		}
		return getDateFromFirstdayParam((route.params?.firstDay as string) ?? 'now')
	})

	const view = computed<string>(() => {
		if (widget.value) {
			return widgetStore.widgetView
		}
		return route.params.view as string
	})

	const momentLocale = computed<string>(() => settingsStore.momentLocale)

	const previousLabel = computed(() => {
		switch (view.value) {
			case 'timeGridDay':
				return t('calendar', 'Previous day')

			case 'timeGridWeek':
				return t('calendar', 'Previous week')

			case 'multiMonthYear':
				return t('calendar', 'Previous year')

			case 'dayGridMonth':
			default:
				return t('calendar', 'Previous month')
		}
	})

	const nextLabel = computed(() => {
		switch (view.value) {
			case 'timeGridDay':
				return t('calendar', 'Next day')

			case 'timeGridWeek':
				return t('calendar', 'Next week')

			case 'multiMonthYear':
				return t('calendar', 'Next year')

			case 'dayGridMonth':
			default:
				return t('calendar', 'Next month')
		}
	})

	/**
	 * Show the given date, keeping the current view.
	 *
	 * @param date The day to show
	 */
	async function navigateToDate(date: Date): Promise<void> {
		if (widget.value) {
			widgetStore.setWidgetDate({ widgetDate: getYYYYMMDDFromDate(date) })
			return
		}

		// Don't push new route when day didn't change
		if (route.params.firstDay === getYYYYMMDDFromDate(date)) {
			return
		}

		await router.push({
			name: route.name!,
			params: {
				...route.params,
				firstDay: getYYYYMMDDFromDate(date),
			},
		})
	}

	/**
	 * Move by one unit of the current view.
	 *
	 * @param factor 1 for forward, -1 for backward
	 */
	function navigateTimeRangeByFactor(factor: number): void {
		let newDate: Date

		switch (view.value) {
			case 'timeGridDay':
				newDate = modifyDate(selectedDate.value, { day: factor })
				break

			case 'timeGridWeek':
				newDate = modifyDate(selectedDate.value, { week: factor })
				break

			case 'multiMonthYear':
				newDate = modifyDate(selectedDate.value, { year: factor })
				break

			case 'dayGridMonth':
			case 'listMonth':
			default: {
				// modifyDate is just adding one month, so we have to manually
				// set the date of month to 1. Otherwise if your date is set to
				// January 30th and you add one month, February 30th doesn't exist
				// and it automatically changes to March 1st. Same happens on March 31st.
				const firstDayOfCurrentMonth = new Date(selectedDate.value.getTime())
				firstDayOfCurrentMonth.setDate(1)
				newDate = modifyDate(firstDayOfCurrentMonth, { month: factor })
				break
			}
		}

		navigateToDate(newDate)
	}

	function navigateTimeRangeForward(): void {
		navigateTimeRangeByFactor(1)
	}

	function navigateTimeRangeBackward(): void {
		navigateTimeRangeByFactor(-1)
	}

	/**
	 * Jump back to the current day.
	 */
	async function goToToday(): Promise<void> {
		if (widget.value) {
			widgetStore.setWidgetDate({ widgetDate: 'now' })
			return
		}

		// Don't push new route when day didn't change
		if (route.params.firstDay === 'now') {
			return
		}

		await router.push({
			name: route.name!,
			params: {
				...route.params,
				firstDay: 'now',
			},
		})
	}

	/**
	 * Switch the view, keeping the shown date.
	 *
	 * @param viewName FullCalendar view id, e.g. timeGridWeek
	 */
	async function selectView(viewName: string): Promise<void> {
		if (widget.value) {
			widgetStore.setWidgetView({ viewName })
			return
		}

		// Don't push new route when view didn't change
		if (route.params.view === viewName) {
			return
		}

		await router.push({
			name: route.name!,
			params: {
				...route.params,
				view: viewName,
			},
		})
	}

	return {
		selectedDate,
		view,
		momentLocale,
		previousLabel,
		nextLabel,
		navigateToDate,
		navigateTimeRangeForward,
		navigateTimeRangeBackward,
		goToToday,
		selectView,
	}
}
