import { SessionModel } from "src/api/models"
import { AccessToken, RefreshToken } from "src/utils/token"
import { refreshSession } from "api"


let authorized: boolean | null = null

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

export async function isAuthorized() {
  if (authorized === null) {
    try {
      const session = await refreshSession()
      openSession(session)
    } catch {
      closeSession()
    }
  }
  
  return authorized && RefreshToken.exists()
}
