<template>
  <div :class="{ ready }" class="waterfall bg-secondary" ref="wall">
    <div :key="index" class="waterfall-column" v-for="(lane, index) in columns">
      <div :key="i" :ref="`item_${i}`" class="waterfall-item" v-for="i in lane.indices">
        <slot :index="i" v-bind:item="items[i]"> {{ items[i] }}</slot>
      </div>
      <div
        :data-column="index"
        class="waterfall-bottom"
        ref="bottom"
        v-observe-visibility="{ callback: v => v && fill(), throttle: 300 }"
      />
    </div>
    <div :data-column="0" class="waterfall-bottom" ref="bottom" v-if="!columns.length"/>
  </div>
</template>

<script lang="ts">
  function maxBy<T>(array: T[], iteratee: (value: T) => number) {
    let result
    if (array == null) return result

    let computed = Number.MIN_VALUE
    for (const i in array) {
      const value = array[i]
      const current = iteratee(value)

      if (current > computed) {
        computed = current
        result = value
      }
    }
    return result
  }

  import { ObserveVisibility } from "vue-observe-visibility"
  import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from "vue"

  function createColumns(count: number) {
    const columns = []
    for (let i = 0; i < count; i++) {
      columns.push({ i: i, indices: [] })
    }
    return columns
  }

  export default {
    directives: {
      "observe-visibility": ObserveVisibility
    },

    props: {
      items: {
        type: Array,
        required: true
      },
      columnPadding: {
        type: String,
        required: false,
        default: "10px"
      }
    },

    setup(props: any, methods: any) {
      const columns = reactive<any[]>([])
      const cursor = ref(0)
      const ready = ref(false)
      const ratio = ref(1)
      const bottom = ref<any[]>([])
      const wall = ref<any>(null)
      const columnWidth = ref(300)
      const columnPaddingPx = computed(() => parseInt(props.columnPadding.replace(/D/g, "")))

      function redraw() {
        ready.value = false
        columns.splice(0)
        cursor.value = 0
        columns.push(...createColumns(calcColumnAmount()))
        ready.value = true
        fill()
      }

      function calcColumnAmount() {
        const colWidth = columnWidth.value
        const scrollWidth = wall.value.scrollWidth
        const amount = Math.max(Math.round(scrollWidth / colWidth), 1)
        const realWidth = scrollWidth / amount - columnPaddingPx.value * 2
        ratio.value = realWidth / colWidth
        return amount
      }

      function fill() {
        if (!ready.value) return
        if (cursor.value >= props.items.length) return methods.emit("append")

        nextTick(() => {
          addItem(maxBy(bottom.value, spacer => spacer.dataset.column ?? 0) ?? 0)
          fill()
        })
      }

      function addItem(index: number) {
        if (props.items?.[cursor.value]) columns[index].indices.push(cursor.value++)
      }

      const resize = () => {
        let w = 200
        const total = wall.value.scrollWidth
        if (total) {
          if (total < 600) w = 175
          else if (total < 1024) w = 225
          else if (total < 1440) w = 275
          else if (total < 1920) w = 315
          else w = 360
        }
        columnWidth.value = w
        if (columns.length !== calcColumnAmount()) redraw()
      }

      onMounted(() => {
        resize()
        window.addEventListener("resize", resize)
      })

      onBeforeUnmount(() => {
        window.removeEventListener("resize", resize)
      })

      return { bottom, wall, fill, columns, ready, columnWidth, ratio }
    }
  }
</script>

<style lang="sass" scoped>
  .waterfall
    display: flex

    .waterfall:not(.ready)
      opacity: 0

    .waterfall-column
      flex-grow: 1
      flex-basis: 0
      display: flex
      flex-direction: column

    .waterfall-bottom
      flex-grow: 1
      margin-top: -300px
      padding-top: 300px
      min-height: 100px
</style>
