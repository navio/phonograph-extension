import React, { useCallback, useContext, useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import imageFetcher, { PodcastImage } from "ui/utils/imageSaver";
import { AppContext, IPodcast } from "../index";
import Loading from "ui/common/Loading";
import Top from "./Top";
import List from "./List";
import Header from "../Header";
import engine from "podcastsuite";
import { deletePodcast, getPodcast, messageBackgroundAction } from "background/actions";
import { GetPodcastResponse } from "background/types";
import { podcasts } from "background/config";
import { IMemoryEpisodes, IMemoryPodcast } from "lib/Memory";

export default () => {
  const [podcast, setPodcast] = useState<IPodcast>(null);
  const [listened, setListened] = useState<IMemoryEpisodes>({})
  const [image, setImage] = useState<PodcastImage>(null);
  const [inLibrary, setInLibrary] = useState<boolean>(true);
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
      setInLibrary(true);
    } else {
      setPodcast(undefined);
     setInLibrary(false);
      messageBackgroundAction(
        getPodcast(url),
        (response: GetPodcastResponse) => {
          const { podcast: fetchedPodcast, listened } = response.payload;
          const { episodes: listenedEpisodes = {}} = listened;
          setPodcast(fetchedPodcast);
          setListened(listenedEpisodes)
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

  const subscribePodcast = (url: string) => {
    messageBackgroundAction(
      getPodcast(url, true),
      (response: GetPodcastResponse) => {
        setInLibrary(true);
      }
    );
  }

  const unsubscribePodcast = (url: string) => {
    messageBackgroundAction(deletePodcast(url), () => {
      setInLibrary(false);
    });
  }

  return podcast && image ? (
    <>
      <Header media={image} back />
      <Top
        podcast={podcast}
        image={image}
        inLibrary={inLibrary}
        subscribe={subscribePodcast}
        unsubscribe={unsubscribePodcast}
      />
      <List podcast={podcast} listened={listened} image={image} />
    </>
  ) : (
    <Loading />
  );
};
