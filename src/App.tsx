import './App.css';
import { SyntheticEvent, useState } from 'react';
import AddVideoForm from './Components/AddVideoForm';
import FetchVideoForm from './Components/FetchVideoForm';
import Form from './Components/Form';

interface Video {
  url: string,
  id: string | null,
  title: string | null,
  sourceTypeId: 0 | 1
}

interface Category {
  id: number,
  text: string
}
let categories: Category[] = [
  { id: 0, text: "Video Games" },
  { id: 1, text: "Movies" },
  { id: 2, text: "TV-Shows" }
]

export const getThumbnail: Function = (urlId: string, sourceTypeId: number): string => {
  return (sourceTypeId === 0)
    ? `https://img.youtube.com/vi/${urlId}/mqdefault.jpg`
    : `https://vumbnail.com/${urlId}.jpg`
}

function App() {
  const [id, setId] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [categoryId, setCategoryId] = useState<number>(0);

  const [video, setVideo] = useState<Video>({
    url: "",
    id: null,
    title: "",
    sourceTypeId: 0
  });

  const vimeoRegExp: RegExp = /https?:\/\/(?:www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
  const youtubeRegExp: RegExp = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

  const getVideoId = (url: string): string | null => {
    let match: RegExpMatchArray | null = url.match(video.sourceTypeId === 0 ? youtubeRegExp : vimeoRegExp);

    if (match && match[1])
      return match[1];
    else
      return null;
  };

  return (
    <div>
      <Form 
        collection={{
          title: "",
          videos: [],
          categoryId: 0
        }}
      />
    </div>
  );
}

export default App;
