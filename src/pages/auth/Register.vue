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
          <q-card-section horizontal>
            <!--
            <q-img src="https://picsum.photos/500/500" v-if="$q.screen.gt.sm" width="500px" style="max-height: 50%"/>
            -->
            <q-card-section :style="{
              'min-width': $q.screen.xs ? `${$q.screen.width}px` : '400px'
            }"
            >
              <div class="text-center text-h5">{{ $t("register_title") }}</div>
              <q-form @submit="submit" autofocus>
                <q-card-section class="q-pb-none">
                  <q-card-section class="q-gutter-md">
                    <q-input
                      :label="$t('register_input_username_label')"
                      :loading="checkingUsernameAvailability"
                      :rules="[
                      val => val.length > 1 || $t('register_too_short_username_error'),
                      val => val.length < 30 || $t('register_too_long_username_error'),
                      val => /^[a-zA-Z0-9-_]+$/.test(val) || $t('register_invalid_char_in_username_error'),
                      isUsernameAvailable
                     ]"
                      debounce="1000"
                      dense
                      outlined
                      rounded
                      type="text"
                      v-model="username"
                    >
                      <template v-slot:prepend>
                        <q-icon name="eva-person-outline"/>
                      </template>
                    </q-input>
                    <q-input
                      :label="$t('register_input_email_label')"
                      :loading="checkingEmailAvailability"
                      :rules="[
                      val => val.length > 0 || $t('register_empty_email_error'),
                      val => validateEmail(val) || $t('register_invalid_email_error'),
                      isEmailAvailable
                     ]"
                      debounce="1000"
                      dense
                      outlined
                      rounded
                      type="email"
                      v-model="email"
                    >
                      <template v-slot:prepend>
                        <q-icon name="eva-at-outline"/>
                      </template>
                      <template v-slot:append>
                        <q-avatar v-if="!checkingEmailAvailability">
                          <img :src="gravatarByEmail">
                        </q-avatar>
                      </template>
                    </q-input>
                    <q-input
                      :label="$t('register_input_password_label')"
                      :rules="[
                      val => val.length > 8 || $t('register_too_short_password_error'),
                      val => val.toLowerCase() !== val || $t('register_password_must_contain_uppercase_error'),
                      val => val.toUpperCase() !== val || $t('register_password_must_contain_lowercase_error'),
                      val => /\d/.test(val) || $t('register_password_must_contain_numbers_error')
                    ]"
                      :type="isPasswordVisible ? 'text' : 'password'"
                      debounce="1000"
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
                    <q-input
                      :label="$t('register_input_password_repeat_label')"
                      :rules="[
                        val => val === password || $t('register_different_passwords_error')
                      ]"
                      :type="isPasswordVisible ? 'text' : 'password'"
                      debounce="1000"
                      dense
                      outlined
                      rounded
                      v-model="passwordRepeat"
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
                    <q-btn :to="{ name: 'login' }" color="primary" flat no-caps rounded size="md">
                      {{ $t("login_button_login_label") }}
                    </q-btn>
                    <q-btn :loading="loading" color="primary" no-caps rounded size="md" type="submit">
                      {{ $t("register_button_submit_label")}}
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
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref } from "vue"
  import { load, ReCaptchaInstance } from "recaptcha-v3"
  import { api } from "src/api"
  import { router } from "src/router"
  import { MD5 } from "crypto-js"
  import { AvailabilityPayload, SessionModel } from "src/api/models"
  import assert from "assert"
  import { useI18n } from "vue-i18n"
  import { openSession } from "src/api/auth"
  import { useQuasar } from "quasar"

  function usePassword() {
    const password = ref("")
    const passwordRepeat = ref("")
    const isPasswordVisible = ref(false)
    return { password, passwordRepeat, isPasswordVisible }
  }

  export default {
    setup() {
      const { t } = useI18n()
      const { currentRoute } = router
      const $q = useQuasar()

      let recaptcha: ReCaptchaInstance
      onMounted(async () => {
        recaptcha = await load("6LcBUQYaAAAAABubeJN2IyISbRQa5KaTvD4p91MB")
        recaptcha.hideBadge()
      })

      onBeforeUnmount(() => {
        recaptcha.hideBadge()
      })

      function useEmail() {
        const email = ref("")
        const gravatarByEmail = computed(() => `https://www.gravatar.com/avatar/${ MD5(email.value) }?d=mp&s=72`)
        const checkingEmailAvailability = ref(false)

        function validateEmail(email: string): boolean {
          const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return re.test(email)
        }

        async function isEmailAvailable(email: string) {
          checkingEmailAvailability.value = true

          const { ok, payload } = await api.get<AvailabilityPayload>(`available/email?email=${ email }`)

          checkingEmailAvailability.value = false

          if (ok) return payload.available || t("register_email_taken_error")
          return t("register_request_error")
        }

        return { email, gravatarByEmail, validateEmail, isEmailAvailable, checkingEmailAvailability }
      }

      function useUsername() {
        const username = ref("")
        const checkingUsernameAvailability = ref(false)

        async function isUsernameAvailable(username: string) {
          checkingUsernameAvailability.value = true

          const { ok, payload } = await api.get<AvailabilityPayload>(`available/username?username=${ username }`)

          checkingUsernameAvailability.value = false

          if (ok) return payload.available || t("register_username_taken_error")
          return t("register_request_error")
        }

        return { username, isUsernameAvailable, checkingUsernameAvailability }
      }

      const usedUsername = useUsername()
      const usedPass = usePassword()
      const usedEmail = useEmail()
      const loading = ref(false)

      async function submit() {
        loading.value = true
        const { ok, payload } = await api.post<SessionModel>("register", {
          "username": usedUsername.username.value,
          "email": usedEmail.email.value,
          "password": usedPass.password.value,
          "captcha": await recaptcha.execute("login")
        })

        if (ok) {
          openSession(payload)
          loading.value = false

          const name = currentRoute.value.params.from ?? "index"
          assert(!Array.isArray(name), "\"From\" is array, not string")

          await router.isReady()
          await router.push({ name })
        } else {
          $q.notify(payload["message"])
        }
        loading.value = false
      }

      return {
        ...usedUsername,
        ...usedPass,
        ...usedEmail,
        submit,
        loading
      }
    }
  }
</script>

<style lang="sass" scoped>
  .constraint
    min-width: 650px
</style>
