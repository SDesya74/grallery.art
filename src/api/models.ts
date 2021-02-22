type ApiResponseMeta = {
  links?: { [key: string]: string }
}

type ApiResponse<TPayload> = {
  ok: boolean,
  payload: TPayload & { [key: string]: any },
  meta?: ApiResponseMeta
}

type UserModel = {
  username: string,
  nickname: string,
  avatar: string,
  email: string,
}

type Token = {
  token: string,
  expires: number
}

type SessionModel = {
  refresh: Token,
  access: Token
}

type AvailabilityPayload = {
  available: boolean
}

export { ApiResponse, UserModel, SessionModel, AvailabilityPayload }
