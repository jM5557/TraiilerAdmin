import axios from "axios";
import { Genre } from "../util/types";

interface VideoAPIProps {
    addVideo: Function,
    updateVideo: Function,
    deleteVideo: Function,
    fetchVideo: Function,
    fetchVideos: Function
}

const VideoAPI: (apiKey: string) => VideoAPIProps = (apiKey) => {
    return {
        addVideo: async (
            url: string, 
            urlId: string,
            title: string,
            genres: Genre[]
        ) => 
            axios.post(
                `${process.env.REACT_APP_BASEURL}/add/video`,
                {
                    url,
                    urlId,
                    title,
                    genres
                },
                {
                    params: {
                        key: apiKey
                    }
                }
            ),
        updateVideo: async (
            url: string, 
            urlId: string,
            title: string,
            genres: Genre[]
        ) => 
            axios.post(
                `${process.env.REACT_APP_BASEURL}/edit/video`,
                {
                    url,
                    urlId,
                    title,
                    genres
                },
                {
                    params: {
                        key: apiKey
                    }
                }
            ),
        deleteVideo: async (urlId: string) =>
            axios.delete(
                `${process.env.REACT_APP_BASEURL}/delete/video/${ urlId }?key=${ apiKey }`
            ),
        fetchVideo: async (
            urlId: string
        ) => {
            let results = await axios.get(`${ process.env.REACT_APP_BASEURL }/edit/video/${ urlId}?key=${ apiKey }`)
            
            if (results)
                return results.data;
            return null;
        },
        fetchVideos: async (
            title: string
        ) => {
            let results = await fetch(
                `${process.env.REACT_APP_BASEURL}/search/video/${encodeURI(
                    title
                )}?key=${apiKey}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!results.ok) return null;

            let data = await results.json();

            return data;
        }
    }
}

export default VideoAPI;