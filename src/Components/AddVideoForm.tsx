import { SyntheticEvent, useEffect, useState } from 'react';

interface Video {
    url: string,
    id: string | null,
    title: string | null,
    sourceTypeId: 0 | 1
}

export const getThumbnail: Function = (urlId: string, sourceTypeId: number): string => {
    return (sourceTypeId === 0)
        ? `https://img.youtube.com/vi/${urlId}/mqdefault.jpg`
        : `https://vumbnail.com/${urlId}.jpg`
}

const AddVideoForm = (props: { itemId: string }): JSX.Element => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [itemId, setItemId] = useState<string>(props.itemId);
    const [video, setVideo] = useState<Video>({
        url: "",
        id: null,
        title: "",
        sourceTypeId: 0
    });

    const vimeoRegExp: RegExp = /https?:\/\/(?:www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
    const youtubeRegExp: RegExp = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    const getVideoId = (url: string): string | null => {
        let match: RegExpMatchArray | null = url.match(video.sourceTypeId === 0 ? youtubeRegExp : vimeoRegExp);

        if (match && match[1])
            return match[1];
        else
            return null;
    };

    useEffect(() => {
        setItemId(props.itemId);

        return () => {}
    }, [props.itemId])

    return (
        <div className="App">
            <div className="inner-form">
                <label>
                    <b>Item ID</b>
                    <input
                        type="text"
                        name="title"
                        value={itemId}
                        onChange={(e: SyntheticEvent) => setItemId((e.target as HTMLInputElement).value)}
                    />
                </label>
                <div className="container">
                    <div className='inner-content'>
                        {(video.id) &&
                            (
                                <img alt="video thumbnail" src={getThumbnail(video.id, video.sourceTypeId)} />
                            )
                        }
                    </div>
                    <div className="inner-video">
                        <label>
                            <b>Video URL</b>
                            <input
                                type="text"
                                name="url"
                                value={video.url}
                                onChange={
                                    (e: SyntheticEvent) => {
                                        let url: string = (e.target as HTMLInputElement).value;
                                        const match_yt: RegExpMatchArray | null = url.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)/);
                                        const match_vimeo: RegExpMatchArray | null = url.match(/^(http(s)?:\/\/)?((w){3}.)?vimeo?(\.com)/);

                                        let sourceTypeId: 0 | 1 = video.sourceTypeId;

                                        if (match_yt) sourceTypeId = 0;
                                        else if (match_vimeo) sourceTypeId = 1;
                                        else sourceTypeId = 0;

                                        setVideo({ ...video, url, id: getVideoId(url), sourceTypeId });
                                    }
                                }
                            />
                        </label>
                        <label>
                            <b>Video Title</b>
                            <input
                                type="text"
                                name="title"
                                value={video.title as string}
                                onChange={
                                    (e: SyntheticEvent) => {
                                        let title: string = (e.target as HTMLInputElement).value

                                        setVideo({ ...video, title });
                                    }
                                }
                            />
                        </label>
                        {(video.id) &&
                            <p>Video ID: {video.id}</p>
                        }
                    </div>
                </div>

                <div className="radio-labels">
                    <button
                        type = "button"
                        className={`radio-label ${video.sourceTypeId === Number(0) ? "selected" : ""}`}
                        onClick={() => setVideo({ ...video, sourceTypeId: 0 })}
                    >
                        <span>YouTube</span>
                    </button>
                    <button
                        type = "button"
                        className={`radio-label ${video.sourceTypeId === Number(1) ? "selected" : ""}`}
                        onClick={() => setVideo({ ...video, sourceTypeId: 1 })}
                    >
                        <span>Vimeo</span>
                    </button>
                </div>
                    {(itemId
                        && (video.title && video.id && video.title)
                    ) &&
                        <button
                            type="button"
                            className={`submit ${(isSubmitting) ? 'submitting' : ''}`}
                            disabled={(isSubmitting)}
                            onClick={
                                async (e: SyntheticEvent) => {
                                    e.preventDefault();
                                    setIsSubmitting(true);

                                    try {
                                        let results = await fetch("https://traiiler.herokuapp.com/add/video", {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json"
                                            },
                                            body: JSON.stringify({
                                                itemId,
                                                video: {
                                                    urlId: video.id,
                                                    title: video.title,
                                                    url: video.url,
                                                    sourceTypeId: video.sourceTypeId
                                                }
                                            })
                                        });

                                        let r = await results.json();
                                        setIsSubmitting(false);
                                        setVideo({
                                            title: "",
                                            url: "",
                                            id: "",
                                            sourceTypeId: 0
                                        })
                                        console.log(r);
                                    }
                                    catch (err) {
                                        console.log(err);
                                        setIsSubmitting(false);
                                    }
                                }
                            }
                        >
                            Submit
                        </button>
                    }
            </div>
        </div>
    );
}

export default AddVideoForm;