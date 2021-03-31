<template lang="pug">
router-view
</template>

<script lang="ts" setup>
  import { useI18n } from "vue-i18n"
  import { useQuasar } from "quasar"

  const { locale } = useI18n({ useScope: "global" })
  locale.value = useQuasar().lang.getLocale() as string
</script>
