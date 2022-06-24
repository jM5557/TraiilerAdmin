import react, { useState, useEffect, SyntheticEvent } from "react";
import youtubeAPI from "../api/youtube";
import { getVideoId } from "../lib/helpers";
import { getThumbnail } from "./AddVideoForm";
import { ReactComponent as SearchIcon } from "./../assets/icons/search-icon.svg"; 

interface FetchVideoFormProps {
    callbackFn: Function
}

export default ({ callbackFn, ...props }: FetchVideoFormProps): JSX.Element => {
    const [url, setUrl] = useState<string>("");
    const [id, setVideoId] = useState<string | null>(null);
    const [title, setTitle] = useState<string>("");
    const [sourceTypeId, setSourceTypeId] = useState<number>(0);

    const fetchVideo = async (url: string) => {
        let id = getVideoId(url);

        if (!id) throw new Error("Unable to fetch video!");

        setVideoId(id);
        let results = await youtubeAPI.getVideoById(id);

        setTitle(results.data.items[0].snippet.title);
    }
    
    return (
        <div 
            className="fetch-video-form"
        >
            <div className="overlay"></div>
            <div className="bg-image"
                style={{
                    background: (id) 
                        ? (`url("${ getThumbnail(id, 0) }") no-repeat center top 0px`)
                        : '',
                    backgroundSize: "cover"
                }}
            >
            </div>
            <div className="form-body">
                <div className="top-input-wrapper flex x-center y-center">
                    <label>
                        <input type="text" 
                            value={url}
                            onChange = {
                                (e: SyntheticEvent) => setUrl(
                                    (e.target as HTMLInputElement).value
                                )
                            }
                        />
                    </label>
                    <button
                        type="button"
                        onClick={
                            () => fetchVideo(url)
                        }
                    >
                        <SearchIcon className="search-icon" />
                        <span className="hidden">
                            Search
                        </span>
                    </button>
                </div>
                { (id) &&
                    <pre>ID: { id }</pre>
                }

                <div className="mid-input-wrapper">
                    <label>
                        <b>Title</b>
                        <input
                            type = "text"
                            value = { title }
                            onChange = {
                                (e: SyntheticEvent) => setTitle((e.target as HTMLInputElement).value)
                            }
                        />
                    </label>
                    { (id && title.trim().length > 0) &&
                        <button 
                            type = "button"
                            className="submit-btn"
                            onClick={
                                () => {{
                                    callbackFn({
                                        id,
                                        url,
                                        title,
                                        sourceTypeId
                                    });

                                    setUrl("");
                                    setVideoId(null);
                                    setTitle("");
                                }}
                            
                            }
                        >
                            Add
                        </button>
                    }
                </div>
            </div>
        </div>
    );
}