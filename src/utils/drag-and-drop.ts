import { computed, ref } from "vue"

const dragEnterCount = ref(0) // to prevent leave from child elements
export const windowDragging = computed(() => dragEnterCount.value > 0)

export function useDragAndDrop() {
    return {
        windowDragging,
        startDragging() {
            dragEnterCount.value++
        },
        stopDragging() {
            dragEnterCount.value--
        }
    }
}