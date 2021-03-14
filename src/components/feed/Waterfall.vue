<template lang="pug">
div(:style="{ width }")
  .row.justify-center(ref="waterfallRow")
    .column(:style="{ width: columnWidth }" v-for="{ elements } in columns")
      slot(:element="element" name="element" v-for="element in elements")
  .absolute-bottom(v-intersection="onIntersection" style="z-index: -999; height: 25vh; width: inherit")
</template>

<script lang="ts">
  import { computed, onMounted, ref, SetupContext } from "vue"
  
  type Column = {
    elements: any[],
    height: number
  }
  
  export default {
    emits: [ "load" ],
    props: {
      width: {
        type: String,
        default: "auto"
      },
      columnAmount: {
        type: [ Number, String ],
        required: true
      },
      columnWidth: {
        type: String,
        required: true
      },
      elements: {
        type: Array,
        required: true
      }
    },
    
    setup({ elements, columnAmount }: any, { emit }: SetupContext) {
      const columns = ref<Column[]>([])
      
      function updateItems() {
        const len = parseInt(columnAmount)
        const newColumns: Array<Column> = Array<Column>(len)
        for (let i = 0; i < len; i++) newColumns[i] = { elements: [], height: 0 }
        
        for (const element of elements) {
          const min = Math.min(...newColumns.map(e => e.height))
          const index = newColumns.findIndex(e => e.height == min)
          const column = newColumns[index]
          
          column.elements.push(element)
          column.height += element.height
        }
        
        columns.value = newColumns
      }
      
      function emitLoad() {
        emit("load", updateItems)
      }
      
      onMounted(emitLoad)
      
      const waterfallRow = ref()
      const totalWidth = computed(() => waterfallRow.value.clientWidth)
      const slot = ref()
      
      return {
        columns, waterfallRow, totalWidth, slot,
        
        onIntersection(entry: any) {
          if (!entry.isIntersecting) return
          console.log("load data")
          emitLoad()
        }
      }
    }
  }
</script>
