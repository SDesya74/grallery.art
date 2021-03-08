<template lang="pug">
q-page
  template(v-if="$q.screen.xs")
    .column.justify-evenly.items-center.q-mt-md
      q-skeleton(animation="fade" size="96px" type="circle" v-show="!avatarLoaded")
      q-avatar(size="96px" v-show="avatarLoaded")
        img(:src="avatar" @load="avatarLoaded = true" alt="Avatar" width="96px")
      
      .column.text-h5.text-center
        q-skeleton(animation="fade" height="32px" type="text" v-show="!nickname" width="100px")
        div(v-if="nickname") {{ nickname }}
      
      q-btn-group(flat spread stretch)
        q-btn(:to="{ name: 'albums' }" dense icon="eva-phone-outline" stack) Albums
        q-btn(:to="{ name: 'auctions' }" dense icon="eva-cube-outline" stack) Auctions
        q-btn(:to="{ name: 'chats' }" dense icon="eva-message-circle-outline" stack) Chats
        q-btn(:to="{ name: 'settings' }" dense icon="eva-settings2-outline" stack) Settings
      
      q-responsive.q-my-sm.full-width(:ratio="16/9")
        q-carousel.full-width(animated arrows swipeable transition-next="slide-left" transition-prev="slide-right" v-model="carouselSlide")
          q-carousel-slide(v-for="(image, index) in images" :img-src="image" :name="index")
      
      .row.full-width
        q-input.fit.q-pa-xs(
          @click.prevent="showCreatePostDialog = true"
          dense
          outlined
          placeholder="Write your post!"
          rounded
          tabindex="-1"
        )
        q-dialog(maximized v-model="showCreatePostDialog")
          q-card
            q-card-section
              .text-h6 Write your post!
            
            q-card-section
              | QEditor
            
            q-card-section
              q-uploader.full-width(label="Images" multiple url="https://api.grallery.art/upload")
            
            q-card-section(align="right")
              q-btn(color="primary" flat v-close-popup) Ok
              q-btn(color="primary" flat v-close-popup) Cancel
  
  template(v-else)
    .row.items-center.justify-evenly
      .constraint.q-pa-sm
        .row
          .column
            .row
              .column
                q-skeleton(animation="fade" size="96px" type="circle" v-show="!avatarLoaded")
                q-avatar(size="96px" v-show="avatarLoaded")
                  img(:src="avatar" @load="avatarLoaded = true" alt="Avatar" width="96px")
              
              .column.justify-evenly.q-ml-md
                .row.text-h5.text-center
                  .column
                    q-skeleton(animation="fade" height="32px" type="text" v-show="!nickname" width="100px")
                    div(v-if="nickname") {{ nickname }}
                  
                  q-space
                  
                  .column
                    q-btn(outline) Follow
                
                q-btn-group.row(outline)
                  q-btn(outline :class="{ 'small-font': $q.screen.xs }") {{ $t("me_button_commissions_label") }}
                  q-btn(outline :class="{ 'small-font': $q.screen.xs }") {{ $t("me_button_albums_label") }}
                  q-btn(outline :class="{ 'small-font': $q.screen.xs }") {{ $t("me_button_chat_label") }}
                  q-btn(outline :class="{ 'small-font': $q.screen.xs }") {{ $t("me_button_auctions_label") }}
          
          q-space
          
          .column.justify-evenly.items-center
            .row Social
            .row
              q-avatar(size="xl" v-for="network in social")
                q-icon(:color="network.color" :name="network.icon")
          
          q-space
        q-card.col-8.q-pa-sm.q-ma-xs(bordered flat)
          | Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tempus lectus vestibulum mollis
          | hendrerit. Morbi ac lacus non risus ullamcorper tincidunt. In hac habitasse platea dictumst. Pellentesque
          | sit amet nisl non justo gravida scelerisque vel ac lectus. Quisque pellentesque ullamcorper diam non
          | mattis. Ut feugiat tellus id porttitor imperdiet. Maecenas in risus lectus. Sed non ex orci.
          | Etiam velit erat, placerat quis consequat ac, posuere et augue. Suspendisse potenti. Donec tincidunt
          | tellus in porta dignissim. Etiam volutpat neque vitae nunc pulvinar pharetra in venenatis augue. Quisque
          | finibus faucibus arcu, in vestibulum ex consectetur id. Fusce tincidunt ac nisi vitae volutpat. In sed
          | blandit urna, vitae vulputate lorem. Morbi tellus diam, ultrices quis dignissim id, interdum id sapien.
          | Duis maximus semper nulla quis consequat. In at augue non nisi consectetur hendrerit. Sed sed dolor
          | pretium, blandit tortor eu, pretium lacus. Nulla interdum libero pharetra bibendum volutpat. Suspendisse
          | eu varius sapie
        q-card.col-3.q-pa-sm.q-ma-xs(bordered flat)
          .row Followers: { value }
          .row Follows: { value }

</template>

<script lang="ts">
  import { ref } from "vue"
  import { UserModel } from "src/api/models"
  import { api } from "src/api"
  
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
  
  const social = [
    {
      name: "Google",
      icon: "eva-google",
      color: "red-6"
    },
    {
      name: "Facebook",
      icon: "eva-facebook",
      color: "light-blue-8"
    },
    {
      name: "Twitter",
      icon: "eva-twitter",
      color: "light-blue-13"
    }
  ]
  
  
  export default {
    setup() {
      const username = ref()
      const nickname = ref()
      const avatar = ref()
      const avatarLoaded = ref(false)
      
      api.get<UserModel>("me", true)
        .then(({ payload: user }) => {
          username.value = user.username
          nickname.value = user.nickname
          avatar.value = user.avatar
        })
        .catch(() => void 0)
      
      const carouselSlide = ref(1)
      const showCreatePostDialog = ref(false)
      
      const postContent = ref("")
      
      const isCarouselFullscreen = ref(false)
      
      return {
        username,
        nickname,
        avatar,
        avatarLoaded,
        carouselSlide,
        showCreatePostDialog,
        
        postContent,
        isCarouselFullscreen,
        
        images,
        social
      }
    }
  }
</script>

