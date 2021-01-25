import React, { useCallback, useContext, useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import imageFetcher, { PodcastImage } from "ui/utils/imageSaver";
import { AppContext, IPodcast } from "../index";
import Loading from "ui/common/Loading";
import Top from "./Top";
import List from "./List";
import Header from "../Header";
import engine from "podcastsuite";
import { getPodcast, messageBackgroundAction } from "background/actions";
import { GetPodcastResponse } from "background/types";
import { podcasts } from "background/config";

export default () => {
  const [podcast, setPodcast] = useState<IPodcast>(null);
  const [image, setImage] = useState<PodcastImage>(null);
  const [subscribe, setSubscribe] = useState<boolean>(false);
  const { collection } = useContext(AppContext);
  const { podcast: PodcastURL } = useRouteMatch("/podcast/:podcast").params;

  let url: string;
  useEffect(() => {
    try {
      url = atob(PodcastURL);
    } catch (error) {
      url = PodcastURL;
    }
    const [podcast] = collection.filter((podcast) => podcast.url === url);

    if (podcast) {
      setPodcast(podcast);
    } else {
      setPodcast(undefined);
      if(collection)
      // setSubscribe(true);
      messageBackgroundAction(
        getPodcast(url),
        (response: GetPodcastResponse) => {
          const { podcast: fetchedPodcast } = response.payload;
          setPodcast(fetchedPodcast);
        }
      );
    }
  }, [PodcastURL, collection]);

  useEffect(() => {
    if (podcast) {
      imageFetcher(podcast.image).then((media) => {
        setImage(media);
      });
    }
  }, [podcast]);

  const subscribePodcast = useCallback(() => {
    messageBackgroundAction(
      getPodcast(url, true),
      (response: GetPodcastResponse) => {
        setSubscribe(false);
      }
    );
  }, [url]);

  return podcast && image ? (
    <>
      <Header media={image} back />
      <Top
        podcast={podcast}
        image={image}
        subscribed={subscribe}
        subscribe={subscribePodcast}
      />
      <List podcast={podcast} image={image} />
    </>
  ) : (
    <Loading />
  );
};
