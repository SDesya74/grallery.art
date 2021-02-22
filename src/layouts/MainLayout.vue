<template>
  <q-layout view="lHh Lpr lFf">
    <main-header/>
    <q-page-container>
      <router-view :key="$route.fullPath" v-slot="{ Component }">
        <transition name="scale">
          <component :is="Component"/>
        </transition>
      </router-view>
    </q-page-container>

    <q-page-sticky
      :offset="[20, 20]"
      class="xs"
      position="bottom-right"
    >
      <q-fab
        color="primary"
        direction="up"
        icon="keyboard_arrow_up"
        label-position="left"
        vertical-actions-align="left"
      >
        <q-fab-action
          @click="openCreatePostDialog"
          color="primary"
          external-label
          icon="mail"
          label="Create post"
          label-class="bg-grey-3 text-grey-8"
          label-position="left"
        />
        <q-fab-action
          color="primary"
          external-label
          icon="alarm"
          label="Create auction"
          label-class="bg-grey-3 text-grey-8"
          label-position="left"
        />
        <q-fab-action
          color="primary"
          external-label
          icon="airplay"
          label="Upload image"
          label-class="bg-grey-3 text-grey-8"
          label-position="left"
        />
      </q-fab>
    </q-page-sticky>

    <q-footer class="xs" reveal>
      <q-tabs align="justify">
        <q-route-tab no-caps to="/auctions">
          {{ $t("main_header_auctions_label")}}
        </q-route-tab>
        <q-route-tab no-caps to="/feed">
          {{ $t("main_header_feed_label")}}
        </q-route-tab>
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
  import MainHeader from "components/MainHeader.vue"
  import { useQuasar } from "quasar"
  import CreatePostDialog from "components/CreatePostDialog.vue"

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
