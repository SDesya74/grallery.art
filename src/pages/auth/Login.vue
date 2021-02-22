<template>
  <q-layout>
    <q-page-container>
      <q-page class="items-center justify-evenly column bg-secondary">
        <q-card :class="{
          'items-center': true,
          'justify-evenly': true,
          'column': true,
          'fullscreen': $q.screen.xs
        }"
        >
          <q-card-section :style="{
              'min-width': $q.screen.xs ? `${$q.screen.width}px` : '400px'
            }"
          >
            <div class="text-center text-h5">{{ $t("login_title") }}</div>
            <q-form @submit="submit" autofocus>
              <q-card-section class="q-pb-none">
                <q-card-section class="q-gutter-md">
                  <q-input
                    :label="$t('login_input_login_label')"
                    dense
                    outlined
                    rounded
                    type="text"
                    v-model="login"
                  >
                    <template v-slot:prepend>
                      <q-icon name="eva-person-outline"/>
                    </template>
                  </q-input>
                  <q-input
                    :label="$t('login_input_password_label')"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    dense
                    outlined
                    rounded
                    v-model="password"
                  >
                    <template v-slot:prepend>
                      <q-icon name="eva-lock-outline"/>
                    </template>
                    <template v-slot:append>
                      <q-icon
                        :name="isPasswordVisible ? 'visibility_off' : 'visibility'"
                        @click="isPasswordVisible = !isPasswordVisible"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-input>
                </q-card-section>

                <q-card-section align="center" class="q-gutter-md">
                  <q-btn @click="register" color="primary" flat no-caps rounded size="md">
                    {{ $t("login_button_register_label") }}
                  </q-btn>
                  <q-btn :loading="loading" color="primary" no-caps rounded size="md" type="submit">
                    {{ $t("login_button_submit_label") }}
                  </q-btn>
                </q-card-section>
                <q-card-section align="center" class="q-gutter-md">
                  <q-btn color="red-6" flat icon="eva-google" round size="md">
                    <q-tooltip content-class="bg-accent"> Sign in with Google</q-tooltip>
                  </q-btn>
                  <q-btn color="light-blue-8" flat icon="eva-facebook" round size="md">
                    <q-tooltip content-class="bg-accent"> Sign in with Facebook</q-tooltip>
                  </q-btn>
                  <q-btn color="light-blue-13" flat icon="eva-twitter" round size="md">
                    <q-tooltip content-class="bg-accent"> Sign in with Twitter</q-tooltip>
                  </q-btn>
                </q-card-section>
              </q-card-section>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
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
