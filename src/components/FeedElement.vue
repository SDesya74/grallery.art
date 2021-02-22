<template>
  <q-card :height="height" :width="width">
    <img :src="src" @load="loaded = true" v-show="loaded"/>
    <q-skeleton :height="height" :width="width" square v-if="!loaded"/>
  </q-card>
</template>

<script lang="ts">
  import { ref } from "vue"

  export default {
    props: {
      src: {
        type: String,
        required: true
      },
      width: {
        type: String,
        required: true
      },
      height: {
        type: String,
        required: true
      }
    },
    setup() {
      const loaded = ref(false)
      return { loaded }
    }
  }
</script>
