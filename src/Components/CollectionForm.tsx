import React, { SyntheticEvent, useState, useContext } from "react";
import { Categories } from "../util/common";
import { Category, Video } from "../util/types";
import { getThumbnail } from "../util/helpers";
import AddVideoForm from "./AddVideoForm";
import { ReactComponent as GamesIcon } from "./../assets/icons/games-icon.svg";
import { ReactComponent as MoviesIcon } from "./../assets/icons/movies-icon.svg";
import { ReactComponent as TVShowsIcon } from "./../assets/icons/tv-shows-icon.svg";
import { ReactComponent as XIcon } from "./../assets/icons/x-icon.svg";
import { ReactComponent as SortDownIcon } from "./../assets/icons/sort-down-icon.svg";
import { VideoOrganizer } from "./VideoOrganizer";
import { Action, CollectionFormContext } from "../util/context/CollectionForm";
import { useCookies } from "react-cookie";
import slugify from "slugify";
import axios from "axios";
import AddPosterForm from "./AddPosterForm";

interface FormProps {
    submitType: string
}

const CategoryIcons: JSX.Element[] = [<GamesIcon />, <MoviesIcon />, <TVShowsIcon />];

export const loadCollection: Function = async (
    id: number,
    dispatch: React.Dispatch<Action>,
    key: string
) => {
    try {
        let results = await axios.get(
            `${process.env.REACT_APP_BASEURL}/edit/collection/${id}?key=${key}`
        );

        let data = await results.data;

        dispatch({
            type: 'SET_COLLECTION_ID',
            payload: id
        });
        dispatch({
            type: 'SET_TITLE',
            payload: data.title
        });
        dispatch({
            type: 'SET_SLUG',
            payload: data.slug
        });
        dispatch({
            type: 'SET_CATEGORY_ID',
            payload: data.categoryId
        });
        dispatch({
            type: 'SET_POSTER_URL',
            payload: data.posterUrl
        });
        dispatch({
            type: 'SET_VIDEOS',
            payload: data.videos
        });
        dispatch({
            type: 'SET_REMOVED_VIDEOS',
            payload: []
        });
    }
    catch (error) {
        console.log((error as Error).message);
    }
}

const CollectionForm = (props: FormProps): JSX.Element => {
    const [cookies] = useCookies(['key']);
    const { state, dispatch } = useContext(CollectionFormContext);
    const {
        collectionId,
        title,
        slug,
        categoryId,
        posterUrl,
        videos,
        submitted,
        removedVideos
    } = state;

    const [displayOrganizer, setDisplayOrganizer] = useState<boolean>(false);

    const VideoBox: JSX.Element = (
        <AddVideoForm
            callbackFn={(v: Video) => {
                addVideo(v);
            }}
        />
    );

    const PosterBox: JSX.Element = (
        <AddPosterForm
            callbackFn={(url: string | null) => {
                dispatch({
                    type: 'SET_POSTER_URL',
                    payload: url
                })
            }}
            initialPosterUrl={posterUrl}
            collectionType = {
                categoryId === 2 
                    ? "tv" 
                    : "movie"
            }
        />
    );

    const addVideo: Function = (v: Video) => {
        if (title.trim().length === 0)
            dispatch({
                type: 'SET_TITLE',
                // REGEXP to simplify title (ex. Foo Bar | Official Trailer ---> Foo Bar)
                payload: v.title
                    .replace(/(official teaser trailer|teaser trailer|final trailer|trailer|official|announcement trailer|launch trailer|world premiere)/ig, "")
                    .replace(/\|/g, '')
                    .replace(/\s\s+/g, ' ')
            });

        if (slug.trim().length === 0)
            dispatch({
                type: 'SET_SLUG',
                payload: slugify(
                    v.title
                        .replace(/(\||:|'|,|\.)/g, "")
                        .replace(/(official teaser trailer|teaser trailer|final trailer|trailer|official|announcement trailer|launch trailer|world premiere)/ig, "")
                        .replace(/\+/g, "plus"),
                    {
                        lower: true,
                        trim: true
                    }
                )
            });

        dispatch({
            type: 'SET_VIDEOS',
            payload: [
                ...videos,
                v
            ]
        })
    }

    const deleteVideo: Function = (id: string) => {
        if (props.submitType === "EDIT")
            dispatch({
                type: 'SET_REMOVED_VIDEOS',
                payload: [
                    ...removedVideos,
                    id
                ]
            });

        dispatch({
            type: 'SET_VIDEOS',
            payload: (
                videos.filter(
                    (v: Video) => v.id !== id
                )
            )
        });
    }

    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);
    const deleteCollection: Function = async (id: string) => {
        setDeleting(true);
        try {
            let results = await fetch(
                `${process.env.REACT_APP_BASEURL}/delete/collection/${id}?key=${cookies['key']}`, 
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!results.ok) throw new Error("Unable to delete");

            setDeleting(false);
            dispatch({
                type: 'RESET_STATE',
                payload: null
            });
        }
        catch (error) {
            console.log((error as Error).message);
            setDeleting(false);
        }
    }
    if (props.submitType === "EDIT" && !collectionId) {
        return (
            <div className="empty">
                <header>Edit a Collection</header>
                <p>Use the search bar to find a collection to edit!</p>
            </div>
        )
    }
    return (
        <div>
            {(collectionId) &&
                <div className="top-bar flex y-center x-between">
                    <small className="id">
                        {collectionId}
                    </small>
                    {(!submitted) &&
                            <>
                                {(showConfirmation && !deleting) &&
                                    <div className="confirmation-buttons flex x-center y-center">
                                        <button
                                            type="button"
                                            className={`submit-btn cancel ${(deleting) ? 'disabled' : ''}`}
                                            onClick={
                                                () => {
                                                    if (!deleting) {
                                                        setShowConfirmation(false);
                                                    }
                                                }
                                            }
                                            disabled={deleting}
                                        >
                                            No
                                        </button>
                                        <button
                                            type="button"
                                            className={`submit-btn cancel ${(deleting) ? 'disabled' : ''}`}
                                            onClick={
                                                async () => {
                                                    if (!deleting) {
                                                        await deleteCollection(state.collectionId);
                                                        setShowConfirmation(false);
                                                    }
                                                }
                                            }
                                            disabled={deleting}
                                        >
                                            Yes
                                        </button>
                                    </div>
                                }
                                {(!showConfirmation || deleting) &&
                                    <button
                                        type="button"
                                        className={`submit-btn cancel ${(deleting) ? 'disabled' : ''}`}
                                        onClick={
                                            () => {
                                                if (!deleting)
                                                    setShowConfirmation(true);
                                            }
                                        }
                                        disabled={deleting}
                                    >
                                        {(deleting) ? "Deleting" : "Delete"}
                                    </button>
                                }
                            </>
                        }
                </div>
            }
            <div className="flex x-start y-start content-wrapper">
                <div className="inner-form-wrapper">
                    <div className="inner-form">
                        <div className="input-wrapper flex x-start y-end">
                            <label className="label">
                                <b>Title</b>
                                <input type="text"
                                    value={title}
                                    onChange={
                                        (e: SyntheticEvent) => dispatch({
                                            type: 'SET_TITLE',
                                            payload: (e.target as HTMLInputElement).value
                                        })
                                    }
                                />
                            </label>
                        </div>
                    </div>
                    <br/>
                    <div className="inner-form">
                        <div className="input-wrapper flex x-start y-end">
                            <label className={`label ${props.submitType === "EDIT" ? "disabled" : ""}`}>
                                <b>Slug</b>
                                <input type="text"
                                    value={slug}
                                    onChange={
                                        (e: SyntheticEvent) => dispatch({
                                            type: 'SET_SLUG',
                                            payload: (e.target as HTMLInputElement).value
                                        })
                                    }
                                    disabled={props.submitType === "EDIT"}
                                />
                            </label>
                        </div>
                    </div>
                    <br />
                    <div className="categories flex x-between">
                        {Categories.map(
                            (c: Category, index: number) => (
                                <button
                                    type="button"
                                    className={`${index === state.categoryId ? "selected" : ""}`}
                                    onClick={
                                        () => {
                                            dispatch({
                                                type: 'SET_CATEGORY_ID',
                                                payload: index
                                            });
                                        }
                                    }
                                >
                                    {CategoryIcons[index]}
                                    <span>{c.text}</span>
                                </button>
                            )
                        )}
                    </div>

                    <br />

                    { VideoBox }
                    
                    { (categoryId > 0) &&
                        <>
                            <br />
        
                            { PosterBox }
                        </>
                    }

                    <div className="submit-btns">
                        {(title.trim().length > 0 
                            && slug.trim().length > 0 
                            && !deleting
                        ) &&
                            <button
                                type="button"
                                className={`submit-btn ${(submitted) ? "disabled" : ""}`}
                                onClick={
                                    async (e: SyntheticEvent) => {
                                        e.preventDefault();
                                        if (submitted) return;

                                        dispatch({
                                            type: 'SET_SUBMITTED',
                                            payload: true
                                        });

                                        try {
                                            if (props.submitType === "CREATE") {
                                                await fetch(
                                                    `${process.env.REACT_APP_BASEURL}/add/collection?key=${cookies['key']}`,
                                                    {
                                                        method: "POST",
                                                        headers: {
                                                            "Content-Type": "application/json"
                                                        },
                                                        body: JSON.stringify({
                                                            item: {
                                                                title: title.trim(),
                                                                categoryId: categoryId,
                                                                slug: slug.trim(),
                                                                posterUrl
                                                            },
                                                            videos: (
                                                                videos.map(
                                                                    (v: Video) => ({
                                                                        urlId: v.id,
                                                                        title: v.title,
                                                                        url: v.url,
                                                                        sourceTypeId: v.sourceTypeId
                                                                    })
                                                                )
                                                            )
                                                        })
                                                    }
                                                );
                                                dispatch({
                                                    type: 'RESET_STATE',
                                                    payload: null
                                                });
                                            }
                                            else {
                                                await fetch(
                                                    `${process.env.REACT_APP_BASEURL}/edit/collection?key=${cookies['key']}`,
                                                    {
                                                        method: "POST",
                                                        headers: {
                                                            "Content-Type": "application/json"
                                                        },
                                                        body: JSON.stringify({
                                                            item: {
                                                                id: collectionId,
                                                                title: title.trim(),
                                                                categoryId: categoryId,
                                                                slug: slug.trim(),
                                                                posterUrl
                                                            },
                                                            videos: (
                                                                videos.map(
                                                                    (v: Video) => ({
                                                                        urlId: v.id,
                                                                        title: v.title,
                                                                        url: v.url,
                                                                        sourceTypeId: v.sourceTypeId
                                                                    })
                                                                )
                                                            ),
                                                            disconnectedVideos: removedVideos
                                                        })
                                                    }
                                                );
                                            }

                                            dispatch({
                                                type: 'SET_SUBMITTED',
                                                payload: false
                                            });
                                        }
                                        catch (error) {
                                            dispatch({
                                                type: 'SET_SUBMITTED',
                                                payload: false
                                            })
                                            console.log((error as Error).message);
                                        }
                                    }
                                }
                                disabled={submitted}
                            >
                                Submit
                            </button>
                        }
                    </div>
                </div>
                <section className="videos-section">
                    {(videos.length > 1) &&
                        <div className="top flex x-end y-center">
                            <div className="flex y-center x-between">
                                    <button
                                        type="button"
                                        className="toolbar-btn"
                                        onClick={
                                            () => setDisplayOrganizer(true)
                                        }
                                    >
                                        <SortDownIcon />
                                        <span>
                                            Organize
                                        </span>
                                    </button>
                            </div>
                        </div>
                    }
                    
                    <div className="list">
                        {
                            videos.map(
                                (v: Video, index: number) => (
                                    <div className="list-item" key={index}>
                                        <img alt={v.title} src={`${getThumbnail(v.id, v.sourceTypeId)}`} />
                                        <div className="details flex x-between y-center">
                                            <h1>{v.title}</h1>
                                            <button
                                                type="button"
                                                className="delete-btn"
                                                onClick={
                                                    () => deleteVideo(v.id)
                                                }
                                            >
                                                <XIcon />
                                                <div className="hidden">
                                                    Delete
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                )
                            )
                        }
                    </div>
                </section>
            </div>
            {(videos.length > 0 && displayOrganizer) &&
                <section className="organizer-section">
                    <VideoOrganizer
                        videos={videos}
                        callbackFn={
                            (videos: Video[]) => {
                                dispatch({
                                    type: 'SET_VIDEOS',
                                    payload: videos
                                });
                                setDisplayOrganizer(false);
                            }
                        }
                        CancelBtn={
                            (<button
                                type="button"
                                className="cancel-btn"
                                onClick={
                                    () => {
                                        setDisplayOrganizer(false);
                                    }
                                }
                            >
                                Cancel
                            </button>)
                        }
                    />
                </section>
            }
        </div>
    )
}

export default CollectionForm;