declare module "src/models" {
    export type Session = {
        refresh: Token
        access: Token
        server_time: number
    }
}

