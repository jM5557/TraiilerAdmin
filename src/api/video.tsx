import axios from "axios";

interface VideoAPI {
    addVideo: Function,
    deleteVideo: Function,
    fetchVideos: Function
}

const videoAPI: (apiKey: string) => VideoAPI = (apiKey) => {
    return {
        addVideo: async (
            url: string, 
            urlId: string,
            title: string
        ) => 
            axios.post(
                `${process.env.REACT_APP_BASEURL}/add/video`,
                {
                    url,
                    urlId,
                    title
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

export default videoAPI;