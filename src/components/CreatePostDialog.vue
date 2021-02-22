<template>
  <q-dialog @hide="onDialogHide" ref="dialog" title="New Post">
    <q-card class="q-dialog-plugin">
      <h6 class="text-grey-8 text-h6 q-ma-md">New Post</h6>
      <q-card-section>
        <q-input autogrow outlined/>
      </q-card-section>

      <q-card-section>
        <q-uploader
          class="full-width"
          :factory="uploadFactory"
          auto-upload
          flat
          hide-upload-btn
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn @click="ok" color="primary" label="OK"/>
        <q-btn @click="hide" color="primary" label="Cancel"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
  import { ref, SetupContext } from "vue"
  import { QDialog } from "quasar"
  import { AccessToken } from "src/utils/token"

  export default {
    props: {},
    setup({}, { emit }: SetupContext) {
      const dialog = ref<QDialog>()

      function show() {
        dialog.value!.show()
      }

      function hide() {
        dialog.value!.hide()
      }

      function onDialogHide() {
        emit("hide")
      }

      function ok() {
        emit("ok")
        hide()
      }

      function onCancelClick() {
        hide()
      }


      function uploadFactory() {
        return {
          fieldName: "fuck",
          url: "https://api.grallery.art/upload",
          method: "POST",
          headers: [
            { name: "Authorization", value: `Bearer ${ AccessToken.get() }` }
          ]
        }
      }


      return { dialog, show, hide, onDialogHide, ok, onCancelClick, uploadFactory }
    }
  }
</script>
