import React, { useContext, useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import imageFetcher, { PodcastImage } from "ui/utils/imageSaver";
import { AppContext, IPodcast } from "../index";
import Loading from "ui/common/Loading";
import Header from "./header";
import List from "./List";

export default () => {
  const [podcast, setPodcast] = useState<IPodcast>(null);
  const [image, setImage] = useState<PodcastImage>(null);
  const { collection } = useContext(AppContext);
  const { podcast: PodcastURL } = useRouteMatch("/podcast/:podcast").params;
  const url = atob(PodcastURL);

  useEffect(() => {
    const [podcast] = collection.filter((podcast) => podcast.url === url);
    setPodcast(podcast);
  }, [url, collection]);

  useEffect(() => {
    if (podcast) {
      imageFetcher(podcast.image).then((media) => {
        setImage(media);
      });
    }
  }, [podcast]);

  return podcast && image ? (
    <>
      <Header podcast={podcast} image={image} />
      <List podcast={podcast} image={image} />
    </> 
  ) : (
    <Loading />
  );
};
