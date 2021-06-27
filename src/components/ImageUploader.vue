<template lang="pug">
div.items-center.justify-evenly(:style=`{
        "height": computedHeight,
        "width": computedWidth
      }`)
  button.items-center.justify-evenly.uploader(
    @dragenter="handleStartDragging"
    @dragleave="handleStopDragging"
    @dragover="handleDragOver"
    @drop="event => { handleDrop(event); dropImage(event) }"

    @click.prevent="onButtonClicked"

    style="height: 100%; width: 100%"
    :class=`{
        "highlighted": windowDragging,
        "hovered": dragging,
        "image-selected": isImageSelected
    }`
  )
    q-card.stack(flat v-show="isImageSelected")
      img.background(
        ref="thumbnail"
        style="border-radius: 3px; object-fit: cover"
        :style=`{
            "height": computedHeight,
            "width": computedWidth,
            ...thumbnailStyle
        }`
        :class="thumbnailClass"
        :src="preview"
        @dragstart="event => event.preventDefault()"
      )
      q-linear-progress.absolute-bottom.progress-bar(size="10px" :value="uploading.progress" color="accent")
      q-btn.q-mt-xs.q-mr-xs.absolute-top-right(round flat icon="eva-close-outline" color="accent" @click.prevent="removeImage")

    div.q-pa-sm(v-show="!isImageSelected")
      slot(name="empty")
        .text-body2(:class="$q.dark.isActive ? 'text-white' : 'text-dark'") Drag images

</template>

<script lang="ts">
  import { computed, onMounted, reactive, ref, SetupContext } from "vue"
  import { global, useDragAndDrop }                           from "src/utils/drag-and-drop"
  import { getImageUploadServer }                             from "api"
  import { api, axios }                                       from "boot/axios"
  import { Image, ApiResponse }                                            from "src/models"

  const { dragging: windowDragging } = global

  function showSelectFileDialog(contentType: string): Promise<File> {
    return new Promise((resolve, reject) => {
      const input = document.createElement("input")
      input.type = "file"
      input.multiple = false
      input.accept = contentType
      input.onchange = _ => resolve(Array.from(input.files!)[0])
      input.onerror = error => reject(error)

      input.click()
    })
  }

  type Fit = "width" | "height" | "fill" | "none"

  type UploadingImage = {
    progress: number
    image: File | null
    url: string | null
    hash: string | null
  }

  type Props = {
    width: string,
    height: string,
    fit: Fit,
    name: string
    id: string
    preview: string | null
    modelValue: Image | null
  }

  export default {
    props: {
      fit: {
        type: String,
        default: "fill"
      },
      height: {
        type: String,
        required: true
      },
      width: {
        type: String,
        required: true
      },
      name: {
        type: String,
        default: "image"
      },
      thumbnailClass: {
        type: [ String, Array, Object ],
        default: ""
      },
      thumbnailStyle: {
        type: [ String, Array, Object ],
        default: ""
      },
      preview: String,
      id: String,
      modelValue: Object
    },
    emits: [ "imageSelected", "update:preview", "update:id", "update:modelValue" ],

    setup({ width, height, fit, name, id, preview, modelValue }: Props, { emit }: SetupContext) {
      const thumbnail = ref<HTMLImageElement>()
      const isUploading = computed(() => isImageSelected.value && !isImageUploaded.value)
      const isImageUploaded = ref(false)
      const isImageSelected = ref(false)

      if (preview != null || modelValue != null) {
        isImageUploaded.value = true
        isImageSelected.value = true
        onMounted(() => thumbnail.value!.src = (preview ?? modelValue?.url) as string)
      }

      const computedWidth = computed<string>(() => {
        if (!isImageSelected.value) return width

        if (fit === "fill" || fit === "width") return width
        return "auto"
      })

      const computedHeight = computed<string>(() => {
        if (!isImageSelected.value) return height

        if (fit === "fill" || fit === "height") return height
        return "auto"
      })

      const uploading = reactive<UploadingImage>({
        progress: 0,
        image: null,
        url: null,
        hash: null
      })

      async function selectFile(file: File) {
        isImageUploaded.value = false

        uploading.image = file
        uploading.progress = 0

        isImageSelected.value = true

        // place image preview
        const pointer = URL.createObjectURL(file)
        thumbnail.value!.src = pointer
        thumbnail.value!.onload = () => URL.revokeObjectURL(pointer)

        const { upload_url } = await getImageUploadServer(file)
        uploading.url = upload_url

        const cdn_result = await uploadImageToCDN()

        const image = await uploadImageToAPI(cdn_result)
        const { id, url } = image

        emit("update:preview", url)
        emit("update:id", id)
        emit("update:modelValue", image)

        isImageUploaded.value = true
      }

      async function uploadImageToCDN(): Promise<{ image: string }> {
        return new Promise(async (resolve, reject) => {
          const { url, image } = uploading

          if (!isImageSelected.value) return reject("File not found")
          if (url === null) return reject("Url not found")

          const form = new FormData()
          form.append(name, image!)

          try {
            const { data: { payload }, status } = await axios.post<ApiResponse<{ image: string }>>(url, form, {
              headers: {
                "Content-Type": "multipart/form-data"
              },
              onUploadProgress: e => uploading.progress = e.loaded / e.total
            })
            resolve(payload)
          } catch (error) {
            reject(error)
          }
        })
      }

      async function uploadImageToAPI(result: { image: string }): Promise<Image> {
        const { data: { payload: image }, status } = await api.post<ApiResponse<Image>>("/image", {
          ...result
        })
        return image
      }

      return {
        ...useDragAndDrop(),
        windowDragging,

        computedWidth,
        computedHeight,

        isImageSelected,
        isImageUploaded,
        isUploading,

        thumbnail,
        uploading,

        async onButtonClicked(event: MouseEvent) {
          if (isImageSelected.value) {
            // Show dialog with image
          } else {
            const file = await showSelectFileDialog("image/*")
            await selectFile(file)
          }
        },
        async dropImage(event: DragEvent): Promise<void> {
          if (isImageSelected.value) return

          const file = event.dataTransfer?.files[0]
          if (file) return await selectFile(file)
        },
        removeImage: function (event: MouseEvent) {
          event.stopPropagation()

          uploading.progress = 0
          uploading.image = null
          uploading.url = null
          uploading.hash = null

          emit("update:preview", null)
          isImageUploaded.value = false
          isImageSelected.value = false
        }
      }
    }
  }
</script>

<style lang="sass" scoped>
  .stack
    display: grid

    .background
      grid-area: 1 / 1 / 4 / 2

  .uploader
    margin: 0
    padding: 0
    outline: 0
    border: dashed 1px #aaa
    border-radius: 4px
    background: transparent

    .progress-bar
      border-radius: 0 0 3px 3px

  .highlighted
    border: dashed 1px #eee
    background: rgba(black, 0.2)
    padding: 0

  .hovered
    background: rgba(black, 0.6)

  .image-selected
    border: none
    border-radius: 5px
</style>