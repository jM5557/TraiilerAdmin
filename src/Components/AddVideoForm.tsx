import { useState, SyntheticEvent, useRef, RefObject } from "react";
import youtubeAPI from "../api/youtube";
import { getVideoId, getThumbnail } from "../util/helpers";
import { ReactComponent as SearchIcon } from "./../assets/icons/search-icon.svg";
import { ReactComponent as XIcon } from "./../assets/icons/x-icon.svg";

interface AddVideoFormProps {
    callbackFn: Function
}

const AddVideoForm: React.FC<AddVideoFormProps> = ({ callbackFn, ...props }): JSX.Element => {
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

    const cancelForm = () => {
        setVideoId(null);
        setTitle("");
        setUrl("");
    }

    return (
        <div className="add-video-form">
            <div className="overlay"></div>
            <div className="bg-image"
                style={{
                    background: (id)
                        ? (`url("${getThumbnail(id, 0)}") no-repeat center top 0px`)
                        : '',
                    backgroundSize: "cover"
                }}
            >
            </div>
            <div className="form-body">
                {(id) &&
                    <>
                        <small className="id">{id}</small>
                        <img alt="video thumbnail" src={getThumbnail(id, 0)} />
                    </>
                }
                {(!id) &&
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
                        className="input url"
                    >
                        <label className="flex x-between y-center">
                            <div>
                                <b>URL/Link</b>
                                <input
                                    type="text"
                                    value={url}
                                    onChange={
                                        (e: SyntheticEvent) => setUrl(
                                            (e.target as HTMLInputElement).value
                                        )
                                    }
                                    autoFocus
                                    ref={inputRef}
                                />
                            </div>
                            {(url.length > 0) &&
                                <button
                                    type="button"
                                    className="clear-text-btn"
                                    onClick={
                                        (e: SyntheticEvent) => {
                                            e.preventDefault();
                                            e.stopPropagation();

                                            setUrl("");
                                            setVideoId(null);
                                        }
                                    }
                                >
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
                                <span>
                                    Search
                                </span>
                            </button>
                        </label>
                    </form>

                    <div className="input title">
                        <label className="flex x-between y-center">
                            <div>
                                <b>Title</b>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={
                                        (e: SyntheticEvent) => setTitle(
                                            (e.target as HTMLInputElement).value
                                        )
                                    }
                                />
                            </div>
                            {(title.length > 0) &&
                                <button
                                    type="button"
                                    className="clear-text-btn"
                                    onClick={
                                        (e: SyntheticEvent) => {
                                            e.preventDefault();
                                            e.stopPropagation();

                                            setTitle("");
                                        }
                                    }
                                >
                                    <span className="hidden">
                                        Clear
                                    </span>
                                </button>
                            }
                        </label>
                </div>
                {(id && title.trim().length > 0) &&
                    <div className="buttons">    
                        <button
                            type = "button"
                            onClick={ cancelForm }
                            className = "cancel-btn"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="add-btn"
                            ref={submitRef}
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
                    </div>
                }
            </div>
        </div>
    );
}

export default AddVideoForm;