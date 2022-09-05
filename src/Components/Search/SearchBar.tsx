import axios from "axios";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { ReactComponent as SearchIcon } from "./../../assets/icons/search-icon.svg";

interface SearchBarProps {
    setCollections: Function
}
 
const SearchBar: React.FC<SearchBarProps> = ({
    setCollections
}): JSX.Element => {
    const [searchText, setSearchText] = useState<string>("");
    const [cookies] = useCookies(['key']);
    
    const handleSearch: Function = async (text: string) => {
        try {
            let results = await axios.get(
                `${process.env.REACT_APP_BASEURL}/search/collection/${ text.trim() }?key=${cookies['key']}`
            );

            if (!results) setCollections([]);
            
            let data = await results.data;
            setCollections(data);
        }
        catch (error) {
            console.log((error as Error).message);
            setCollections([]);
        }
    }
    return (
        <div className="inner-form flex y-center x-start">
            <div className="input-wrapper flex x-start y-stretch search-bar">
                <label className="label">
                    <b>Search</b>
                    <input
                        type = "text"
                        onChange={
                            (e) => {
                            setSearchText(e.target.value);  
                            }
                        }
                        value = { searchText }
                        className="search-bar-input"
                    />
                </label>
                <button
                    type = "button"
                    onClick={
                        () => handleSearch(searchText)
                    }
                >
                    <SearchIcon />
                    <span className="hidden">Search</span>
                </button>
            </div>
        </div>
    );
}
 
export default SearchBar;