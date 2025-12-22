import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getExternalResourceUrl } from '@/lib/config';

export function DocsPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const projectName = searchParams.get('projectName') || 'Docs';
  const [docsUrl, setDocsUrl] = useState('');

  useEffect(() => {
    if (id) {
      setDocsUrl(getExternalResourceUrl(`/flexy/${id}/docs/`));
    }
    document.title = `Kai | ${projectName} - Docs`;
  }, [id, projectName]);

  if (!docsUrl) {
    return <div>Loading Docs...</div>;
  }

  return (
    <div className="h-[calc(100vh-8rem)] w-full">
      <iframe
        src={docsUrl}
        title={`Docs for ${projectName}`}
        className="h-full w-full border-0"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
      />
    </div>
  );
}
