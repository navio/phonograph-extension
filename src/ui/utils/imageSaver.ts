import colorthief from "colorthief";
import PS from "podcastsuite";
const thief = new colorthief();
const { createDatabase } = PS;
const images = createDatabase("images", "offline");

interface MediaFile {
  src: string;
  size: number;
  type: string;
  url: string;
  colors: number[][];
}
export type PodcastImage = string | MediaFile;

export interface ImageSaverConfig {
  media?: boolean;
  refresh?: boolean;
}

export default (
  url: string,
  config: ImageSaverConfig = {}
): Promise<PodcastImage> => {
  const { media = false, refresh = false } = config;
  const internalFetch = () =>
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        return new Promise<PodcastImage>((resolve) => {
          const { size, type } = blob;
          const reader = new FileReader();
          reader.addEventListener("loadend", () => {
            const srcAll = reader.result.toString();
            const img = new Image();
            img.src = srcAll;
            img.onload = () => {
              const canvas = document.createElement("canvas");
              const scale = 400;

              const scaleFactor = scale / img.width;
              canvas.width = scale;
              canvas.height = img.height * scaleFactor;

              const ctx = canvas.getContext("2d");
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

              const src = ctx.canvas.toDataURL(type, 10);
              const colors = thief.getPalette(img, 4);
              const mediaFile = {
                src,
                size,
                type,
                url,
                colors,
              };
              images.set(url, mediaFile);
              resolve(media ? mediaFile.src : mediaFile);
            };
          });
          reader.readAsDataURL(blob);
        });
      });

  return images.get(url).then((found: MediaFile) => {
    if (!refresh && found) {
      return media ? found : found.src;
    }
    return internalFetch();
  });
};
