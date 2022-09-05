import React, { SyntheticEvent, useState, useContext, ReducerAction } from "react";
import { Categories } from "../util/common";
import { Category, Collection, Video } from "../util/types";
import { getThumbnail } from "../util/helpers";
import FetchVideoForm from "./FetchVideoForm";
import { ReactComponent as CaretDown } from "./../assets/icons/caret-down.svg";
import { ReactComponent as XIcon } from "./../assets/icons/x-icon.svg";
import { ReactComponent as SortDownIcon } from "./../assets/icons/sort-down-icon.svg";
import axios from "axios";
import { VideoOrganizer } from "./VideoOrganizer";
import usePopup from "../hooks/UsePopup";
import { Action, CollectionFormContext } from "../util/context/CollectionForm";
import { useCookies } from "react-cookie";

interface FormProps {
    submitType: string
}

export const loadCollection: Function = async (
    id: number, 
    dispatch: React.Dispatch<Action>,
    key: string
) => {
    try {
        let results = await axios.get(
            `https://traiiler.herokuapp.com/edit/collection/${ id }?key=${ key }`
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
        videos, 
        submitted, 
        removedVideos 
    } = state;

    const [displayOrganizer, setDisplayOrganizer] = useState<boolean>(false);
    
    const [
        dropDownRef, 
        displayDropDown, 
        setDisplayDropDown
    ] = usePopup<HTMLDivElement>();

    const DropDown: JSX.Element = (
        <div className="dropdown-wrapper" ref = { dropDownRef }>
            <button 
                type="button" 
                className="selected flex x-between y-center"
                onClick={ () => setDisplayDropDown(!displayDropDown) }
            >
                <span>{ Categories[categoryId].text }</span>
                <CaretDown />
            </button>
            { (displayDropDown) &&
                <div className="dropdown">
                    {
                        Categories.map(
                            (c: Category, index: number) => (
                                <button
                                    type ="button"
                                    onClick={
                                        () => {
                                            dispatch({
                                                type: 'SET_CATEGORY_ID',
                                                payload: index
                                            });
                                            setDisplayDropDown(false);
                                        }
                                    }
                                    key={ index }
                                >
                                    { c.text }
                                </button>
                            )
                        )
                    }
                </div>
            }
        </div>
    );
    
    const [
        videoBoxRef, 
        displayVideoBox, 
        setDisplayVideoBox
    ] = usePopup<HTMLDivElement>();

    const VideoBox: JSX.Element = (
        <div className="video-box">
            <button
                type = "button"
                className="cancel-btn"
                onClick={
                    () => setDisplayVideoBox(false)
                }
            >
                <XIcon />   
                <span className = "hidden">
                    Cancel
                </span>
            </button>
            <FetchVideoForm 
                callbackFn={ (v: Video) => addVideo(v) }
            />
        </div>
    );

    const addVideo: Function = (v: Video) => {
        if (title.trim().length === 0)
            dispatch({
                type: 'SET_TITLE',
                payload: v.title
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

    return (
        <div>
            { collectionId }
            <div className="flex x-start y-start content-wrapper">    
                <div className="inner-form-wrapper">
                    <div className="inner-form flex y-center x-between">
                        <div className="input-wrapper flex x-start y-end">
                            <label className="label">
                                <b>Title</b>
                                <input type = "text" 
                                    value={ title }
                                    onChange = {
                                        (e: SyntheticEvent) => dispatch({
                                            type: 'SET_TITLE',
                                            payload: (e.target as HTMLInputElement).value
                                        })
                                    }
                                />
                            </label>
                        </div>
                    </div>
                    <div className="inner-form flex y-center x-start">
                        <div className="input-wrapper flex x-start y-end">
                            <label className="label">
                                <b>Slug</b>
                                <input type = "text" 
                                    value={ slug }
                                    onChange = {
                                        (e: SyntheticEvent) => dispatch({
                                            type: 'SET_SLUG',
                                            payload: (e.target as HTMLInputElement).value
                                        })
                                    }
                                />
                            </label>
                        </div>
                    </div>
                    { DropDown }
                    { (title.trim().length > 0) &&
                        <button 
                            type = "button"
                            className={ `submit-btn ${ (submitted) ? "submitted" : ""}` }
                            onClick={
                                async (e: SyntheticEvent) => {
                                    e.preventDefault();
                                    if (submitted) return;

                                    dispatch({
                                        type: 'SET_SUBMITTED',
                                        payload: true
                                    })

                                    if (props.submitType === "CREATE") {
                                        try {
                                            await fetch(
                                                `https://traiiler.herokuapp.com/add/item?key=${ cookies['key'] }`,
                                                {
                                                    method: "POST",
                                                    headers: {
                                                    "Content-Type": "application/json"
                                                    },
                                                    body: JSON.stringify({
                                                        item: { 
                                                            title: title.trim(), 
                                                            categoryId: categoryId,
                                                            slug: slug.trim()
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
                                        catch (err: any) {
                                            dispatch({
                                                type: 'SET_SUBMITTED',
                                                payload: false
                                            })
                                            console.log(err);
                                        }
                                    }
                                    else {
                                        try {
                                            // http://localhost:5000
                                            // https://traiiler.herokuapp.com
                                            await fetch(
                                                `https://traiiler.herokuapp.com/edit/collection?key=${cookies['key']}`,
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
                                                            slug: slug.trim()
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
                            }
                        >
                            { (submitted) ? "..." : "Submit" }
                        </button>
                    }
                </div>
                <section className="videos-section">
                    <div className="top flex x-between y-center">
                        <span>{videos.length} Video(s)</span>
                        
                        <div className="flex y-center x-between">
                            <button 
                                type="button"
                                className="toolbar-btn"
                                onClick={
                                    () => {
                                        setDisplayOrganizer(true);
                                    }
                                }
                            >
                                <SortDownIcon />
                                <span className="hidden">
                                    Sort by Viewing Order
                                </span>  
                            </button>


                            <div className="video-box-wrapper" ref = { videoBoxRef }>
                                <button
                                    type = "button"
                                    className="add-video-btn"
                                    onClick={
                                        () => { setDisplayVideoBox(!displayVideoBox) }
                                    }
                                >
                                    Add Video
                                </button>
                                { (displayVideoBox) &&
                                    <>
                                        { VideoBox }
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="list">
                        {
                            videos.map(
                                (v: Video, index: number) => (
                                    <div className="list-item" key = { index }>
                                        <img alt = { v.title } src = { `${ getThumbnail(v.id, v.sourceTypeId) }` } />
                                        <div className="details flex x-between y-center">
                                            <h1>{ v.title }</h1>
                                            <button
                                                type = "button"
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
            { (videos.length > 0 && displayOrganizer) &&
                <section className="organizer-section">
                    <VideoOrganizer 
                        videos={videos}
                        callbackFn = {
                            (videos: Video[]) => {
                                dispatch({
                                    type: 'SET_VIDEOS',
                                    payload: videos
                                })
                            }
                        }
                    />
                    <button
                        type="button" 
                        className="cancel-btn"
                        onClick={
                            () => {
                                setDisplayOrganizer(false);
                            }
                        }
                    >
                        Cancel
                    </button>
                </section>
            }
        </div>
    )
}

export default CollectionForm;