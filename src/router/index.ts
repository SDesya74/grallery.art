import { route } from "quasar/wrappers"
import { createMemoryHistory, createRouter, createWebHashHistory, createWebHistory, Router } from "vue-router"
import routes from "./routes"

let router: Router
export default route(function (/* { store, ssrContext } */) {
  const createHistory =
    process.env.MODE === "ssr"
      ? createMemoryHistory
      : process.env.VUE_ROUTER_MODE === "history"
      ? createWebHistory
      : createWebHashHistory
  
  router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.MODE === "ssr" ? void 0 : process.env.VUE_ROUTER_BASE)
  })
  
  return router
})

export async function routeTo(name: string, params: { [key: string]: any } = {}) {
  const { currentRoute } = router
  await router.isReady()
  await router.push({
    name,
    params: {
      ...params,
      ...currentRoute.value.params
    }
  })
}

export { router }
