<template lang="pug">
q-page.column.items-center.justify-evenly
  .text-h4.text-center.text-grey.q-my-sm Тут будут альбомчики ооаоаа) ммм))
  .flex.row.q-gutter-md
    q-img.column(
      v-for="(image, index) in images"
      :name="index"
      :src="image"
      height="200px"
      width="200px"
    )
</template>

<script lang="ts">
    const images = [
        "https://cdn.quasar.dev/img/mountains.jpg",
        "https://cdn.quasar.dev/img/parallax1.jpg",
        "https://cdn.quasar.dev/img/parallax2.jpg",
        "https://cdn.quasar.dev/img/quasar.jpg",
        "https://cdn.quasar.dev/img/cat.jpg",
        "https://cdn.quasar.dev/img/linux-avatar.png",
        "https://cdn.quasar.dev/img/material.png",
        "https://cdn.quasar.dev/img/donuts.png"
    ]
    
    const albums = [
        {
            title: "Album 1",
            thumbnail: "https://cdn.quasar.dev/img/material.png",
            id: "AxBcDfEsBfS"
        },
        {
            title: "Album 2",
            thumbnail: "https://cdn.quasar.dev/img/parallax2.jpg",
            id: "ABCDEFGHIJK"
        }
    ]
    
    export default {
        setup() {
            return {
                images,
                albums
            }
        }
    }
</script>
