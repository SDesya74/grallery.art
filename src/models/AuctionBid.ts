declare module "src/models" {
    export type AuctionBid = {
        user: User | null
        value: number
    }
}
