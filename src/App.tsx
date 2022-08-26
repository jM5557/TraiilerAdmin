import './App.css';
import BaseLayout from './Components/BaseLayout';
import { CollectionFormProvider } from './util/context/CollectionForm';

export const getThumbnail: Function = (urlId: string, sourceTypeId: number): string => {
  return (sourceTypeId === 0)
    ? `https://img.youtube.com/vi/${urlId}/mqdefault.jpg`
    : `https://vumbnail.com/${urlId}.jpg`
}

function App() {
  return (
      <CollectionFormProvider>
        <BaseLayout />
      </CollectionFormProvider>
  );
}

export default App;
