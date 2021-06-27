declare module "src/models" {
  export type AuctionLot = {
    id?: string
    title: string
    description: string
    preview: Image
  
    opening_price: number
    increment: number
    buyout_price?: number
    current_price?: number | null
    
    bids?: AuctionBid[]
  }
}
