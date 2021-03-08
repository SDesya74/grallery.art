<template lang="pug">
q-page.row.justify-evenly.items-center
  .q-list(bordered padding style="min-width: 400px")
    q-item-label(header) Account
    q-item(@click="logout" clickable v-ripple)
      q-item-section
        q-item-label Logout
</template>

<script lang="ts">
    import { closeSession } from "src/api/auth"
    import { router } from "src/router"
    
    export default {
        setup() {
            async function logout() {
                closeSession()
                
                await router.isReady()
                await router.go(0)
                await router.push({ name: "index" })
            }
            
            return { logout }
        }
    }
</script>
