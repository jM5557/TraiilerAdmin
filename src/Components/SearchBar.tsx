import axios from "axios";
import { useState } from "react";
import { Collection } from "../lib/types";

interface SearchBarProps {
    setCollections: Function
}
 
const SearchBar: React.FC<SearchBarProps> = ({
    setCollections
}): JSX.Element => {
    const [searchText, setSearchText] = useState<string>("");
    
    const handleSearch: Function = async (text: string) => {
        try {
            let results = await axios.get(
                `http://localhost:5000/search/collection/${ text.trim() }`
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
        <div>
            Search

            <input
                type = "text"
                onChange={
                    (e) => {
                      setSearchText(e.target.value);  
                    }
                }
                value = { searchText }
            />

            <button
                onClick={
                    () => {
                        handleSearch(searchText);
                    }
                }
            >
                Search
            </button>
        </div>
    );
}
 
export default SearchBar;