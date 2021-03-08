import { NavigationGuard, NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from "vue-router"
import { isAuthorized } from "src/api/auth"


function redirectIfNotAuthorized(name: string): NavigationGuard {
  return async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const authorized = await isAuthorized()
    if (!authorized) return next({ name })
    return next()
  }
}


function redirectIfAuthorized(name: string): NavigationGuard {
  return async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const authorized = await isAuthorized()
    if (authorized) return next({ name })
    return next()
  }
}


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
        name: "feed-auctions",
        component: () => import("pages/Auctions.vue")
      },
      {
        path: "auction/:id([a-zA-Z0-9-_]{2,30})",
        name: "auction",
        component: () => import("pages/auctions/Auction.vue")
      },
      
      
      {
        path: "user/:username([a-zA-Z0-9-_]{2,30})",
        name: "user",
        component: () => import("pages/User.vue")
      },
      
      {
        path: "me",
        name: "me",
        component: () => import("pages/Me.vue"),
        beforeEnter: redirectIfNotAuthorized("login")
      },
      {
        path: "albums",
        name: "albums",
        component: () => import("pages/me/Albums.vue"),
        beforeEnter: redirectIfNotAuthorized("login")
      },
      {
        path: "auctions",
        name: "auctions",
        component: () => import("pages/me/Auctions.vue"),
        beforeEnter: redirectIfNotAuthorized("login")
      },
      {
        path: "chats",
        name: "chats",
        component: () => import("pages/me/Chats.vue"),
        beforeEnter: redirectIfNotAuthorized("login")
      },
      {
        path: "settings",
        name: "settings",
        component: () => import("pages/me/Settings.vue"),
        beforeEnter: redirectIfNotAuthorized("login")
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    component: () => import("pages/auth/Login.vue"),
    beforeEnter: redirectIfAuthorized("me")
  },
  {
    path: "/register",
    name: "register",
    component: () => import("pages/auth/Register.vue"),
    beforeEnter: redirectIfAuthorized("me")
  },
  {
    path: "/:catchAll(.*)*",
    name: "404",
    component: () => import("pages/errors/404.vue")
  }
]

export default routes
