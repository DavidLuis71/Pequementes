
import { useEffect, useState } from "react";

type SceneImageProps = {
  emoji: string;
  description: string;
  imageQuery?: string;
  className?: string;
};

type OpenverseImage = {
  id: string;
  title: string;
  thumbnail?: string;
  url: string;
  foreign_landing_url: string;
  creator?: string;
  license?: string;
  license_url?: string;
};

type OpenverseResponse = {
  results?: OpenverseImage[];
};

const imageCache = new Map<
  string,
  Promise<OpenverseImage | null>
>();

function searchImage(query: string): Promise<OpenverseImage | null> {
  const cached = imageCache.get(query);

  if (cached) return cached;

  const request = (async (): Promise<OpenverseImage | null> => {
    try {
      const params = new URLSearchParams({
        q: query,
        page_size: "5",
        mature: "false",
      });

      const response = await fetch(
        `https://api.openverse.org/v1/images/?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`Openverse respondió ${response.status}`);
      }

      const data: OpenverseResponse = await response.json();

      const results = data.results ?? [];

      // Preferimos resultados que tengan una miniatura y una página de origen.
      const image = results.find(
        (item) => item.thumbnail && item.foreign_landing_url
      );

      return image ?? null;
    } catch (error) {
      console.error("No se pudo consultar Openverse:", error);
      return null;
    }
  })();

  imageCache.set(query, request);
  return request;
}

export default function SceneImage({
  emoji,
  description,
  imageQuery,
  className = "",
}: SceneImageProps) {
  const [image, setImage] = useState<OpenverseImage | null>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const query = imageQuery?.trim() || `${description} cartoon illustration`;

    setImage(null);
    setImageFailed(false);
    setLoading(true);

    searchImage(query).then((result) => {
      if (!active) return;

      setImage(result);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [description, imageQuery]);

  const showImage = image && !imageFailed && image.thumbnail;

  return (
    <div
      className={`scene-image ${className}`}
      role="img"
      aria-label={description}
    >
      {showImage ? (
        <>
          <a
            className="scene-image-link"
            href={image.foreign_landing_url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Ver imagen original: ${image.title}`}
            onClick={(event) => event.stopPropagation()}
          >
            <img
              className="scene-image-picture"
              src={image.thumbnail}
              alt={description}
              loading="lazy"
              onError={() => setImageFailed(true)}
            />
          </a>

          <span className="scene-image-credit">
            {image.creator ? `Autor: ${image.creator}` : "Ver fuente"}
            {image.license && ` · ${image.license}`}
            {image.license_url && (
              <>
                {" · "}
                <a
                  href={image.license_url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(event) => event.stopPropagation()}
                >
                  Licencia
                </a>
              </>
            )}
          </span>
        </>
      ) : (
        <span className="scene-image-fallback" aria-hidden="true">
          {emoji}
        </span>
      )}

      {loading && !showImage && (
        <span className="scene-image-loading" aria-hidden="true">
          Buscando ilustración…
        </span>
      )}
    </div>
  );
}
