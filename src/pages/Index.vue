<template lang="pug">
q-page
  q-tabs.bg-secondary.text-white.shadow-2(
    :breakpoint="0"
    :dence="$q.screen.lt.md"
    active-bg-color="accent"
    align="center"
    indicator-color="transparent"
    inline-label
    v-model="tab"
  )
    
    -
        const tabs = [
            { name: "feed", label: "Feed" },
            { name: "commissions", label: "Commissions" },
            { name: "posts", label: "Posts" },
            { name: "subscriptions", label: "Subscriptions" },
            { name: "recommended", label: "Recommended" },
        ]
    each tab in tabs
      q-tab(name=tab.name no-caps)= tab.label
  
  .column
    .row.text-h5.q-pl-md.q-pt-md Trend
    .row.no-wrap.no-scrollbar.full-width(
      ref="trendview"
      style="scroll-behavior: smooth; width: auto"
      @mousewheel="onscroll"
    )
      q-card.q-mx-sm(v-for="i in 30")
        q-img(:src="`https://picsum.photos/400/300?random=${i}`" height="200px" width="300px")
        q-card-section Text
  
  .column
    .row.text-h5.q-pl-md.q-pt-md Feed
    .row.reverse.no-wrap
      .column.q-pt-sm
        q-card.row.q-mx-xs.gt-md.q-mx-sm(style="width: 300px")
          q-input(
            :label-color="$q.dark.isActive ? 'unset' : 'secondary'"
            :menu-offset="[0, 10]"
            dark
            dense
            hide-dropdown-icon
            hide-selected
            label="Search"
            standout
            style="flex-grow: 1 !important"
            use-input
            v-model="searchTags"
          )
            template(v-slot:append)
              q-icon(name="search")
      
      waterfall.column(
        :column-amount="columnAmount"
        :column-width="columnWidth"
        :elements="items"
        :key="$q.screen.name"
        :width="$q.screen.gt.md ? 'calc(100% - 300px)' : '100%'"
        @load="onLoad"
        ref="waterfall"
      )
        template(v-slot:element="{ element: { image: { url, width, height }, author } }")
          .q-pa-sm(style="width: 100%")
            q-card.shadow-8
              q-img(:src="url" :height="`calc(${ height }px / ${ width / (waterfall.totalWidth / columnAmount) })`")
              q-card-section
                q-btn.q-pa-xs.q-mr-sm.bg-primary(flat round)
                  q-avatar(size="lg")
                    img(src="/icons/favicon-96x96.png")
                | {{ author }}
</template>

<script lang="ts">
  import { computed, onMounted, ref } from "vue"
  import Waterfall from "components/feed/Waterfall.vue"
  import { Screen } from "quasar"
  
  type ImageData = {
    width: number
    height: number
    url: string
  }
  
  type FeedElementData = {
    height: number,
    
    image: ImageData
    author: string
  }
  
  export default {
    components: { Waterfall },
    setup: function () {
      const items = ref<FeedElementData[]>([])
      
      function addItems(amount: number) {
        for (let i = 0; i < amount; i++) {
          const width = (Math.floor(Math.random() * 180) + 50) * 10
          const height = width + Math.floor(Math.random() * 60 - 30) * 10
          const url = `https://picsum.photos/${ width }/${ height }?random=${ Math.random() }`
          // const url = `https://via.placeholder.com/${ width }x${ height }?text=${ width }x${ height }`
          
          const totalWidth = waterfall.value.totalWidth
          const columnWidth = totalWidth / columnAmount.value
          
          items.value.push({
            height: height * (columnWidth / width),
            image: { width, height, url },
            author: "SDesya74"
          })
        }
      }
      
      onMounted(() => addItems(30))
      
      const trendview = ref<HTMLElement>()
      let lastScrollTime = -1
      
      function onscroll(wheel: any) {
        const isTouchPad = wheel.wheelDeltaY ? wheel.wheelDeltaY === -3 * wheel.deltaY : wheel.deltaMode === 0
        if (!isTouchPad) {
          wheel.preventDefault()
          if (Date.now() - lastScrollTime < 250) return
          lastScrollTime = Date.now()
          trendview.value?.scrollTo({
            left: trendview.value.scrollLeft - wheel.wheelDelta * 7
          })
        }
      }
      
      
      const tab = ref("feed")
      const waterfall = ref<any>()
      
      function onLoad(done: () => void) {
        addItems(columnAmount.value * 3)
        done()
      }
      
      const searchTags = ref<string>("")
      
      
      const columnAmount = computed<number>(() => {
        if (Screen.xs) return 2
        if (Screen.sm) return 3
        if (Screen.md) return 4
        if (Screen.lg) return 5
        if (Screen.xl) return 6
        return 1
      })
      
      const columnWidth = computed<string>(() => {
        return `calc(100% / ${ columnAmount.value })`
      })
      
      return {
        trendview,
        onscroll,
        
        tab,
        
        items,
        onLoad,
        searchTags,
        
        columnAmount,
        columnWidth,
        waterfall
      }
    }
  }
</script>

<style lang="scss">
  .no-scrollbar {
    overflow-x         : scroll;
    scroll-snap-type   : x proximity;
    overflow           : -moz-scrollbars-none;
    -ms-overflow-style : none;
    
    &::-webkit-scrollbar {
      display : none
    }
  }
  
  .grid-container {
    columns    : 8;
    column-gap : 1%;
    width      : 90vw;
    
    div {
      margin        : 0 1% 1% 0;
      display       : inline-block;
      width         : 100%;
      padding       : 5px;
      border-radius : 5px;
      
      img {
        width         : 100%;
        border-radius : 5px;
      }
    }
  }
</style>
