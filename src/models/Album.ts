declare module "src/models" {
    export type Album = {
        author: User
        preview: Image
        title: string
        description: string
        created: number
        elements: AlbumElement[]
    }
}

