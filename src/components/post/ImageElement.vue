<template>
  <q-img :src="data" height="400px">
    <template v-slot:loading>
      <q-skeleton height="100%" width="100%"/>
    </template>
  </q-img>
</template>

<script lang="ts">
  export default {
    props: {
      data: {
        type: String,
        default: ""
      }
    }
  }
</script>
