export interface Video {
    title: string,
    id: number,
    url: string,
    urlId: string,
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