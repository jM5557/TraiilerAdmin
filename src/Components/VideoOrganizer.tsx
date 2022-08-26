import react, { useState, useEffect } from "react";
import { getThumbnail } from "../App";
import { Video } from "./../util/types";

interface VideoOrganizerProps {
    videos: Video[],
    callbackFn: Function
}

export const VideoOrganizer = (props: VideoOrganizerProps): JSX.Element => {
    const [selectedPos, setSelectedPos] = useState<number>(-1);
    const [videos, setVideos] = useState<Video[]>(props.videos);

    const [prevPosA, setPrevPosA] = useState<number>(-1);
    const [prevPosB, setPrevPosB] = useState<number>(-1);

    useEffect(
        () => {
            setVideos(props.videos);
            setSelectedPos(-1);

            setPrevPosA(-1);
            setPrevPosB(-1);

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
            <div className="top flex x-between y-center">
                <h1>Organize Videos</h1>
                <div>
                    {/* { (prevPosA > -1) &&
                        <button
                            type = "button"
                            onClick={
                                () => insertAtPos(prevPosA, prevPosB)
                            }
                        >
                            Undo Changes [{prevPosA} | { prevPosB }]
                        </button>
                    } */}
                    <button
                        type = "button"
                        onClick={
                            () => props.callbackFn(videos)
                        }
                        className="submit-btn"
                    >
                        Save Changes
                    </button>
                </div>
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
                                                setPrevPosA(selectedPos);
                                                setPrevPosB(index);

                                                insertAtPos(selectedPos, index);
                                            }
                                            else if (selectedPos === index) {
                                                setSelectedPos(-1);
                                                setPrevPosA(-1);
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
                                    <pre>{ index + 1 }</pre>
                                    <h1>{ v.title }</h1>
                                </div>
                            </li>
                        )
                    )
                }
            </ul>
            
        </div>
    )
}


