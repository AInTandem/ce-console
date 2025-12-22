import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getExternalResourceUrl } from '@/lib/config';

export function ShellPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const projectName = searchParams.get('projectName') || 'Shell';
  const [shellUrl, setShellUrl] = useState('');

  useEffect(() => {
    if (id) {
      setShellUrl(getExternalResourceUrl(`/flexy/${id}/shell`));
    }
    document.title = `Kai | ${projectName}`;
  }, [id, projectName]);

  if (!shellUrl) {
    return <div>Loading Shell...</div>; // TODO: Replace with a proper spinner/loader
  }

  return (
    <div className="h-[calc(100vh-8rem)] w-full">
      <iframe
        src={shellUrl}
        title={`Terminal for ${projectName}`}
        className="h-full w-full border-0"
      />
    </div>
  );
}
