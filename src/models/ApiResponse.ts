declare module "src/models" {
    export type ApiResponse<TPayload> = {
        ok: boolean
        payload: TPayload
        meta?: ApiResponseMeta
    };
}

