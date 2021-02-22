<template>
  <q-page class="column items-center justify-evenly">


    <waterfall :items="items">
      <template v-slot:default="{ item }">
        <feed-element :height="item.height" :src="item.src" :width="item.width"/>
      </template>
    </waterfall>


    <q-page-scroller :offset="[0, 0]" :scroll-offset="150" expand position="top">
      <div class="col cursor-pointer q-pa-sm bg-accent text-white text-center">
        Scroll back up...
      </div>
    </q-page-scroller>
  </q-page>
</template>

<script lang="ts">
  import Waterfall from "components/Waterfall.vue"
  import FeedElement from "components/FeedElement.vue"
  import { onMounted, reactive, ref } from "vue"

  function loadImage(width: number, height: number): object {
    return {
      width: `${ width }px`,
      height: `${ height }px`,
      src: `https://picsum.photos/${ width }/${ height }?t=${ Math.random() }`
    }
  }

  const items = reactive([
    loadImage(200, 500),
    loadImage(200, 200),
    loadImage(500, 400),
    loadImage(300, 400)
  ])


  export default {
    components: { FeedElement, Waterfall },
    setup() {
      let mounted = false
      const items = reactive<any[]>([])

      onMounted(() => {
        mounted = true
        append()
      })


      function append() {
        if (!mounted) return
        items.push(loadImage(500, 300))
      }

      return { items, append }
    }
  }
</script>

<style scoped>

</style>
