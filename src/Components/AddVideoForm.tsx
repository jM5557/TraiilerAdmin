import { useState, SyntheticEvent, useRef, RefObject, useMemo } from "react";
import { useCookies } from "react-cookie";
import VideoAPI from "../api/video";
import YoutubeAPI from "../api/youtube";
import { getVideoId, getThumbnail, isValidURL } from "../util/helpers";
import { Genre, Video } from "../util/types";
import { ReactComponent as SearchIcon } from "./../assets/icons/search-icon.svg";
import { ReactComponent as XIcon } from "./../assets/icons/x-icon.svg";
import Genres from "./Genres";

interface AddVideoFormProps {
  callbackFn: Function;
}

let initialVideo: Omit<Video, 'id'> = {
  url: "",
  urlId: "",
  title: "",
  sourceTypeId: 0,
  Genre: []
}

const AddVideoForm: React.FC<AddVideoFormProps> = ({
  callbackFn,
  ...props
}): JSX.Element => {
  const [video, setVideo] = useState<typeof initialVideo>(initialVideo);
  const [submitType, setSubmitType] = useState<'CREATE' | 'EDIT'>('CREATE');
  const { 
    url, 
    urlId, 
    title, 
    sourceTypeId,
    Genre
  } = video;

  const [cookies] = useCookies(['key']);

  const [viewType, setViewType] = useState<"BY_TITLE" | "BY_URL" | "GENRES">("BY_URL");
  const [results, setResults] = useState<Video[] | null>(null);

  const inputRef: RefObject<HTMLInputElement>   = useRef<HTMLInputElement>(null);
  const submitRef: RefObject<HTMLButtonElement> = useRef<HTMLButtonElement>(null);

  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  let videoAPI = useMemo(
    () => VideoAPI(cookies['key']), 
    [cookies]
  );

  const saveVideo = async (
    url: string,
    urlId: string,
    title: string,
    genres: Genre[]
  ) => {
    setStatusMessage("Saving video...");

    try {
      if (submitType === "CREATE")
        await videoAPI.addVideo(
          url, 
          urlId,
          title,
          genres
        );
      else
        await videoAPI.updateVideo(
          url, 
          urlId,
          title,
          genres
        )
      setStatusMessage("Video saved successfully");
    } catch (error) {
      setStatusMessage("Unable to save video");
    }
  }

  const deleteVideo = async (urlId: string) => {
    setStatusMessage("Deleting video...");
    try {
      await videoAPI.deleteVideo(urlId);

      if (results)
        setResults(
          results?.filter(
            (r: typeof results[0]) => r.urlId !== urlId
          )
        );
      setStatusMessage("Video deleted successfully");
    } catch (error) {
      setStatusMessage("Unable to delete video");
    }
  }

  const fetchVideo = async (url: string) => {
    let urlId = getVideoId(url);

    if (!urlId) 
      throw new Error("Unable to fetch video ID");

    let results = await YoutubeAPI.getVideoById(urlId);
    let { snippet } = results.data.items[0];

    setVideo({
      url,
      urlId,
      title: snippet.title,
      sourceTypeId: 0,
      Genre
    });

    setViewType("GENRES");
    setSubmitType('CREATE');

    if (submitRef) 
      submitRef.current?.focus();
  };

  const fetchVideos = async (title: string) => {
    let fetchResults: typeof results = await videoAPI.fetchVideos(
      title, 
      cookies.key
    );

    if (!fetchResults) 
      throw new Error("Unable to fetch videos");
    
    setResults(fetchResults);
  };

  return (
    <div className="add-video-form">
      <div className="form-body">
        <div className="add-video-form-tabs">
          <button
            type="button"
            className={`tab ${viewType === "BY_TITLE" ? "selected" : ""}`}
            onClick={() => setViewType("BY_TITLE")}
          >
            Title
          </button>
          <button
            type="button"
            className={`tab ${viewType === "BY_URL" ? "selected" : ""}`}
            onClick={() => setViewType("BY_URL")}
          >
            URL
          </button>
          { (video.urlId.length > 0) &&
            <button
              type="button"
              className={`tab ${viewType === "GENRES" ? "selected" : ""}`}
              onClick={() => setViewType("GENRES")}
            >
              Genres
            </button>
          }
        </div>
        {urlId && (
          <>
            <img 
              alt="video thumbnail" 
              src={
                getThumbnail(
                  urlId, 
                  sourceTypeId
                )
              } 
            />
            <small className="id">
              {urlId}
            </small>

            { (video && viewType === "GENRES") &&
              <Genres 
                genres={ video.Genre }
                setGenres = {(genres: Genre[]) => {
                    setVideo({
                      ...video,
                      Genre: genres
                    })
                }}
              />
            }

            { (!statusMessage)
              ? <button
                  type = "button"
                  onClick = {
                    () => saveVideo(
                      url,
                      urlId,
                      title,
                      Genre
                    )
                  }
                  className = "save-btn"
                >
                  Save Video
                </button>
              : <span className="flex x-between y-center status-message">
                  { statusMessage }
                  <button
                    onClick={() => setStatusMessage(null)}
                  ><XIcon /></button>
                </span>
            }
          </>
        )}
        {!urlId && (
          <div className="empty">
            <header>Add a Video</header>
          </div>
        )}

        {viewType === "BY_URL" && (
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
                  onChange={
                    (e: SyntheticEvent) =>
                      setVideo({
                        ...video,
                        url: (e.target as HTMLInputElement).value
                      })
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

                      setVideo({
                        ...video,
                        url: "",
                        urlId: ""
                      });
                    }}
                  >
                    <span className="hidden">
                      Clear
                    </span>
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

        {viewType === "BY_TITLE" && (
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
                  onChange={
                    (e: SyntheticEvent) => {
                      if (getVideoId((e.target as HTMLInputElement).value)) {
                        setVideo({
                          ...video,
                          url: (e.target as HTMLInputElement).value
                        })
                        setViewType("BY_URL");
                      }
                      else
                        setVideo({
                          ...video,
                          title: (e.target as HTMLInputElement).value
                        })
                    }
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

                      setVideo({
                        ...video,
                        title: ""
                      })
                    }}
                  >
                    <span className="hidden">
                      Clear
                    </span>
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

        {(viewType === "BY_TITLE" && results && results.length > 0) && 
          <div
            className="flex y-center x-start 
                      add-item-form-results videos"
          >
            {results.map((r: Video, index: number) => (
              <div key={index} className="item">
                <img
                  alt="video thumbnail"
                  src={
                    getThumbnail(
                      r.urlId, 
                      r.sourceTypeId
                    )
                  }
                  tabIndex={0}
                  onClick={async () => {
                    try {
                      setVideo(await videoAPI.fetchVideo(r.urlId))
                    } catch (error) {
                      setVideo(r);
                    }
                    setSubmitType('EDIT');
                  }}
                />
                <p className="flex y-center x-center">
                  {r.title}
                  <button
                    type = "button"
                    onClick={
                      () => deleteVideo(r.urlId)
                    }
                  >
                    <XIcon />
                  </button>
                </p>
              </div>
            ))}
          </div>
        }

        {(urlId && title.trim().length > 0) && (
          <div className="buttons">
            <button 
              type="button" 
              onClick={() => {
                setVideo(initialVideo);
                setResults(null);
                setViewType("BY_URL");
                if (inputRef) 
                  inputRef.current?.focus();
              }} 
              className="cancel-btn"
            >
              Cancel
            </button>
            <button
              type="button"
              className="add-btn"
              ref={submitRef}
              onClick={(e: SyntheticEvent) => {
                e.preventDefault();
                e.stopPropagation();

                if (inputRef) 
                  inputRef.current?.focus();

                callbackFn({
                  id: urlId,
                  url,
                  title,
                  sourceTypeId
                });

                setVideo(initialVideo);
                setViewType("BY_URL")
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
