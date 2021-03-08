<template lang="pug">
q-header(:reveal="$q.screen.xs" elevated)
  q-toolbar.gt-sm
    q-avatar.cursor-pointer(@click="index")
      img(src="icons/favicon-96x96.png")
    
    q-toolbar-title.gt-sm.q-mr-xs.cursor-pointer(shrink @click="index") Grallery.ART
    
    q-select.bg-primary(
      :menu-offset="[5, 10]"
      :options="searchOptions"
      :style="{ 'flex-grow': '1 !important', 'max-width': $q.screen.xs ? '50%' : '100%' }"
      @filter="searchFunction"
      dark
      debounce="50"
      dense
      hide-dropdown-icon
      hide-selected
      label="Search"
      option-label="username"
      option-value="username"
      options-dark
      ref="search"
      standout
      use-input
      v-model="searchUser"
    )
      template(v-slot:append)
        q-icon(name="search" v-if="!searchUser")
        q-icon.cursor-pointer(@click="searchUser = null" name="clear" v-else)
      
      template(v-slot:no-option)
        q-item.bg-white
          q-item-section.text-grey No results
      
      template(v-slot:option="option")
        q-item.bg-white(
          @click="onOptionClick(option.opt)"
          v-bind="option.itemProps"
        )
          q-item-section(avatar)
            q-avatar
              img(:src="option.opt.avatar")
          q-item-section
            q-item-label.text-black {{ option.opt.username }}
    
    q-space.xs
    
    .row.no-wrap.q-gutter-xs(v-if="isAuthorized === true")
      .q-mx-sm.q-gutter-x-xs
        mixin button
          q-btn(
            flat
            round=!block
            size="md"
          )&attributes(attributes)
            block
        
        +button()(icon="eva-bell-outline" class="bg-accent")
        +button()(icon="eva-message-circle-outline")
        +button()(icon="eva-upload-outline")
          span Upload
        +button()(:icon="$q.dark.isActive ? 'eva-sun-outline' : 'eva-moon-outline'" @click="$q.dark.toggle()")
        
        
        q-avatar.cursor-pointer(@click="onAvatarClick" size="40px")
          img(:src="`${me.avatar}&s=128`")
          q-menu.gt-xs(
            :offset="[5, 13]"
            transition-hide="jump-up"
            transition-show="jump-down"
            v-model="isMenuOpened"
          )
            .column.items-center.q-mt-md
              q-btn.q-pa-xs.bg-primary(@click="profile" flat round)
                q-avatar(size="96px")
                  img(:src="`${me.avatar}&s=256`")
              .text-subtitle1.q-my-xs {{ me.username }}
            
            
            q-separator
            
            q-list(style="min-width: 200px")
              q-item(@click="settings" clickable)
                q-item-section My commissions
              q-item(clickable)
                q-item-section My auctions
            
            .column.items-center.q-py-md
              q-btn(
                :label="$t('main_desktop_logout_label')"
                @click="logout"
                color="primary"
                no-caps
                push
                size="sm"
              )
    
    .row.no-wrap.q-gutter-xs.q-ml-xs(v-else-if="isAuthorized === false")
      q-btn.column.text-weight-medium.bg-accent(
        :class="{ 'text-subtitle1': $q.screen.gt.xs }"
        :dense="$q.screen.xs"
        @click="register"
        flat
        no-caps
      ) {{ $t("main_register_button_label") }}
      q-btn.column.text-weight-medium(
        :class="{ 'text-subtitle1': $q.screen.gt.xs }"
        :dense="$q.screen.xs"
        @click="login"
        flat
        no-caps
      ) {{ $t("main_register_button_label") }}
    .row.no-wrap.flex.q-gutter-xs.items-center(v-else)
      mixin skeleton
        q-skeleton(animation="fade")&attributes(attributes)
      
      +skeleton()(type="QBtn" width="100px")
      +skeleton()(type="QBtn" width="70px")
      +skeleton.q-mx-xs()(type="circle" size="35px")
      +skeleton()(size="40px" type="QAvatar")
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
