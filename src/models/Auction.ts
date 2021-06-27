declare module "src/models" {
    export type Auction = {
        id: string
        title: string
        description: string
        
        author: User | null
        preview: Image | null
        lots: AuctionLot[]
        
        created: number
        start: number
        end: number
        
        tags: string[]
    }
}

