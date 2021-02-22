import { RouteRecordRaw } from "vue-router"
import { AccessToken } from "src/utils/token"
import { isAuthorized } from "src/api/auth"

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "index",
        component: () => import("pages/Index.vue")
      },
      {
        path: "feed",
        name: "feed",
        component: () => import("pages/Feed.vue")
      },
      {
        path: "auctions",
        name: "auctions",
        component: () => import("pages/Auctions.vue")
      },
      {
        path: "user/:username([a-zA-Z0-9-_]{2,30})",
        name: "user",
        component: () => import("pages/User.vue")
      },

      {
        path: "me",
        name: "me",
        component: () => import("pages/Me2.vue"),
        beforeEnter: (to, from, next) => {
          if (!isAuthorized()) return next({ name: "login" })
          return next()
        },
        children: [
          {

            path: "chats",
            name: "chats",
            component: () => import("pages/me/Chats.vue")
          }
        ]
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    component: () => import("pages/auth/Login.vue"),
    beforeEnter: (to, from, next) => {
      if (isAuthorized()) return next({ name: "me" })
      return next()
    }
  },
  {
    path: "/register",
    name: "register",
    component: () => import("pages/auth/Register.vue")
  },
  {
    path: "/:catchAll(.*)*",
    name: "404",
    component: () => import("pages/errors/404.vue")
  }
]

export default routes
