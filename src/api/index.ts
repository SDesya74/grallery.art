import ky from "ky"
import { AccessToken, RefreshToken } from "src/utils/token"
import {
  ApiResponse,
  AvailabilityPayload,
  RegisterRequest,
  SearchUsersResponse,
  SessionModel,
  UserModel
} from "src/api/models"
import { closeSession, openSession } from "src/api/auth"

const client = ky.extend({
  prefixUrl: "https://api.grallery.art",
  throwHttpErrors: false
})

function throwIfNotOk<T>(json: ApiResponse<T>) {
  if (!json.ok) throw new Error(json.payload.toString())
}

async function post<T = any>(endpoint: string, payload: object, auth?: boolean): Promise<ApiResponse<T>> {
  if (!auth) {
    const json = await client.post(endpoint, { json: payload }).json() as ApiResponse<T>
    throwIfNotOk(json)
    return json
  }
  
  if (AccessToken.exists()) {
    let response = await client.post(endpoint, { json: payload, headers: AccessToken.bearer() })
    if (response.status != 401) { // 401 - unauthorized
      const json = await response.json() as ApiResponse<T>
      throwIfNotOk(json)
      return json
    }
  }
  
  const session = await refreshSession()
  openSession(session)
  
  return post(endpoint, payload, auth)
}

async function get<T = any>(endpoint: string, auth?: boolean): Promise<ApiResponse<T>> {
  if (!auth) {
    const json = await client.get(endpoint).json() as ApiResponse<T>
    throwIfNotOk(json)
    return json
  }
  
  if (AccessToken.exists()) {
    const response = await client.get(endpoint, { headers: AccessToken.bearer() })
    if (response.status != 401) { // 401 - unauthorized
      const json = await response.json() as ApiResponse<T>
      throwIfNotOk(json)
      return json
    }
  }
  
  const session = await refreshSession()
  openSession(session)
  
  return get(endpoint, auth)
}

export async function refreshSession(): Promise<SessionModel> {
  const { payload } = await post<SessionModel>("refresh", {
    refresh_token: RefreshToken.get()
  })
  return payload
}

export async function authorize(login: string, password: string): Promise<void> {
  const { ok, payload } = await post<SessionModel>("login", {
    login: login,
    password: password
  })
  
  if (!ok) {
    closeSession()
    throw new Error(payload.message)
  }
  openSession(payload)
}


export async function getUserByUsername(username: string): Promise<UserModel> {
  const { payload } = await get<UserModel>(`user/${ username }`)
  return payload
}


export async function getMe(): Promise<UserModel> {
  const { payload } = await get<UserModel>("me", true)
  return payload
}


export async function isEmailAvailable(email: string): Promise<boolean> {
  const { payload } = await get<AvailabilityPayload>(`available/email?email=${ email }`)
  return payload.available
}


export async function isUsernameAvailable(username: string): Promise<boolean> {
  const { payload } = await get<AvailabilityPayload>(`available/username?username=${ username }`)
  return payload.available
}


export async function register(request: RegisterRequest): Promise<SessionModel> {
  const { payload } = await post<SessionModel>("register", request)
  return payload
}


export async function searchUsers(q: string) {
  const { payload } = await get<SearchUsersResponse>(`search/user?fields[user]=username,avatar&q=${ q }`)
  return payload
}
