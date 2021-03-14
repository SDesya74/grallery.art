<template lang="pug">
.fullscreen.bg-primary.text-white.text-center.q-pa-md.flex.flex-center
  div
    div(style="font-size: 30vh") 404
    .text-h2(style="opacity: 0.4") Oops. Nothing here...
    q-btn.q-mt-xl(color="white" no-caps text-color="primary" unelevated :to="{ name: 'index' }") Go Home
</template>

<script lang="ts">
  export default {}
</script>
