import { useEffect, useState, useCallback, useMemo } from "react";
import { useCookies } from "react-cookie";
import GenresAPI from "../api/genres";
import { Genre } from "../util/types";

interface GenresProps {
    initialSelection: Genre[] | null
}

const Genres: React.FC<GenresProps> = ({
    initialSelection
}) => {
    let [cookies] = useCookies(['key']);
    let [genres, setGenres] = useState<Genre[] | null>(null);
    let [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
    let [removedGenres, setRemovedGenres] = useState<Genre[]>([]);
    
    let genresAPI = useCallback(
        () => GenresAPI(cookies.key),
        []
    );

    let fetchResults = useCallback(async () => {
        let results = await genresAPI().getAllGenres();

        setGenres(results.data);
        console.log(results);
    }, [])

    useEffect(() => {
        fetchResults();
    }, []);


    return (
        <div className="genres-select">
            <h2>Choose a Genre</h2>
            
            <div className="selected-genres">
                { (selectedGenres.length > 0) &&
                    <>
                        {
                            selectedGenres.map((g: Genre) => (
                                <div 
                                    className="flex x-center y-center"
                                    key = { g.id }
                                >
                                    <span>{ g.text }</span>
                                    <button
                                        type = "button"
                                        onClick = {
                                            () => {
                                                let arr = selectedGenres.filter(
                                                    (selection: Genre) => selection.id !== g.id
                                                )

                                                setSelectedGenres(arr);

                                                setRemovedGenres(
                                                    Array.from(
                                                        new Set([...removedGenres, g])
                                                    )
                                                );
                                            }
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))
                        }
                    </>
                }
            </div>

            <div className="genres">
                { (genres) &&
                    <>
                        {
                            genres.map(
                                (g: Genre) => (
                                    <button 
                                        type = "button"
                                        key={ g.id }
                                        onClick = {() => {
                                            let arr = [
                                                ...selectedGenres,
                                                g
                                            ];

                                            let uniqueArr = Array.from(new Set(arr));
                                            setSelectedGenres(uniqueArr);

                                            setRemovedGenres(
                                                removedGenres.filter(
                                                    (selection: Genre) => selection.id !== g.id
                                                )
                                            )
                                        }}
                                    >
                                        { g.text }
                                    </button>
                                )
                            )
                        }
                    </>
                }
            </div>
        </div>
    );
}
 
export default Genres;