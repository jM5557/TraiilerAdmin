import { CookiesProvider, useCookies } from 'react-cookie';
import './styles/index.scss';
import APIKeyForm from './Components/APIKeyForm';
import BaseLayout from './Components/BaseLayout';
import { CollectionFormProvider } from './util/context/CollectionForm';
import { useEffect } from 'react';

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

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    
    return () => {
      window.removeEventListener("beforeunload", handler);
    };
  }, []);

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
