import { useState, SyntheticEvent, useRef, RefObject } from "react";
import youtubeAPI from "../api/youtube";
import { getVideoId, getThumbnail } from "../util/helpers";
import { ReactComponent as SearchIcon } from "./../assets/icons/search-icon.svg"; 
import { ReactComponent as XIcon } from "./../assets/icons/x-icon.svg"; 

interface FetchVideoFormProps {
    callbackFn: Function
}

const FetchVideoForm: React.FC<FetchVideoFormProps> = ({ callbackFn, ...props }): JSX.Element => {
    const [url, setUrl] = useState<string>("");
    const [id, setVideoId] = useState<string | null>(null);
    const [title, setTitle] = useState<string>("");
    const [sourceTypeId, setSourceTypeId] = useState<number>(0);
    
    const inputRef: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const submitRef: RefObject<HTMLButtonElement> = useRef<HTMLButtonElement>(null);

    const fetchVideo = async (url: string) => {
        let id = getVideoId(url);

        if (!id) throw new Error("Unable to fetch video!");

        await setVideoId(id);
        let results = await youtubeAPI.getVideoById(id);
        setTitle(results.data.items[0].snippet.title);
        
        if (submitRef) submitRef.current?.focus();
    }
    
    return (
        <div className="fetch-video-form">
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
                { (id) &&
                    <>
                        <small className="id">{ id }</small>
                        <img alt = "video thumbnail" src = { getThumbnail(id, 0) } />
                    </>
                }
                { (!id) &&
                    <div className="empty">
                        <header>Add a Video</header>
                    </div>
                }
                <form 
                    onSubmit={
                            (e: SyntheticEvent) => {
                                e.preventDefault();
                                e.stopPropagation();
                                                                
                                fetchVideo(url);
                            }
                    }
                    className="top-input-wrapper flex x-center y-center"
                >
                    <label>
                        <input type="text" 
                            value={url}
                            onChange = {
                                (e: SyntheticEvent) => setUrl(
                                    (e.target as HTMLInputElement).value
                                )
                            }
                            placeholder = "Link or URL"
                            autoFocus
                            ref = { inputRef }
                        />
                    </label>
                    { (url.length > 0) &&
                        <button
                            type="button"
                            className = "clear-text-btn"
                            onClick={
                                (e: SyntheticEvent) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    
                                    setUrl("");
                                }
                            }
                        >
                            <XIcon />
                            <span className="hidden">
                                Clear
                            </span>
                        </button>
                    }
                    <button
                        type="submit"
                        className="search-btn"
                        onClick={
                            () => fetchVideo(url)
                        }
                    >
                        <SearchIcon />
                        <span className="hidden">
                            Search
                        </span>
                    </button>
                </form>

                <div className="mid-input-wrapper">
                    <label className="flex x-between y-center">
                        <div>
                            <b>Title</b>
                            <input
                                type = "text"
                                value = { title }
                                onChange = {
                                    (e: SyntheticEvent) => setTitle(
                                        (e.target as HTMLInputElement).value
                                    )
                                }
                            />
                        </div>
                        { (title.length > 0) &&
                            <button
                                type="button"
                                className = "clear-text-btn"
                                onClick={
                                    (e: SyntheticEvent) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        
                                        setTitle("");
                                    }
                                }
                            >
                                <XIcon />
                                <span className="hidden">
                                    Clear
                                </span>
                            </button>
                        }
                    </label>
                    { (id && title.trim().length > 0) &&
                        <button 
                            type = "button"
                            className="submit-btn"
                            ref = { submitRef }
                            onClick={
                                (e: SyntheticEvent) => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    if (inputRef) inputRef.current?.focus();

                                    callbackFn({
                                        id,
                                        url,
                                        title,
                                        sourceTypeId
                                    });

                                    setUrl("");
                                    setVideoId(null);
                                    setTitle("");
                                }
                            }
                        >
                            Add Video
                        </button>
                    }
                </div>
            </div>
        </div>
    );
}

export default FetchVideoForm;