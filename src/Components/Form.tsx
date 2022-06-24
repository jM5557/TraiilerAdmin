import react, { SyntheticEvent, useState, useRef } from "react";
import useOnClickOutside from "../hooks/useOnClickOutside";
import { Categories } from "../lib/common";
import { Category, Collection, Video } from "../lib/types";
import { getThumbnail } from "./AddVideoForm";
import FetchVideoForm from "./FetchVideoForm";
import { ReactComponent as CaretDown } from "./../assets/icons/caret-down.svg";

interface FormProps {
    collection: Omit<Collection, "id">
}

const Form = (props: FormProps): JSX.Element => {
    const [collection, setCollection] = useState<typeof props.collection>(props.collection);
    const [submitted, setSubmitted] = useState<boolean>(false);

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
        <div className="video-box" ref = { videoBoxRef }>
            <FetchVideoForm 
                callbackFn={ (v: Video) => addVideo(v) }
            />
            <button
                type = "button"
                className="cancel-btn"
                onClick={
                    () => setDisplayVideoBox(false)
                }
            >Cancel</button>
        </div>
    );

    const addVideo: Function = (v: Video) => {
        setCollection({
            ...collection,
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
    }

    return (
        <div className="form-wrapper">
            <header className="flex y-center x-between top-header">
                <h1>
                    Add a Collection
                </h1>
            </header>
            <div className="inner-form flex y-center x-between">
                <div className="input-wrapper flex x-start y-end">
                    <label className="title">
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
                    { DropDown }
                </div>
            </div>
            <section className="videos-section">
                <div className="top flex x-between y-center">
                    <span>{collection.videos.length} Video(s)</span>
                    
                    <div className="flex y-center x-between">
                        <div className="video-box-wrapper">
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
                        { (collection.title.trim().length > 0) &&
                            <button 
                                type = "button"
                                className={ `submit-btn ${ (submitted) ? "submitted" : ""}` }
                                onClick={
                                    async (e: SyntheticEvent) => {
                                        e.preventDefault();
                                        
                                        if (submitted) return;

                                        setSubmitted(true);

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
                                                            categoryId: collection.categoryId 
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
                                        }
                                        catch (err: any) {
                                            setSubmitted(false);
                                            console.log(err);
                                        }
                                    }
                                }
                            >
                                { (submitted) ? "..." : "Submit" }
                            </button>
                        }
                    </div>
                </div>
                <div className="list">
                    {
                        collection.videos.map(
                            (v: Video, index: number) => (
                                <div className="list-item">
                                    <img alt = { v.title } src = { `${ getThumbnail(v.id, v.sourceTypeId) }` } />
                                    <div className="details">
                                        <h1>{ v.title }</h1>
                                        <button
                                            type = "button"
                                            onClick={
                                                () => deleteVideo(v.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )
                        )
                    }
                </div>
            </section>
        </div>
    )
}

export default Form;