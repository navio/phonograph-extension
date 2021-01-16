import PodcastSuite from "podcastsuite";
import PS from "podcastsuite";
const { createDatabase } = PS;
const images = createDatabase("images", "offline");

interface MediaFile {
  src: string;
  size: number;
  type: string;
  url: string;
}

export default (url: string): Promise<string> => {
  const internalFetch = () =>
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        return new Promise<string>((resolve) => {
          const { size, type } = blob;
          const reader = new FileReader();
          reader.addEventListener("loadend", () => {
            const srcAll = reader.result.toString();
            const img = new Image();
            img.src = srcAll;
            img.onload = () => {
              console.log("great");
              const canvas = document.createElement("canvas");
              const scale = 400;

              const scaleFactor = scale / img.width;
              canvas.width = scale;
              canvas.height = img.height * scaleFactor;

              const ctx = canvas.getContext("2d");
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

              const src = ctx.canvas.toDataURL(type, 10);
              const mediaFile = {
                src,
                size,
                type,
                url,
              };
              images.set(url, mediaFile);
              resolve(mediaFile.src);
            };
          });
          reader.readAsDataURL(blob);
        });
      });

  return images.get(url).then((found: MediaFile, refresh = false) => {
    //   console.log('what found', found);
    if (!refresh && found) {
      return found.src;
    }
    return internalFetch();
  });
};
