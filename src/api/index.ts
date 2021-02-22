import ky from "ky"
import { AccessToken } from "src/utils/token"
import { ApiResponse } from "src/api/models"
import { openSession, refresh } from "src/api/auth"

const client = ky.extend({
  prefixUrl: "https://api.grallery.art",
  throwHttpErrors: false
})

const api = {
  post: async function <T = any>(endpoint: string, payload: object, auth?: boolean): Promise<ApiResponse<T>> {
    if (!auth) return await client.post(endpoint, { json: payload }).json<ApiResponse<T>>()

    if (AccessToken.exists()) {
      let response = await client.post(endpoint, { json: payload, headers: AccessToken.bearer() })
      if (response.status != 401) return await response.json() as ApiResponse<T> // 401 - unauthorized
    }

    const session = await refresh()
    openSession(session)

    return this.post<T>(endpoint, payload, auth)
  },
  get: async function <T = any>(endpoint: string, auth?: boolean): Promise<ApiResponse<T>> {
    if (!auth) return await client.get(endpoint).json<ApiResponse<T>>()

    if (AccessToken.exists()) {
      let response = await client.get(endpoint, { headers: AccessToken.bearer() })
      if (response.status != 401) return await response.json() as ApiResponse<T> // 401 - unauthorized
    }

    const session = await refresh()
    openSession(session)

    return this.get<T>(endpoint, auth)
  }
}


export { api }
