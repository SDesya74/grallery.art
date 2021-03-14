import { FeedElement } from "src/models/FeedElement"
import { AuctionLot } from "src/models/AuctionLot"
import { Author } from "src/models/Author"

export type Auction = {
  author: Author,
  name: string,
  lots: AuctionLot[]
} & FeedElement
