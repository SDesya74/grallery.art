<template>
  <q-header :reveal="$q.screen.xs" elevated>
    <q-toolbar>
      <q-avatar>
        <img src="icons/favicon-96x96.png">
      </q-avatar>

      <q-toolbar-title class="text-weight-medium gt-sm" shrink>
        Grallery.ART
      </q-toolbar-title>

      <q-select
        :menu-offset="[5, 10]"
        :options="searchOptions"
        @filter="searchFunction"
        class="bg-primary q-ml-xs"
        dark
        debounce="50"
        dense
        hide-dropdown-icon
        hide-selected
        label="Find..."
        option-label="username"
        option-value="username"
        ref="search"
        standout
        style="max-width: 200px"
        use-input
        v-model="searchUser"
      >
        <template v-slot:append>
          <q-icon name="search" v-if="!searchUser"/>
          <q-icon @click="searchUser = null" class="cursor-pointer" name="clear" v-else/>
        </template>
        <template v-slot:no-option>
          <q-item class="bg-white">
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>
        <template v-slot:option="option">
          <q-item
            @click="onOptionClick(option.opt)"
            class="bg-white"
            v-bind="option.itemProps"
          >
            <q-item-section avatar>
              <q-avatar>
                <img :src="option.opt.avatar">
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-black"> {{ option.opt.username }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-space/>

      <div class="q-gutter-xs row no-wrap" v-if="isAuthorized === true">
        <q-btn class="text-subtitle1 text-weight-medium gt-xs" flat no-caps to="/auctions">
          {{ $t("main_header_auctions_label")}}
        </q-btn>
        <q-btn class="text-subtitle1 text-weight-medium gt-xs" flat no-caps to="/feed">
          {{ $t("main_header_feed_label")}}
        </q-btn>
        <q-btn class="q-mx-xs gt-xs" flat icon="eva-plus-outline" round>
          <q-menu
            :offset="[5, 13]"
            auto-close
            transition-hide="jump-up"
            transition-show="jump-down"
          >
            <q-list style="min-width: 100px">
              <q-item clickable>
                <q-item-section @click="openCreatePostDialog">{{ $t("main_header_new_post_label")}}</q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section>{{ $t("main_header_new_auction_label")}}</q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section>{{ $t("main_header_upload_image_label")}}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <q-avatar @click="onAvatarClick" class="pointer" size="40px">
          <img :src="`${me.avatar}&s=128`">
          <q-menu
            :offset="[5, 13]"
            transition-hide="jump-up"
            transition-show="jump-down"
            v-if="$q.screen.gt.xs"
            v-model="isMenuOpened"
          >
            <div class="column items-center q-mt-sm">
              <q-avatar @click="profile" size="128px">
                <img :src="`${me.avatar}&s=256`">
              </q-avatar>

              <div class="text-subtitle1 q-my-xs"> {{ me.username }}</div>

              <q-btn
                :label="$t('main_desktop_logout_label')"
                @click="logout"
                color="primary"
                no-caps
                push
                size="sm"
              />
            </div>

            <q-separator class="q-my-sm"/>

            <q-list style="min-width: 200px;">
              <q-item clickable>
                <q-item-section> {{ $t("main_desktop_settings_label")}}</q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section>{{ $t("main_desktop_auctions_label")}}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-avatar>
      </div>
      <div v-else-if="isAuthorized === false">
        <q-btn @click="register" class="text-subtitle1 text-weight-medium" flat no-caps dense>
          {{ $t("main_register_button_label") }}
        </q-btn>
        <q-btn @click="login" class="text-subtitle1 text-weight-medium" flat no-caps dense>
          {{ $t("main_login_button_label") }}
        </q-btn>
      </div>
      <div class="flex q-gutter-xs row items-center no-wrap" v-else>
        <q-skeleton animation="fade" type="QBtn" width="100px"/>
        <q-skeleton animation="fade" type="QBtn" width="70px"/>
        <q-skeleton animation="fade" class="q-mx-xs" size="35px" type="circle"/>
        <q-skeleton animation="fade" size="40px" type="QAvatar"/>
      </div>
    </q-toolbar>

    <!--
    <q-slide-transition v-if="$q.screen.xs">
      <div v-show="isMenuOpened">
        <q-separator inset/>
        <div class="q-pa-sm">
          <q-list>
            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label> {{ $t("main_mobile_auctions_label") }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label> {{ $t("main_mobile_settings_label") }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item @click="logout" clickable v-ripple>
              <q-item-section>
                <q-item-label> {{ $t("main_mobile_logout_label") }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </q-slide-transition>
    -->
  </q-header>
</template>

<script lang="ts">
  import { ref } from "vue"
  import { api } from "src/api"
  import { UserModel } from "src/api/models"
  import { router } from "src/router"
  import { useMenu } from "src/utils"
  import { closeSession } from "src/api/auth"
  import { QSelect, useQuasar } from "quasar"
  import CreatePostDialog from "components/CreatePostDialog.vue"

  type Option = {
    username: string,
    avatar: string
  }

  const me = ref<UserModel | null>()
  const isAuthorized = ref<boolean | null>(null)

  function authorize() {
    api.get<UserModel>("me", true)
      .then(({ payload }) => {
        me.value = payload
        isAuthorized.value = true
      })
      .catch(() => {
        isAuthorized.value = false
        return void 0
      })
  }


  function useSearch() {
    const search = ref<QSelect>()
    const searchUser = ref<Option | null>(null)
    const searchOptions = ref<Iterable<Option>>([])

    function searchFunction(val: string, update: (method?: () => void) => void) {
      update(async () => {
        const q = val.toLowerCase()

        // FIXME: Injection
        const { ok, payload } = await api.get<{
          users: {
            username: string,
            avatar: string
          }[]
        }>(`search/user?fields[user]=username,avatar&q=${ q }`)

        if (ok) {
          const { users } = payload
          searchOptions.value = Object.values(users)
          search.value!.refresh()
        }
      })
    }

    async function onOptionClick(option: Option) {
      await router.isReady()
      await router.push({
        name: "user",
        params: {
          username: option.username
        }
      })
    }

    return { search, searchOptions, searchUser, searchFunction, onOptionClick }
  }

  export default {
    setup() {
      authorize()

      const { currentRoute } = router
      const from = currentRoute.value.name ? currentRoute.value.name.toString() : ""

      async function login() {
        await router.isReady()
        await router.push({ name: "login", params: { from, ...currentRoute.value.params } })
      }

      async function register() {
        await router.isReady()
        await router.push({ name: "register", params: { from, ...currentRoute.value.params } })
      }

      async function profile() {
        await router.isReady()
        await router.push({ name: "me" })
      }

      async function logout() {
        me.value = null
        isAuthorized.value = false
        closeSession()

        await router.isReady()
        await router.push({ name: "index" })
      }

      function onAvatarClick() {
        if ($q.screen.xs) profile()
        console.log("on avatar click")
      }


      const $q = useQuasar()

      function openCreatePostDialog() {
        $q.dialog({
          component: CreatePostDialog
        })
      }

      return {
        ...useMenu(),
        ...useSearch(),

        isAuthorized,
        me,
        login,
        register,
        profile,
        logout,

        openCreatePostDialog,
        onAvatarClick
      }
    }
  }
</script>
