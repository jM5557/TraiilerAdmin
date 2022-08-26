export interface Video {
    title: string,
    id: string,
    url: string,
    sourceTypeId: number
}

export interface Collection {
    title: string,
    id: string,
    videos: Video[],
    slug: string,
    categoryId: number
}

export interface Category {
    id: number,
    text: string
}