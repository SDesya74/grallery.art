<template>
  <q-page class="row items-start justify-evenly q-gutter-xs q-pa-sm">



    <div class="column q-gutter-lg items-center">
      <div class="row constraint">
        <div class="column">
          <div :class="{ row: $q.screen.gt.xs, 'q-pa-sm': true, 'justify-evenly': $q.screen.xs }">

            <div class="column q-mr-sm">
              <q-skeleton animation="fade" size="96px" type="circle" v-show="!avatarLoaded"/>
              <q-avatar size="96px" v-show="avatarLoaded">
                <img :src="`${me.avatar}&s=256`" @load="avatarLoaded = true" width="96px"/>
              </q-avatar>
            </div>

            <div class="column q-pa-xs">
              <div :class="{row: $q.screen.gt.xs, 'justify-evenly': true}">
                <div class="column text-h4 text-center">
                  <q-skeleton animation="fade" height="40px" type="text" v-show="!me?.username" width="150px"/>
                  <div v-if="me?.username"> {{ me.username }}</div>
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

      <!-- WYSIWYG Editor -->
      <!--
      <q-card>
        <div class="q-pa-md q-gutter-sm">
          <q-editor
            :dense="$q.screen.lt.md"
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
              [
                {
                  label: $q.lang.editor.align,
                  icon: $q.iconSet.editor.align,
                  fixedLabel: true,
                  list: 'only-icons',
                  options: ['left', 'center', 'right', 'justify']
                }
              ],
              [ 'bold', 'italic', 'strike', 'underline', 'subscript', 'superscript' ],
              [ 'token', 'hr', 'link', 'custom_btn' ],
              [ 'fullscreen' ],
              [
                {
                  label: $q.lang.editor.formatting,
                  icon: $q.iconSet.editor.formatting,
                  list: 'no-icons',
                  options: [
                    'p',
                    'h1',
                    'h2',
                    'h3',
                    'h4',
                    'h5',
                    'h6',
                    'code'
                  ]
                },
                {
                  label: $q.lang.editor.fontSize,
                  icon: $q.iconSet.editor.fontSize,
                  fixedLabel: true,
                  fixedIcon: true,
                  list: 'no-icons',
                  options: [
                    'size-1',
                    'size-2',
                    'size-3',
                    'size-4',
                    'size-5',
                    'size-6',
                    'size-7'
                  ]
                },
                {
                  label: $q.lang.editor.defaultFont,
                  icon: $q.iconSet.editor.font,
                  fixedIcon: true,
                  list: 'no-icons',
                  options: [
                    'default_font',
                    'arial',
                    'arial_black',
                    'comic_sans',
                    'courier_new',
                    'impact',
                    'lucida_grande',
                    'times_new_roman',
                    'verdana'
                  ]
                },
                'removeFormat'
              ],
              [ 'quote', 'unordered', 'ordered', 'outdent', 'indent' ],
              [ 'undo', 'redo' ]
            ]"
            v-model="newPost"
          />
          <q-card bordered flat>
            <q-card-section>
              <pre style="white-space: pre-line">{{ newPost }}</pre>
            </q-card-section>
          </q-card>

          <q-card bordered flat>
            <q-card-section v-html="newPost"/>
          </q-card>
        </div>
      </q-card>
      -->

      <!-- Gallery -->
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

      <!-- Posts -->
      <!--
      <div class="column q-mt-lg constraint">
        <q-infinite-scroll :offset="250" @load="onLoad">
          <q-card :key="index" bordered class="post q-ma-sm q-mb-md" flat v-for="(post, index) in posts">
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img :src="me.avatar">
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ me.username }}</q-item-label>
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
      -->
    </div>
  </q-page>
</template>

<script lang="ts">
  import { reactive, ref } from "vue"
  import { UserModel } from "src/api/models"
  import { api } from "src/api"
  import { date } from "quasar"
  import TextElement from "components/post/TextElement.vue"
  import ImageElement from "components/post/ImageElement.vue"

  export default {
    components: {
      TextElement,
      ImageElement
    },
    setup() {
      const me = reactive<UserModel>({} as UserModel)
      const avatarLoaded = ref(false)

      api.get<UserModel>("me", true)
        .then(({ payload: user }) => {
          me.username = user.username
          me.avatar = user.avatar
        })
        .catch(() => void 0)


      type PostContent = {
        type: "text" | "image",
        data: string
      }

      type Post = {
        created: number, // Date
        content: PostContent[]
      }


      const posts = ref<Post[]>([ {
        created: Date.now(),
        content: [
          {
            type: "text",
            data: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sodales urna quis commodo tempus. Integer ornare sem at eros imperdiet dictum. Nullam ultrices libero at enim blandit laoreet. Vestibulum sit amet turpis eget tellus pretium ultrices. Nulla ut auctor est. Suspendisse potenti. Maecenas lobortis gravida nisi vel feugiat. Cras rutrum molestie vulputate. Ut scelerisque iaculis lectus, posuere varius sapien pretium et. Mauris dapibus odio ipsum, nec euismod elit finibus ac. Morbi dui diam, mattis imperdiet ipsum vel, hendrerit mattis diam. In pharetra feugiat dictum. Morbi a massa tristique, sollicitudin dui a, elementum nisi. Etiam felis sapien, molestie ut venenatis in, eleifend id est."
          }
        ]
      } ])

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
                  data: `https://picsum.photos/${ (Math.random() * 100 + 500) | 0 }/${ (Math.random() * 200 + 500) | 0 }?t=${ i }`
                }
              ]
            })
          }
          done()
        }, 500)
      }


      const newPost = ref()

      return { me, avatarLoaded, posts, onLoad, date, newPost }
    }
  }
</script>
