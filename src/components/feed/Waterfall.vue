<template lang="pug">
q-infinite-scroll(:offset="Math.floor($q.screen.height / 4)", :style="{ width }" @load="onLoad")
  .row.justify-center(ref="waterfallRow")
    .column(:style="{ width: columnWidth }" v-for="{ elements } in columns")
      slot(:element="element" name="element" v-for="element in elements")
  template(v-slot:loading)
    div(class="row justify-center q-my-md")
      q-spinner-dots(color="primary" size="40px")
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
                columns.value = Array<Column>(parseInt(columnAmount))
                for (let i = 0; i < columns.value.length; i++) {
                    columns.value[i] = { elements: [], height: 0 }
                }
                
                for (const element of elements) {
                    const min = Math.min(...columns.value.map(e => e.height))
                    const index = columns.value.findIndex(e => e.height == min)
                    const column = columns.value[index]
                    if (!column) continue
                    column.elements.push(element)
                    column.height += element.height
                }
            }
            
            function onLoad(index: number, done: () => void) {
                emit("load", () => {
                    updateItems()
                    done()
                })
            }
            
            onMounted(updateItems)
            
            const waterfallRow = ref()
            const totalWidth = computed(() => waterfallRow.value.clientWidth)
            
            
            return { onLoad, columns, waterfallRow, totalWidth }
        }
    }
</script>
