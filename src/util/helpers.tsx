const vimeoRegExp: RegExp = /https?:\/\/(?:www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
const youtubeRegExp: RegExp = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

export const getVideoId = (
    url: string, 
    sourceTypeId: number = 0
): string | null => {
    let match: RegExpMatchArray | null = url.match(
        sourceTypeId === 0 
            ? youtubeRegExp 
            : vimeoRegExp
    );

    if (match && match[1])
        return match[1];
    else
        return null;
}

export const getThumbnail: Function = (
    urlId: string, 
    sourceTypeId: number
): string => {
    return (sourceTypeId === 0)
        ? `https://img.youtube.com/vi/${urlId}/mqdefault.jpg`
        : `https://vumbnail.com/${urlId}.jpg`
}