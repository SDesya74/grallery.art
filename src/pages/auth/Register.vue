<template lang="pug">
q-layout
  q-page-container
    q-page.items-center.justify-center.column.bg-secondary
      q-card.items-center.justify-evenly.column(:class="{ fullscreen: $q.screen.xs }")
        q-card-section(horizontal)
          q-card-section(:style="{ 'min-width': $q.screen.xs ? `${$q.screen.width}px` : '400px' }")
            .text-center.text-h5 {{ $t("register_title") }}
            q-form(autofocus)
              q-card-section.q-pb-none
                q-card-section.q-gutter-md
                  q-input(
                    :label="$t('register_input_username_label')"
                    :loading="checkingUsernameAvailability"
                    debounce="1000"
                    dense
                    outlined
                    rounded
                    type="text"
                    v-model="username"
                    :rules=`[
                        val => val.length > 1 || $t('register_too_short_username_error'),
                        val => val.length < 30 || $t('register_too_long_username_error'),
                        val => /^[a-zA-Z0-9-_]+$/.test(val) || $t('register_invalid_char_in_username_error'),
                        usernameAvailable
                    ]`
                  )
                    template(v-slot:prepend)
                      q-icon(name="eva-person-outline")
                  q-input(:label="$t('register_input_email_label')"
                    :loading="checkingEmailAvailability"
                    debounce="1000"
                    dense
                    outlined
                    rounded
                    type="email"
                    v-model="email"
                    :rules=`[
                        val => val.length > 0 || $t('register_empty_email_error'),
                        val => validateEmail(val) || $t('register_invalid_email_error'),
                        emailAvailable
                    ]`
                  )
                    template(v-slot:prepend)
                      q-icon(name="eva-at-outline")
                    template(v-slot:append)
                      q-avatar(v-if="!checkingEmailAvailability")
                        img(:src="gravatarByEmail" alt="avatar")
                  q-input(
                    :label="$t('register_input_password_label')"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    debounce="1000"
                    dense
                    outlined
                    rounded
                    v-model="password"
                    :rules=`[
                        val => val.length > 8 || $t('register_too_short_password_error'),
                        val => val.toLowerCase() !== val || $t('register_password_must_contain_uppercase_error'),
                        val => val.toUpperCase() !== val || $t('register_password_must_contain_lowercase_error'),
                        val => /\d/.test(val) || $t('register_password_must_contain_numbers_error')
                    ]`
                  )
                    template(v-slot:prepend)
                      q-icon(name="eva-lock-outline")
                    template(v-slot:append)
                      q-icon(
                        :name="isPasswordVisible ? 'visibility_off' : 'visibility'"
                        @click="isPasswordVisible = !isPasswordVisible"
                        class="cursor-pointer"
                      )
                  q-input(
                    :label="$t('register_input_password_repeat_label')"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    debounce="1000"
                    dense
                    outlined
                    rounded
                    v-model="passwordRepeat"
                    :rules=`[
                        val => val === password || $t('register_different_passwords_error')
                    ]`
                  )
                    template(v-slot:prepend)
                      q-icon(name="eva-lock-outline")
                    template(v-slot:append)
                      q-icon(
                        :name="isPasswordVisible ? 'visibility_off' : 'visibility'"
                        @click="isPasswordVisible = !isPasswordVisible"
                        class="cursor-pointer"
                      )
                
                q-card-section.q-gutter-md(align="center")
                  q-btn(@click="login" color="accent" flat no-caps rounded size="md") {{ $t("register_button_login_label") }}
                  q-btn(:loading="loading" color="primary" no-caps rounded size="md" @click="submit") {{ $t("register_button_submit_label") }}
                
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
  import { computed, onBeforeUnmount, onMounted, ref } from "vue"
  import { load, ReCaptchaInstance } from "recaptcha-v3"
  import { router, routeTo } from "src/router"
  import { MD5 } from "crypto-js"
  import assert from "assert"
  import { useI18n } from "vue-i18n"
  import { openSession } from "src/api/auth"
  import { useQuasar } from "quasar"
  import { isEmailAvailable, isUsernameAvailable, register } from "api"
  
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
        
        async function emailAvailable(email: string) {
          checkingEmailAvailability.value = true
          try {
            const available = await isEmailAvailable(email)
            
            return available || t("register_email_taken_error")
          } catch {
            return t("register_request_error")
          } finally {
            checkingEmailAvailability.value = false
          }
        }
        
        return { email, gravatarByEmail, validateEmail, emailAvailable, checkingEmailAvailability }
      }
      
      function useUsername() {
        const username = ref("")
        const checkingUsernameAvailability = ref(false)
        
        async function usernameAvailable(username: string) {
          checkingUsernameAvailability.value = true
          try {
            const available = await isUsernameAvailable(username)
            return available || t("register_username_taken_error")
          } catch {
            return t("register_request_error")
          } finally {
            checkingUsernameAvailability.value = false
          }
        }
        
        return { username, isUsernameAvailable, checkingUsernameAvailability }
      }
      
      const usedUsername = useUsername()
      const usedPass = usePassword()
      const usedEmail = useEmail()
      const loading = ref(false)
      
      async function submit() {
        loading.value = true
        try {
          const session = await register({
            username: usedUsername.username.value,
            email: usedEmail.email.value,
            password: usedPass.password.value,
            captcha: await recaptcha.execute("login")
          })
          openSession(session)
          
          const name = currentRoute.value.params.from ?? "index"
          assert(typeof name == "string", "\"Name\" is not string")
          await routeTo(name)
        } catch (e) {
          $q.notify(e)
        } finally {
          loading.value = false
        }
      }
      
      async function login() {
        const from = currentRoute.value.params.from
        await routeTo("login", { from })
      }
      
      return {
        ...usedUsername,
        ...usedPass,
        ...usedEmail,
        submit,
        loading,
        login
      }
    }
  }
</script>

<style lang="sass" scoped>
  .constraint
    min-width: 650px
</style>
