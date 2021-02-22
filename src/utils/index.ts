import { ref } from "vue"

export function useMenu() {
  const isMenuOpened = ref(false)

  function toggleMenu() {
    isMenuOpened.value = !isMenuOpened.value
  }

  function openMenu() {
    isMenuOpened.value = true
  }

  function closeMenu() {
    isMenuOpened.value = false
  }

  return { isMenuOpened, openMenu, closeMenu, toggleMenu }
}
