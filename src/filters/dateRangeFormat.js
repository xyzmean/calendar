/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import moment from '@nextcloud/moment'

/**
 * Formats the week a date belongs to as the range of its days.
 *
 * The stock label is «Week 38 of 2026»: it answers a question nobody asks and
 * hides the one everybody does — which days am I looking at. The xcloud design
 * shows the range instead, and drops every part the two ends have in common,
 * so a week inside one month reads «7 — 13 сентября» and one across a month
 * boundary «28 сентября — 4 октября».
 *
 * @param {Date} value A date inside the week
 * @param {string} locale Which locale to format it in
 * @return {string}
 */
function formatWeekRange(value, locale) {
	const start = moment(value).locale(locale).startOf('week')
	const end = moment(value).locale(locale).endOf('week')

	if (start.year() !== end.year()) {
		return `${start.format('D MMMM YYYY')} — ${end.format('D MMMM YYYY')}`
	}

	if (start.month() !== end.month()) {
		return `${start.format('D MMMM')} — ${end.format('D MMMM')}`
	}

	return `${start.format('D')} — ${end.format('D MMMM')}`
}

/**
 * Formats a date-range depending on the user's current view
 *
 * @param {string | Date} value The date to format
 * @param {string} view The current view of the user
 * @param {string} locale Which locale to format it in
 * @return {string}
 */
export default (value, view, locale) => {
	switch (view) {
		case 'timeGridDay':
			return moment(value).locale(locale).format('ll')

		case 'timeGridWeek':
			return formatWeekRange(value, locale)

		case 'multiMonthYear':
			return moment(value).locale(locale).format('YYYY')

		case 'dayGridMonth':
		case 'listMonth':
		default:
			return moment(value).locale(locale).format('MMMM YYYY')
	}
}
