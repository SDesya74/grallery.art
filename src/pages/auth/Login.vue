<template lang="pug">
q-layout
  q-page-container
    q-page.items-center.justify-evenly.column.bg-secondary
      q-card.items-center.justify-evenly.column(:class="{ fullscreen: $q.screen.xs }")
        q-card-section(:class="{ 'min-width': $q.screen.xs ? `${$q.screen.width}px` : '400px' }")
          .text-center.text-h5 {{ $t("login_title") }}
          q-form(autofocus)
            q-card-section.q-pb-none
              
              //- login & password
              q-card-section.q-gutter-md
                q-input(:label="$t('login_input_login_label')" dense outlined rounded type="text" v-model="login")
                  template(v-slot:prepend)
                    q-icon(name="eva-person-outline")
                q-input(:label="$t('login_input_password_label')" :type="isPasswordVisible ? 'text' : 'password'" dense outlined rounded v-model="password")
                  template(v-slot:prepend)
                    q-icon(name="eva-lock-outline")
                  template(v-slot:append)
                    q-icon.cursor-pointer(:name="isPasswordVisible ? 'visibility_off' : 'visibility'" @click="isPasswordVisible = !isPasswordVisible")
              
              //- buttons
              q-card-section.q-gutter-md(align="center")
                q-btn(@click="register" color="accent" flat no-caps rounded size="md") {{ $t("login_button_register_label") }}
                q-btn(:loading="loading" color="primary" no-caps rounded size="md" @click="submit") {{ $t("login_button_submit_label") }}
              
              //- social buttons
              q-card-section.q-gutter-md(align="center")
                q-btn(color="red-6" flat icon="eva-google" round size="md")
                  q-tooltip(content-class="bg-accent") Sign in with Google
                q-btn(color="light-blue-8" flat icon="eva-facebook" round size="md")
                  q-tooltip(content-class="bg-accent") Sign in with Facebook
                q-btn(color="light-blue-13" flat icon="eva-twitter" round size="md")
                  q-tooltip(content-class="bg-accent") Sign in with Twitter
</template>

<script lang="ts">
  import { ref } from "vue"
  import { router } from "src/router"
  import assert from "assert"
  import { authorize } from "src/api/auth"
  import { useQuasar } from "quasar"

  export default {
    setup() {
      const $q = useQuasar()
      const { currentRoute } = router

      const isPasswordVisible = ref(false)
      const loading = ref(false)
      const login = ref("")
      const password = ref("")

      async function submit() {
        loading.value = true

        if (await authorize(login.value, password.value)) {
          const name = currentRoute.value.params.from ?? "index"
          assert(!Array.isArray(name), "\"From\" is array, not string")
          await router.isReady()
          await router.push({ name })
        } else {
          $q.notify("Error in authentication")
        }

        loading.value = false
      }

      async function register() {
        const from = currentRoute.value.params.from
        assert(!Array.isArray(from), "\"From\" is array, not string")
        await router.isReady()
        await router.push({ name: "register", params: { from, ...currentRoute.value.params } })
      }

      return { login, password, isPasswordVisible, submit, loading, register }
    }
  }
</script>
