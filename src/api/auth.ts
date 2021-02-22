import { SessionModel } from "src/api/models"
import { AccessToken, RefreshToken } from "src/utils/token"
import { api } from "src/api/index"


export async function refresh(): Promise<SessionModel> {
  return new Promise(async (resolve, reject) => {
    if (!RefreshToken.exists()) return reject()

    const { ok, payload } = await api.post<SessionModel>("refresh", {
      refresh_token: RefreshToken.get()
    })

    if (ok) resolve(payload)
    else reject(payload)
  })
}

export async function authorize(login: string, password: string): Promise<boolean> {
  const { ok, payload } = await api.post<SessionModel>("login", {
    login: login,
    password: password
  })

  if (!ok) return false

  openSession(payload)

  return true
}

export function openSession(session: SessionModel): void {
  const { access, refresh } = session

  AccessToken.set(access.token)
  RefreshToken.set(refresh.token)
}

export function closeSession(): void {
  AccessToken.remove()
  RefreshToken.remove()
}

export function isAuthorized() {
  return AccessToken.exists() || RefreshToken.exists()
}
