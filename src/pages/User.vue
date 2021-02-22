<template>
  <q-page class="row items-start justify-evenly q-gutter-xs q-pa-sm">
    <div class="column q-gutter-lg items-center">
      <div class="row constraint">
        <div class="column">
          <div :class="{row: true, 'q-pa-sm':true,  'justify-evenly': $q.screen.xs}">

            <div class="column q-mr-sm">
              <q-skeleton animation="fade" size="96px" type="circle" v-show="!avatarLoaded"/>
              <q-avatar size="96px" v-show="avatarLoaded">
                <img :src="`${user.avatar}&s=256`" @load="avatarLoaded = true" width="96px"/>
              </q-avatar>
            </div>

            <div class="column q-pa-xs">
              <div :class="{row: $q.screen.gt.xs, 'justify-evenly': true}">
                <div class="column text-h4 text-center">
                  <q-skeleton animation="fade" height="40px" type="text" v-show="!user?.username" width="150px"/>
                  <div v-if="user?.username"> {{ user.username }}</div>
                </div>
                <q-space/>
                <div class="column q-my-sm">
                  <div class="row justify-evenly">
                    <q-btn @click="followUser" color="primary"> Follow</q-btn>
                  </div>
                </div>
              </div>
              <div>
                <q-btn-group class="primary row " outline>
                  <q-btn :class="{ 'small-font': $q.screen.xs}" outline> {{ $t("me_button_commissions_label") }}</q-btn>
                  <q-btn :class="{ 'small-font': $q.screen.xs}" outline> {{ $t("me_button_albums_label") }}</q-btn>
                  <q-btn :class="{ 'small-font': $q.screen.xs}" outline> {{ $t("me_button_chat_label") }}</q-btn>
                  <q-btn :class="{ 'small-font': $q.screen.xs}" outline> {{ $t("me_button_auctions_label") }}</q-btn>
                </q-btn-group>
              </div>
            </div>
          </div>
        </div>

        <div class="column q-pa-sm gt-xs">
          <q-list class="q-gutter-xs">
            <q-btn color="red-6" flat icon="eva-google" round size="md"/>
            <q-btn color="light-blue-8" flat icon="eva-facebook" round size="md"/>
            <q-btn color="light-blue-13" flat icon="eva-twitter" round size="md"/>
          </q-list>
        </div>
      </div>

      <!--
      <q-card
        bordered
        class="column constraint"
        flat
      >
        <q-card-section>
          text
        </q-card-section>
      </q-card>
      -->

      <div class="column q-mt-lg constraint">
        <q-infinite-scroll :offset="250" @load="onLoad">
          <q-card :key="index" bordered class="post q-ma-sm q-mb-md" flat v-for="(post, index) in posts">
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img :src="user.avatar">
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ user.username }}</q-item-label>
                <q-item-label caption> {{ date.formatDate(Date.now(), "DD MMMM YYYY") }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator/>
            <component
              :data="item.data"
              :key="index"
              v-bind:is="`${item.type}-element`"
              v-for="(item, index) in post.content"
            />
          </q-card>
          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px"/>
            </div>
          </template>
        </q-infinite-scroll>
      </div>
    </div>


    <q-page-scroller :offset="[0, 0]" :scroll-offset="150" class="xs" expand position="top">
      <div class="col cursor-pointer q-pa-sm bg-accent text-white text-center">
        Scroll back up...
      </div>
    </q-page-scroller>
  </q-page>
</template>

<script lang="ts">
  import { reactive, ref } from "vue"
  import { UserModel } from "src/api/models"
  import { api } from "src/api"
  import { router } from "src/router"
  import TextElement from "components/post/TextElement.vue"
  import ImageElement from "components/post/ImageElement.vue"
  import { date, uid } from "quasar"

  export default {
    components: {
      TextElement,
      ImageElement
    },
    setup() {
      const user = reactive<UserModel>({} as UserModel)
      const avatarLoaded = ref(false)
      const { currentRoute } = router

      const name = currentRoute.value.params.username

      api.get<UserModel>(`user/${ name }`)
        .then(({ payload: loadedUser }) => {
          user.username = loadedUser.username
          user.avatar = loadedUser.avatar
        })

      type PostContent = {
        type: "text" | "image",
        data: string
      }

      type Post = {
        created: number, // Date
        content: PostContent[]
      }

      const posts = ref<Post[]>([])

      function onLoad(index: number, done: () => void) {
        setTimeout(async () => {
          const symbols = "abcdefghijklmnopqrstuvwxyz    "
          for (let i = 0; i < 5; i++) {
            const text = new Array((Math.random() * 128 + 64) | 0)
              .join()
              .replace(/(.|$)/g, () => symbols[(Math.random() * symbols.length) | 0])
            posts.value.push({
              created: Date.now(),
              content: [
                {
                  type: "text",
                  data: text
                }, {
                  type: "image",
                  data: `https://picsum.photos/${ (Math.random() * 100 + 500) | 0 }/${ (Math.random() * 200 + 500) | 0 }?random=${ i }`
                }
              ]
            })
          }
          done()
        }, 500)
      }


      async function followUser() {
        const id = uid()
        console.log(id)
      }

      return { user, avatarLoaded, posts, onLoad, date, followUser }
    }
  }
</script>
