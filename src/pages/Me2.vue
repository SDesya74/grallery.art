<template>
  <q-page>
    <template v-if="$q.screen.xs">
      <div class="column justify-evenly items-center q-mt-sm">
        <q-skeleton animation="fade" size="96px" type="circle" v-show="!avatarLoaded"/>
        <q-avatar size="96px" v-show="avatarLoaded">
          <img :src="avatar" @load="avatarLoaded = true" alt="Avatar" width="96px"/>
        </q-avatar>

        <div class="column text-h5 text-center">
          <q-skeleton animation="fade" height="32px" type="text" v-show="!nickname" width="100px"/>
          <div v-if="nickname"> {{ nickname }}</div>
        </div>

        <q-btn-group flat spread stretch>
          <q-btn dense icon="phone" label="albums" stack/>
          <q-btn dense icon="phone" label="auctions" stack/>
          <q-btn dense icon="chat" label="chats" stack/>
        </q-btn-group>

        <q-responsive :ratio="16/9" class="full-width q-my-sm">
          <q-carousel
            animated
            arrows
            infinite
            swipeable
            transition-next="slide-left"
            transition-prev="slide-right"
            v-model="carouselSlide"
          >
            <q-carousel-slide :name="1" img-src="https://cdn.quasar.dev/img/mountains.jpg"/>
            <q-carousel-slide :name="2" img-src="https://cdn.quasar.dev/img/parallax1.jpg"/>
            <q-carousel-slide :name="3" img-src="https://cdn.quasar.dev/img/parallax2.jpg"/>
            <q-carousel-slide :name="4" img-src="https://cdn.quasar.dev/img/quasar.jpg"/>
            <q-carousel-slide :name="5" img-src="https://cdn.quasar.dev/img/cat.jpg"/>
            <q-carousel-slide :name="6" img-src="https://cdn.quasar.dev/img/linux-avatar.png"/>
            <q-carousel-slide :name="7" img-src="https://cdn.quasar.dev/img/material.png"/>
            <q-carousel-slide :name="8" img-src="https://cdn.quasar.dev/img/donuts.png"/>
          </q-carousel>
        </q-responsive>

        <div class="row full-width">
          <q-input
            @click.prevent="() => {showCreatePostDialog = true; blur()}"
            @focus="blur"
            class="fit q-pa-xs"
            dense
            outlined
            placeholder="Write your post!"
            rounded
            tabindex="-1"
          />

          <q-dialog maximized v-model="showCreatePostDialog">
            <q-card>
              <q-card-section>
                <div class="text-h6">Write your post!</div>
              </q-card-section>

              <q-card-section>
                <q-editor
                  :fonts="{
                    arial: 'Arial',
                    arial_black: 'Arial Black',
                    comic_sans: 'Comic Sans MS',
                    courier_new: 'Courier New',
                    impact: 'Impact',
                    lucida_grande: 'Lucida Grande',
                    times_new_roman: 'Times New Roman',
                    verdana: 'Verdana'
                  }"
                  :toolbar="[
                    ['left', 'center', 'right', 'justify'],
                    ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
                    ['hr', 'link'],
                    [
                      {
                        label: $q.lang.editor.fontSize,
                        icon: $q.iconSet.editor.fontSize,
                        fixedLabel: true,
                        fixedIcon: true,
                        list: 'no-icons',
                        options: [ 'size-1','size-2','size-3','size-4','size-5','size-6','size-7' ]
                      },
                      {
                        label: $q.lang.editor.defaultFont,
                        icon: $q.iconSet.editor.font,
                        fixedIcon: true,
                        list: 'no-icons',
                        options: [
                          'default_font','arial','arial_black','comic_sans',
                          'courier_new','impact','lucida_grande','times_new_roman','verdana'
                        ]
                      },
                      'removeFormat'
                    ],
                    [ 'unordered', 'ordered', 'outdent', 'indent' ],
                    [ 'undo', 'redo' ]
                  ]"
                  dense
                  v-model="postContent"
                />
              </q-card-section>

              <q-card-section>
                <q-uploader
                  class="full-width"
                  label="Images"
                  multiple
                  url="https://api.grallery.art/upload"
                >
                  <template v-slot:list="scope">
                    <q-list>
                      <q-list separator>
                        <q-item :key="file.name" v-for="file in scope.queuedFiles">

                          <q-item-section
                            v-if="file.__img"
                          >
                            <q-img :src="file.__img.src"/>
                          </q-item-section>

                          <q-item-section
                            v-else
                          >
                            {{ file.name }}
                          </q-item-section>


                          <q-item-section side top>
                            <q-btn
                              @click="scope.removeFile(file)"
                              dense
                              flat
                              icon="delete"
                              round
                              size="12px"
                            />
                          </q-item-section>
                        </q-item>

                      </q-list>
                    </q-list>
                  </template>

                </q-uploader>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn color="primary" flat label="OK" v-close-popup/>
                <q-btn color="primary" flat label="Cancel" v-close-popup/>
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>

      </div>
    </template>

    <template v-else>
    </template>

  </q-page>
</template>

<script lang="ts">
  import { ref } from "vue"
  import { UserModel } from "src/api/models"
  import { api } from "src/api"

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

      return {
        username,
        nickname,
        avatar,
        avatarLoaded,
        carouselSlide,
        showCreatePostDialog,

        postContent
      }
    }
  }
</script>

