import { Dark, getCssVar, LocalStorage, setCssVar } from "quasar"
import { boot } from "quasar/wrappers"
import { watch } from "vue"

export default boot(() => {
    function applyThemeColor(name: string) {
        const template = `${ name }-${ Dark.isActive ? "dark" : "light" }`
        const value = getCssVar(template)
        if (!value) throw `Template color ${ template } not found`
        setCssVar(name, value)
    }
    
    function applyTheme() {
        LocalStorage.set("dark", Dark.isActive)
        applyThemeColor("primary")
        applyThemeColor("secondary")
        applyThemeColor("accent")
        applyThemeColor("background")
    }
    
    watch(() => Dark.isActive, applyTheme)
    Dark.set(LocalStorage.getItem("dark") ?? true)
    
    applyTheme()
})
