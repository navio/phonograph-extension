import React, { useContext, useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { AppContext, IPodcast } from "./index";

export default () => {
  const [podcast, setPodcast] = useState<IPodcast>();
  const { collection } = useContext(AppContext);

  const { podcast: PodcastURL  } = useRouteMatch("/podcast/:podcast").params;
  const url = atob(PodcastURL);

  useEffect(() => {
    const [podcast] = collection.filter(podcast => podcast.url = url);
    setPodcast(podcast);
  }, [url, collection]);

  return <div>Podcat: {podcast ? podcast.title: 'loading'} </div>;
};