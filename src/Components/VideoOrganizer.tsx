import { useState, useEffect } from "react";
import { getThumbnail } from "../App";
import { Video } from "./../util/types";

interface VideoOrganizerProps {
    videos: Video[],
    callbackFn: Function,
    CancelBtn: JSX.Element
}

export const VideoOrganizer = (props: VideoOrganizerProps): JSX.Element => {
    const [selectedPos, setSelectedPos] = useState<number>(-1);
    const [videos, setVideos] = useState<Video[]>(props.videos);

    useEffect(
        () => {
            setVideos(props.videos);
            setSelectedPos(-1);

            return () => {}
        },
        [props.videos]
    )

    const insertAtPos: Function = (startPos: number, insertPos: number) => {
        setSelectedPos(-1);

        const temp: Video[] = videos.filter((v: Video, index: number) => index !== startPos);
        temp.splice(insertPos, 0, videos[startPos]);

        setVideos(temp);
    }
    return (
        <div className="video-organizer">
            <div className="top">
                <header>Organize Videos</header>
            </div>
            <ul>
                {
                    videos.map(
                        (v: Video, index: number) => (
                            <li className={`video x-start flex y-center ${ (index === selectedPos) ? "selected" : "" }`}
                                onClick={
                                    () => {
                                        // If an item is selected
                                        if (selectedPos > -1) {
                                            // If the item clicked is not the selected item 
                                            // then insert the selected item at this position
                                            if (selectedPos !== index) {
                                                insertAtPos(selectedPos, index);
                                            }
                                            else if (selectedPos === index) {
                                                setSelectedPos(-1);
                                            }
                                        } else {
                                            // If an item is NOT selected, set it as selected
                                            setSelectedPos(index);
                                        }
                                    }
                                }
                            >
                                <img src={ getThumbnail(v.id, 0) } alt={v.title } />
                                <div className="details">
                                    <small className="id">{ index + 1 }</small>
                                    <h1>{ v.title }</h1>
                                </div>
                            </li>
                        )
                    )
                }
            </ul>
            <footer className="bottom flex x-end y-center">
                { props.CancelBtn }
                <button
                    type = "button"
                    onClick={
                        () => props.callbackFn(videos)
                    }
                    className="submit-btn"
                >
                    Save Changes
                </button>
            </footer>
        </div>
    )
}


