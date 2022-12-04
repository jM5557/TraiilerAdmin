import { useState, SyntheticEvent, useRef, RefObject, useEffect } from "react";
import youtubeAPI from "../api/youtube";
import { getVideoId, getThumbnail } from "../util/helpers";
import { Collection } from "../util/types";
import { ReactComponent as SearchIcon } from "./../assets/icons/search-icon.svg";

interface AddPosterFormProps {
    callbackFn: Function,
    initialPosterUrl: string | null,
    collectionType: "movie" | "tv"
}

// Available sizes: w92, 2154, w185, w342, w500, w780, original
const posterUrl = (path: string) => `https://image.tmdb.org/t/p/w342${ path }`

const getPoster = async (
    query: string,
    searchType: string = "movie"
) => {
    let results = await fetch(
        `https://api.themoviedb.org/3/search/${ searchType }?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&query=${query}&page=1&include_adult=false`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
    
    let data = await results.json();
    let posters = data.results.map((r: any) => r.poster_path);

    return posters;
}

const AddPosterForm: React.FC<AddPosterFormProps> = ({ 
    callbackFn,
    initialPosterUrl,
    collectionType, 
    ...props 
}): JSX.Element => {
    const [title, setTitle] = useState<string>("");
    const [url, setUrl] = useState<string>(initialPosterUrl ?? "");
    const [results, setResults] = useState<any[] | null>(null);

    let resultsContainerRef = useRef<HTMLDivElement>(null);

    const inputRef: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

    const clearForm = () => {
        setTitle("");
        setUrl("");
        callbackFn(null);
    }

    useEffect(() => {
        setUrl(initialPosterUrl ?? "");
        setTitle("");
        setResults(null);
    }, [initialPosterUrl]);

    useEffect(() => {
        if (resultsContainerRef && resultsContainerRef.current)
            resultsContainerRef.current.scrollLeft = 0;
    }, [results])

    return (
        <div className="add-video-form">
            <div className="form-body">
                {(url) &&
                    <>
                        <small className="id">{url}</small>
                        <img alt="video thumbnail" src={ posterUrl(url) } />
                    </>
                }
                {(!url) &&
                    <div className="empty">
                        <header>Add a Poster</header>
                    </div>
                }
                    <form
                        onSubmit={
                            (e: SyntheticEvent) => {
                                e.preventDefault();
                                e.stopPropagation();

                                getPoster(url);
                            }
                        }
                        className="input url"
                    >
                        <label className="flex x-between y-center">
                            <div>
                                <b>Search by Title</b>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={
                                        (e: SyntheticEvent) => setTitle(
                                            (e.target as HTMLInputElement).value
                                        )
                                    }
                                    autoFocus
                                    ref={inputRef}
                                />
                            </div>
                            {(title.length > 0) &&
                                <>
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
                                    <button
                                        type="submit"
                                        className="search-btn"
                                        onClick={
                                            async () => { 
                                                let data = await getPoster(title, collectionType);

                                                setResults(data);
                                            }
                                        }
                                    >
                                        <SearchIcon />
                                        <span>
                                            Search
                                        </span>
                                    </button>
                                </>
                            }
                        </label>
                    </form>

                    <div className="input title">
                        <label className="flex x-between y-center">
                            <div>
                                <b>Poster URL</b>
                                <input
                                    type="text"
                                    value={url}
                                    onChange={
                                        (e: SyntheticEvent) => setUrl(
                                            (e.target as HTMLInputElement).value
                                        )
                                    }
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

                <br />
                
                <div className="flex y-center x-start add-poster-form-results">
                    { 
                        results?.map(
                            (r: string, index: number) => (
                                <img 
                                    key = { index }
                                    alt = "movie poster"
                                    src = { posterUrl(r) }
                                    tabIndex={0}
                                    onClick = {
                                        () => { 
                                            setUrl(r);
                                            callbackFn(posterUrl(r))
                                        }
                                    }
                                />
                            )
                        )
                    }
                </div>

                {(url && url.trim().length > 0) &&
                    <div className="buttons">    
                        <button
                            type = "button"
                            onClick={ clearForm }
                            className = "cancel-btn"
                        >
                            Clear
                        </button>
                    </div>
                }
            </div>
        </div>
    );
}

export default AddPosterForm;