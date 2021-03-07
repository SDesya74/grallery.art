<template lang="pug">
q-layout(view="lHh Lpr lFf")
  main-header
  q-page-container
    router-view(:key="$route.fullPath" v-slot="{ Component }")
      transition(name="scale")
        component(:is="Component")
  
  q-page-sticky.xs(:offset="[20, 20]" position="bottom-right")
    q-fab(
      color="primary"
      direction="up"
      icon="keyboard_arrow_up"
      label-position="left"
      vertical-actions-align="left"
    )
      
      mixin fabAction
        q-fab-action(
          color="primary"
          external-label
          label-class="bg-grey-3 text-grey-8"
          label-position="left")&attributes(attributes)
      
      +fabAction()(
        @click="openCreatePostDialog"
        icon="mail"
        label="Create post"
      )
      +fabAction()(
        icon="alarm"
        label="Create auction"
      )
      +fabAction()(
        icon="airplay"
        label="Upload image"
      )
  
  q-footer.xs(reveal)
    q-tabs(align="justify")
      q-route-tab(no-caps to="/auctions") {{ $t("main_header_auctions_label") }}
      q-route-tab(no-caps to="/feed") {{ $t("main_header_feed_label") }}
</template>

<script lang="ts">
  import MainHeader from "components/MainHeader.vue"
  import { useQuasar } from "quasar"
  import CreatePostDialog from "components/dialogs/CreatePostDialog.vue"
  
  export default {
    components: { MainHeader },
    setup() {
      
      const $q = useQuasar()
      
      function openCreatePostDialog() {
        $q.dialog({
          component: CreatePostDialog
        })
      }
      
      return { openCreatePostDialog }
    }
  }
</script>
