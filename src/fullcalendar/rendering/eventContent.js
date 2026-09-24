/**
 * SPDX-FileCopyrightText: 2026 xcloud
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Content of a timed event in the day and week grid.
 *
 * It is FullCalendar's own markup (renderInnerContent in @fullcalendar/core:
 * frame, time, title container, title) with one element more — the start time
 * alone. A half-hour event is a one-line plate, and there the range
 * «18:00 - 18:30» took the width of the column and left the title one letter;
 * the design writes the plate as «title… 18:00». Which of the two times is
 * shown is decided by the theme from the height of the block, the same
 * container query that decides between one line and two, so the choice and
 * the layout cannot disagree.
 *
 * The markup has to stay FullCalendar's: eventDidMount finds the title
 * container to put the task checkbox in, and the theme styles these classes.
 * It is returned as vdom, not html, so an update patches it in place and
 * whatever eventDidMount added survives, as it does with the default content.
 *
 * @param {object} arg The event content arg of FullCalendar
 * @param {(type: string, props: object, ...children: unknown[]) => object} createElement The vdom factory FullCalendar passes along
 * @return {object|boolean} The content, or true for FullCalendar's default
 */
export default function eventContent(arg, createElement) {
	if (!arg.view.type.startsWith('timeGrid') || arg.event.allDay || !arg.timeText) {
		return true
	}

	// Only the segment that starts the event has a start to show; a segment
	// continuing from the day before keeps the range it was given.
	const startText = arg.isStart && arg.event.start
		// 'LT' is the eventTimeFormat of the grid (dateFormattingConfig.js),
		// so this is the first half of timeText by construction.
		? arg.view.calendar.formatDate(arg.event.start, 'LT')
		: null

	const title = createElement('div', { className: 'fc-event-title fc-sticky' }, arg.event.title || '\u00A0')
	const titleContainer = createElement('div', { className: 'fc-event-title-container' }, title)
	const time = createElement('div', { className: 'fc-event-time' }, arg.timeText)
	const start = startText
		? createElement('div', { className: 'fc-event-time fc-event-time--start' }, startText)
		: null

	return createElement('div', { className: 'fc-event-main-frame' }, time, start, titleContainer)
}
