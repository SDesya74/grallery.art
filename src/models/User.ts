declare module "src/models" {
    export type User = {
        username: string
        visible_name?: string
        avatar: string
        email?: string
        confirmed?: boolean
    }
}