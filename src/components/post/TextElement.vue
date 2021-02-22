<template>
  <p class="q-pa-sm q-ma-none text-body1" style="overflow-wrap: break-word">{{ data }}</p>
</template>

<script lang="ts">
  export default {
    props: {
      data: {
        type: String,
        default: "!!! missing text !!!"
      }
    }
  }
</script>
