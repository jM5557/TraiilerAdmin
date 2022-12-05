import { useState, SyntheticEvent, useRef, RefObject } from "react";
import { useCookies } from "react-cookie";
import youtubeAPI from "../api/youtube";
import { getVideoId, getThumbnail } from "../util/helpers";
import { Video } from "../util/types";
import { ReactComponent as SearchIcon } from "./../assets/icons/search-icon.svg";

interface AddVideoFormProps {
  callbackFn: Function;
}

const getVideos = async (title: string, apiKey: string) => {
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
};

const AddVideoForm: React.FC<AddVideoFormProps> = ({
  callbackFn,
  ...props
}): JSX.Element => {
  const [cookies] = useCookies(["key"]);
  const [url, setUrl] = useState<string>("");
  const [id, setVideoId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [sourceTypeId, setSourceTypeId] = useState<number>(0);

  const [searchType, setSearchType] = useState<"BY_TITLE" | "BY_URL">("BY_URL");
  const [results, setResults] = useState<Video[] | null>(null);

  const inputRef: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const submitRef: RefObject<HTMLButtonElement> =
    useRef<HTMLButtonElement>(null);

  const fetchVideo = async (url: string) => {
    let id = getVideoId(url);

    if (!id) throw new Error("Unable to fetch video!");

    await setVideoId(id);
    let results = await youtubeAPI.getVideoById(id);
    setTitle(results.data.items[0].snippet.title);

    if (submitRef) submitRef.current?.focus();
  };

  const fetchVideos = async (title: string) => {
    let fetchResults: typeof results = await getVideos(title, cookies.key);

    if (!fetchResults) throw new Error("Unable to fetch videos");

    setResults(fetchResults);
  };

  const setSelectedVideo = (video: Video | null) => {
    if (video) {
      setVideoId(video.urlId);
      setUrl(video.url);
      setTitle(video.title);
      setSourceTypeId(video.sourceTypeId);
    } else {
      setVideoId(null);
      setUrl("");
      setTitle("");
      setSourceTypeId(0);
    }
  };

  const cancelForm = () => {
    setVideoId(null);
    setTitle("");
    setUrl("");
  };

  return (
    <div className="add-video-form">
      <div className="form-body">
        <div className="add-video-form-tabs">
          <button
            type="button"
            className={`tab ${searchType === "BY_TITLE" ? "selected" : ""}`}
            onClick={() => setSearchType("BY_TITLE")}
          >
            Title
          </button>
          <button
            type="button"
            className={`tab ${searchType === "BY_URL" ? "selected" : ""}`}
            onClick={() => setSearchType("BY_URL")}
          >
            URL
          </button>
        </div>
        {id && (
          <>
            <img alt="video thumbnail" src={getThumbnail(id, sourceTypeId)} />
            <small className="id">{id}</small>
          </>
        )}
        {!id && (
          <div className="empty">
            <header>Add a Video</header>
          </div>
        )}

        {searchType === "BY_URL" && (
          <form
            onSubmit={(e: SyntheticEvent) => {
              e.preventDefault();
              e.stopPropagation();

              fetchVideo(url);
            }}
            className="input"
          >
            <label className="flex x-between y-center">
              <div>
                <b>URL/Link</b>
                <input
                  type="text"
                  value={url}
                  onChange={(e: SyntheticEvent) =>
                    setUrl((e.target as HTMLInputElement).value)
                  }
                  autoFocus
                  ref={inputRef}
                />
              </div>
              {url.length > 0 && (
                <>
                  <button
                    type="button"
                    className="clear-text-btn"
                    onClick={(e: SyntheticEvent) => {
                      e.preventDefault();
                      e.stopPropagation();

                      setUrl("");
                      setVideoId(null);
                    }}
                  >
                    <span className="hidden">Clear</span>
                  </button>
                  <button
                    type="submit"
                    className="search-btn"
                    onClick={() => fetchVideo(url)}
                  >
                    <SearchIcon />
                    <span>Search</span>
                  </button>
                </>
              )}
            </label>
          </form>
        )}

        {searchType === "BY_TITLE" && (
          <form
            className="input"
            onSubmit={(e: SyntheticEvent) => {
              e.preventDefault();
              e.stopPropagation();

              fetchVideos(title);
            }}
          >
            <label className="flex x-between y-center">
              <div>
                <b>Title</b>
                <input
                  type="text"
                  value={title}
                  onChange={(e: SyntheticEvent) =>
                    setTitle((e.target as HTMLInputElement).value)
                  }
                />
              </div>
              {title.length > 0 && (
                <>
                  <button
                    type="button"
                    className="clear-text-btn"
                    onClick={(e: SyntheticEvent) => {
                      e.preventDefault();
                      e.stopPropagation();

                      setTitle("");
                    }}
                  >
                    <span className="hidden">Clear</span>
                  </button>
                  <button
                    type="submit"
                    className="search-btn"
                    onClick={() => fetchVideos(title)}
                  >
                    <SearchIcon />
                    <span>Search</span>
                  </button>
                </>
              )}
            </label>
          </form>
        )}

        {(searchType === "BY_TITLE" && results) && 
          <div
            className="
                        flex y-center x-start 
                        add-item-form-results videos
                    "
          >
            {results.map((r: Video, index: number) => (
              <div key={index} className="item">
                <img
                  alt="video thumbnail"
                  src={getThumbnail(r.urlId, r.sourceTypeId)}
                  tabIndex={0}
                  onClick={() => {
                    setSelectedVideo(r);
                  }}
                />
                <p>{r.title}</p>
              </div>
            ))}
          </div>
        }

        {id && title.trim().length > 0 && (
          <div className="buttons">
            <button type="button" onClick={cancelForm} className="cancel-btn">
              Cancel
            </button>
            <button
              type="button"
              className="add-btn"
              ref={submitRef}
              onClick={(e: SyntheticEvent) => {
                e.preventDefault();
                e.stopPropagation();

                if (inputRef) inputRef.current?.focus();

                callbackFn({
                  id,
                  url,
                  title,
                  sourceTypeId,
                });

                setUrl("");
                setVideoId(null);
                setTitle("");
              }}
            >
              Add Video
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddVideoForm;
