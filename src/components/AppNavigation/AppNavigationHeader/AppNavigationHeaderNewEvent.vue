<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import { t } from '@nextcloud/l10n'
import { NcButton } from '@nextcloud/vue'
import { useHotKey } from '@nextcloud/vue/composables/useHotKey'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Plus from 'vue-material-design-icons/Plus.vue'

const route = useRoute()
const router = useRouter()

const newEventButtonAriaLabel = computed(() => t('calendar', 'Create new event'))

/**
 * Opens the new event dialog
 */
async function newEvent(): Promise<void> {
	await router.push(`/new/${route.params.view}`)
}

useHotKey('c', () => newEvent())
</script>

<template>
	<!-- The design puts «new event» where Tasks and Boards put theirs: a «+»
	     next to the column heading, not a full-width primary button that took
	     a row of its own above the month. -->
	<NcButton
		class="new-event"
		variant="secondary"
		:aria-label="newEventButtonAriaLabel"
		:title="newEventButtonAriaLabel"
		@click="newEvent">
		<template #icon>
			<Plus :size="20" />
		</template>
	</NcButton>
</template>
