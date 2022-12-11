import axios from "axios";

interface GenresAPIProps {
    getAllGenres: Function
}
 
let GenresAPI = (key: string): GenresAPIProps => ({
    getAllGenres: async () => {
        return await axios.get(
            `${ process.env.REACT_APP_BASEURL}/genres/all?key=${ key }`
        )
    }
})
 
export default GenresAPI;