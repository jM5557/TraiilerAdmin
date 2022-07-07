import './App.css';
import Form from './Components/Form';

export const getThumbnail: Function = (urlId: string, sourceTypeId: number): string => {
  return (sourceTypeId === 0)
    ? `https://img.youtube.com/vi/${urlId}/mqdefault.jpg`
    : `https://vumbnail.com/${urlId}.jpg`
}

function App() {
  return (
    <div>
      <Form 
        collection={{
          title: "",
          videos: [],
          categoryId: 0,
          slug: ""
        }}
      />
    </div>
  );
}

export default App;
