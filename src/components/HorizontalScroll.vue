<template lang="pug">
.row.no-wrap.no-scrollbar.full-width.q-pb-lg.q-gutter-sm(
  ref="horizontalScroll"
  @mousewheel="handleMouseWheel"
)
  slot
</template>

<script lang="ts">
  import { ref } from "vue"
  
  export default {
    setup() {
      const horizontalScroll = ref<HTMLElement>()
      let lastScrollTime: number = Date.now()
      
      function handleMouseWheel(wheel: any) { // wheel event
        if (!wheel.wheelDeltaY ? wheel.deltaMode === 0 : wheel.wheelDeltaY === -3 * wheel.deltaY) return
        wheel.preventDefault()
        
        if (Date.now() - lastScrollTime < 250) return
        lastScrollTime = Date.now()
        
        const view = horizontalScroll.value!
        view.scrollTo(view.scrollLeft - wheel.wheelDelta * 7, 0)
      }
      
      return { horizontalScroll, handleMouseWheel }
    }
  }
</script>

<style lang="sass" scoped>
  .no-scrollbar
    overflow-x: scroll
    scroll-snap-type: x proximity
    overflow: -moz-scrollbars-none
    -ms-overflow-style: none
    scroll-behavior: smooth
    width: auto
    
    &::-webkit-scrollbar
      display: none

</style>
