import axios from "axios";

interface YoutubeAPI {
    getVideoById: Function
}

const youtubeAPI: YoutubeAPI = {
    getVideoById: (id: string) => {
        console.log(process.env.REACT_APP_YT_API_KEY);
        return axios.get(
            "https://www.googleapis.com/youtube/v3/videos",
            {
                params: {
                    part: "snippet",
                    id,
                    key: process.env.REACT_APP_YT_API_KEY
                }
            }
        );
    }
}

export default youtubeAPI;