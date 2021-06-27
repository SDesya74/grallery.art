import { boot }       from "quasar/wrappers"
import { createI18n } from "vue-i18n"

import ruRU from "../i18n/ru-RU.json"
import enUS from "../i18n/en-US.json"

type Locale = {
    value: string | string[]
    label: string
    messages: object
}

const languages: Locale[] = [
    { value: [ "en-US", "en", "en-RU" ], label: "English", messages: enUS },
    { value: [ "ru-RU", "ru" ], label: "Русский", messages: ruRU }
]

const i18n = createI18n({
    locale: "en-US",
    fallbackLocale: "en-US",
    messages: languages.reduce(
        (messages, e) => {
            if (typeof e.value === "string") {
                messages[e.value] = e.messages
            } else {
                for (const lang of e.value) messages[lang] = e.messages
            }
            return messages
        },
        {} as any
    )
})

export default boot(({ app }) => {
    app.use(i18n)
})

export { i18n, languages }
