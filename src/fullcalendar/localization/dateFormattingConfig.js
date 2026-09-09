/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Returns the date-formatting config for FullCalendar
 *
 * @return {object}
 */
function getDateFormattingConfig() {
	const defaultConfig = {
		dayHeaderFormat: 'ddd l',
		titleFormat: 'll',
		slotLabelFormat: 'LT',
	}

	return {
		// Date formatting:
		eventTimeFormat: 'LT',
		views: {
			dayGridMonth: {
				...defaultConfig,
				dayHeaderFormat: 'ddd',
			},
			multiMonthYear: {
				...defaultConfig,
				dayHeaderFormat: 'ddd',
				multiMonthMaxColumns: 4,
			},
			// xcloud: the week header is a small weekday caption over a large day
			// number («ср 9»), the day view spells the date out. The stock
			// 'ddd l' («ср 9.9.2026») is too long for the column and repeats
			// the year seven times across the row.
			timeGridDay: {
				...defaultConfig,
				dayHeaderFormat: 'dddd, D MMMM',
			},
			timeGridWeek: {
				...defaultConfig,
				dayHeaderFormat: 'ddd D',
			},
			listMonth: {
				// Changes for the List View
				listDayFormat: 'LL, dddd',
				listDaySideFormat: false,
			},
			resourceTimelineDay: defaultConfig,
		},
	}
}

export { getDateFormattingConfig }
