export interface Video {
    title: string,
    id: number,
    url: string,
    urlId: string,
    sourceTypeId: number,
    Genre: Genre[]
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

export interface Genre {
    id: number,
    text: string
}