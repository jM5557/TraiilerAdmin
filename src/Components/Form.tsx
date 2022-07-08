import react, { SyntheticEvent, useState, useRef } from "react";
import useOnClickOutside from "../hooks/useOnClickOutside";
import { Categories } from "../lib/common";
import { Category, Collection, Video } from "../lib/types";
import { getThumbnail } from "../lib/helpers";
import FetchVideoForm from "./FetchVideoForm";
import { ReactComponent as CaretDown } from "./../assets/icons/caret-down.svg";
import { ReactComponent as SearchIcon } from "./../assets/icons/search-icon.svg";
import { ReactComponent as XIcon } from "./../assets/icons/x-icon.svg";
import { ReactComponent as SortDownIcon } from "./../assets/icons/sort-down-icon.svg";
import axios from "axios";
import { VideoOrganizer } from "./VideoOrganizer";

interface FormProps {
    collection: Omit<Collection, "id">
}

const Form = (props: FormProps): JSX.Element => {
    const [collection, setCollection] = useState<typeof props.collection>(props.collection);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [submitType, setSubmitType] = useState<"EDIT" | "CREATE">("CREATE");
    const [displayOrganizer, setDisplayOrganizer] = useState<boolean>(false);
    const [collectionId, setCollectionId] = useState<number | null>(null);
    const loadCollection: Function = async (id: number) => {
        try {
            let results = await axios.get(
                `https://traiiler.herokuapp.com/edit/collection/${ collectionId }`
            );

            let data = await results.data;
            
            // TESTING
            // let data = {
            //     title: "Foobar",
            //     videos: [{ id: "fsdlkfml", title: "dd", sourceTypeId: 0, url: "dsldsaa" }],
            //     categoryId: 2
            // }

            setCollection({
                title: data.title,
                videos: data.videos,
                slug: data.slug,
                categoryId: data.categoryId
            });

            setDcVideos([]);
        }
        catch (err: any) {
            console.log(err);
        }
    }

    const [dcVideos, setDcVideos] = useState<string[]>([]);

    const dropDownRef = useRef<HTMLDivElement>(null);
    const [displayDropDown, setDisplayDropDown] = useState<boolean>(false);
    useOnClickOutside(dropDownRef, () => setDisplayDropDown(false));
    const DropDown: JSX.Element = (
        <div className="dropdown-wrapper" ref = { dropDownRef }>
            <button 
                type="button" 
                className="selected flex x-between y-center"
                onClick={ () => setDisplayDropDown(!displayDropDown) }
            >
                <span>{ Categories[collection.categoryId].text }</span>
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
                                            setCollection({
                                                ...collection,
                                                categoryId: index
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
    
    const videoBoxRef = useRef<HTMLDivElement>(null);
    const [displayVideoBox, setDisplayVideoBox] = useState<boolean>(false);
    useOnClickOutside(videoBoxRef, () => setDisplayVideoBox(false))
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
        setCollection({
            ...collection,
            ...(collection.title.trim().length > 0 ? {} : { title: v.title }),
            videos: [
                ...collection.videos,
                v
            ]
        });
    }

    const deleteVideo: Function = (id: string) => {
        setCollection({
            ...collection,
            videos: (collection.videos.filter(
                (v: Video) => v.id !== id 
            ))
        })

        if (submitType === "EDIT")
            setDcVideos([
                ...dcVideos,
                id
            ]);
    }

    return (
        <div className="form-wrapper">
            <header className="flex y-center x-between top-header">
                <h1>
                    Collection
                </h1>
                <button 
                    className="toggle"
                    onClick={
                        () => setSubmitType(
                            (submitType === "CREATE") 
                                ? "EDIT" 
                                : "CREATE"
                        )
                    }
                >
                    { (submitType === "CREATE") 
                                ? "Edit" 
                                : "Create" }
                </button>
            </header>
            <div className="flex x-start y-start content-wrapper">    
                <div className="inner-form-wrapper">
                { (submitType === "EDIT") &&
                        <div className="inner-form flex y-center x-start">
                            <div className="input-wrapper flex x-start y-stretch collection-id">
                                <label className="label">
                                    <b>Collection ID</b>
                                    <input type = "number" 
                                        value={ "" + collectionId }
                                        onChange = {
                                            (e: SyntheticEvent) => {
                                                setCollectionId(Number((e.target as HTMLInputElement).value))
                                            }
                                        }
                                    />
                                </label>
                                <button
                                    type = "button"
                                    onClick={
                                        () => loadCollection(collectionId)
                                    }
                                >
                                    <SearchIcon />
                                    <span className="hidden">Search</span>
                                </button>
                            </div>
                        </div>
                    }
                    <div className="inner-form flex y-center x-between">
                        <div className="input-wrapper flex x-start y-end">
                            <label className="label">
                                <b>Title</b>
                                <input type = "text" 
                                    value={ collection.title }
                                    onChange = {
                                        (e: SyntheticEvent) => setCollection({
                                            ...collection,
                                            title: (e.target as HTMLInputElement).value
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
                                    value={ collection.slug }
                                    onChange = {
                                        (e: SyntheticEvent) => setCollection({
                                            ...collection,
                                            slug: (e.target as HTMLInputElement).value
                                        })
                                    }
                                />
                            </label>
                        </div>
                    </div>
                    { DropDown }
                    { (collection.title.trim().length > 0) &&
                        <button 
                            type = "button"
                            className={ `submit-btn ${ (submitted) ? "submitted" : ""}` }
                            onClick={
                                async (e: SyntheticEvent) => {
                                    e.preventDefault();
                                    if (submitted) return;
                                    setSubmitted(true);

                                    if (submitType === "CREATE") {
                                        try {
                                            await fetch(
                                                "https://traiiler.herokuapp.com/add/item", 
                                                {
                                                    method: "POST",
                                                    headers: {
                                                    "Content-Type": "application/json"
                                                    },
                                                    body: JSON.stringify({
                                                        item: { 
                                                            title: collection.title.trim(), 
                                                            categoryId: collection.categoryId,
                                                            slug: collection.slug.trim()
                                                        },
                                                        videos: (
                                                            collection.videos.map(
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
                                            setSubmitted(false);
                                            setCollection({
                                                title: "",
                                                categoryId: 0,
                                                videos: [],
                                                slug: ""
                                            });
                                        }
                                        catch (err: any) {
                                            setSubmitted(false);
                                            console.log(err);
                                        }
                                    }
                                    else {
                                        try {
                                            // http://localhost:5000
                                            // https://traiiler.herokuapp.com
                                            await fetch(
                                                "https://traiiler.herokuapp.com/edit/collection", 
                                                {
                                                    method: "POST",
                                                    headers: {
                                                    "Content-Type": "application/json"
                                                    },
                                                    body: JSON.stringify({
                                                        item: {
                                                            id: collectionId,
                                                            title: collection.title.trim(), 
                                                            categoryId: collection.categoryId,
                                                            slug: collection.slug.trim()
                                                        },
                                                        videos: (
                                                            collection.videos.map(
                                                                (v: Video) => ({
                                                                    urlId: v.id,
                                                                    title: v.title,
                                                                    url: v.url,
                                                                    sourceTypeId: v.sourceTypeId
                                                                })
                                                            )
                                                        ),
                                                        disconnectedVideos: dcVideos
                                                    })
                                                }
                                            );
                                            setSubmitted(false);
                                        }
                                        catch (err: any) {
                                            setSubmitted(false);
                                            console.log(err);
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
                        <span>{collection.videos.length} Video(s)</span>
                        
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
                            collection.videos.map(
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
            { (collection.videos.length > 0 && displayOrganizer) &&
                <section className="organizer-section">
                    <VideoOrganizer 
                        videos={collection.videos}
                        callbackFn = {
                            (videos: Video[]) => {
                                setCollection({
                                    ...collection,
                                    videos
                                });
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

export default Form;