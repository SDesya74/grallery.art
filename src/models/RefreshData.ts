declare module "src/models" {
    export type RefreshData = {
        access: Token
        refresh: Token
        lastRefreshTime: number
        lastServerTime: number
    }
}