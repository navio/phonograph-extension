import React, { useContext, useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import imageFetcher, { PodcastImage } from "ui/utils/imageSaver";
import { AppContext, IPodcast } from "../index";
import Loading from "ui/common/Loading";
import Top from "./Top";
import List from "./List";
import Header from "../Header";
import engine from "podcastsuite";

export default () => {
  const [podcast, setPodcast] = useState<IPodcast>(null);
  const [image, setImage] = useState<PodcastImage>(null);
  const { collection } = useContext(AppContext);
  const { podcast: PodcastURL } = useRouteMatch("/podcast/:podcast").params;

  useEffect(() => {
    let url: string;

    try {
      url = atob(PodcastURL);
    } catch (error) {
      url = PodcastURL
    }
    const [podcast] = collection.filter((podcast) => podcast.url === url);
    if (podcast) {
      setPodcast(podcast);
    } else {
        setPodcast(undefined);
      engine.fetch(new URL(url)).then((podcastRAW) =>  {
        setPodcast(podcastRAW);
      } );
    }
  }, [PodcastURL, collection]);

  useEffect(() => {
    if (podcast) {
      imageFetcher(podcast.image).then((media) => {
        setImage(media);
      });
    }
  }, [podcast]);

  return podcast && image ? (
    <>
      <Header media={image} />
      <Top podcast={podcast} image={image} />
      <List podcast={podcast} image={image} />
    </>
  ) : (
    <Loading />
  );
};
