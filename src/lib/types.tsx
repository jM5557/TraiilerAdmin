export interface Video {
    title: string,
    id: string,
    url: string,
    sourceTypeId: 0 | 1
}

export interface Collection {
    title: string,
    id: string,
    videos: Video[],
    categoryId: number
}

export interface Category {
    id: number,
    text: string
}