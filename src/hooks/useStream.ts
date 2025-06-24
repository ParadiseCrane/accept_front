import { useCallback, useState } from 'react';

interface IStreamData {
  loading: boolean;
  streaming: boolean;
  data: string;
  error: string | null;
  startStream: () => Promise<void>;
}

export function useStream(url: string): IStreamData {
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const startStream = useCallback(async () => {
    setLoading(true);
    setStreaming(false);
    setContent('');
    setError(null);

    try {
      const response = await fetch(url, {
        headers: {
          Accept: 'text/event-stream',
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No readable stream in response');
      }

      setLoading(false);
      setStreaming(true);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        if (chunk.length <= 6) continue;

        try {
          const data = JSON.parse(chunk.slice(6));
          if (data.content) {
            setContent((prev) => prev + data.content);
          }
        } catch (parseError) {
          setError('Error parsing stream data');
          break;
        }
      }
    } catch (error) {
      console.error(error);
      setError('Unknown error');
    } finally {
      setStreaming(false);
      setLoading(false);
    }
  }, [url]);

  return {
    loading,
    streaming,
    data: content,
    error,
    startStream,
  };
}
