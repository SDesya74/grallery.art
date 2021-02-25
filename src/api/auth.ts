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

  if (!ok) {
    authorized = false
    return false
  }

  openSession(payload)
  return true
}

export function openSession(session: SessionModel): void {
  const { access, refresh } = session

  AccessToken.set(access.token)
  RefreshToken.set(refresh.token)
  authorized = true
}

export function closeSession(): void {
  AccessToken.remove()
  RefreshToken.remove()
  authorized = false
}


let authorized: boolean | null = null

export async function isAuthorized() {
  if (authorized === null) {
    try {
      const session = await refresh()
      openSession(session)
    } catch {
      closeSession()
    }
  }

  return authorized && RefreshToken.exists()
}
