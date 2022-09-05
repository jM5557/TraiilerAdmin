import { CookiesProvider, useCookies } from 'react-cookie';
import './App.css';
import APIKeyForm from './Components/APIKeyForm';
import BaseLayout from './Components/BaseLayout';
import { CollectionFormProvider } from './util/context/CollectionForm';

export const getThumbnail: Function = (
  urlId: string, 
  sourceTypeId: number
): string => {
  return (sourceTypeId === 0)
    ? `https://img.youtube.com/vi/${urlId}/mqdefault.jpg`
    : `https://vumbnail.com/${urlId}.jpg`
}

const PageContent = (): JSX.Element => {
  const [cookies] = useCookies(['key']);

  if (cookies['key'])
    return (
      <CollectionFormProvider>
          <BaseLayout />
      </CollectionFormProvider>
    );
  else {
    return (
      <APIKeyForm />
    )
  }
}

function App() {
  return (
    <CookiesProvider>
      <PageContent />
    </CookiesProvider>
  );
}

export default App;
