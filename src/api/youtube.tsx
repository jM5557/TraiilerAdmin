import axios from "axios";

interface YoutubeAPIProps {
    getVideoById: Function
}

const YoutubeAPI: YoutubeAPIProps = {
    getVideoById: 
        (id: string) => axios.get(
            "https://www.googleapis.com/youtube/v3/videos",
            {
                params: {
                    part: "snippet",
                    id,
                    key: process.env.REACT_APP_YT_API_KEY
                }
            }
        )
}

export default YoutubeAPI;