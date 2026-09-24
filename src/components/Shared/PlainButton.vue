<!--
  - SPDX-FileCopyrightText: 2026 xcloud
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<!--
  A <button> that is styled by the component using it and by nothing else.

  Server styles every button that is not an NcButton — about twenty rules in
  core/css/inputs.scss, all keyed on `button:not(.button-vue, [class^="vs__"])`:
  a min-height of the clickable area, a 3px margin, bold type, the element
  radius, and its own background, border and colour on hover, focus and press.
  Several of them outweigh a scoped class, so a component could only win them
  back one property at a time, and every one it forgot showed: the mini-month
  was declared 30px a row and came out 36px, every day was bold, the band of
  the shown week broke into separate rounded squares, and the view switcher
  stood 40px high in a bar designed for 34.

  `.button-vue` is the mark server itself excludes from all of those rules;
  NcButton's own look is scoped to NcButton and does not come with the class.
  So the mark means here exactly what it means to server: this button draws
  itself. Classes and listeners fall through to the element.
-->

<template>
	<button type="button" class="button-vue">
		<slot />
	</button>
</template>
