import React, { useContext, useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import imageFetcher, { PodcastImage } from "ui/utils/imageSaver";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";

import { AppContext, IPodcast } from "./index";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "block",
      width: "100%",
      height: "100vh",
    },
    head: {
      padding: "5vh",
      display: "flex",
      flexDirection: "row",
    },
    info: {
      paddingLeft: "5vh",
      display: "flex",
      flexDirection: "column",
    },
    title: { ...theme.typography.h3, marginBottom: ".3rem" },
    infoText: theme.typography.body1,
    text: theme.typography.body2,
  })
);

export default () => {
  const [podcast, setPodcast] = useState<IPodcast>(null);
  const [image, setImage] = useState<PodcastImage>(null);
  const { collection } = useContext(AppContext);
  const classes = useStyles();
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
    <div
      className={classes.container}
      style={{
        backgroundColor: `rgba(${image.colors[0][0]}, ${image.colors[0][1]}, ${image.colors[0][2]}, 0.8)`,
      }}
    >
      <div className={classes.head}>
        <img title={podcast.title} style={{ width: "20rem" }} src={image.src} />
        <div className={classes.info}>
          <h1
            className={classes.title}
            style={{
              color: `rgba(${image.colors[1][0]}, ${image.colors[1][1]}, ${image.colors[1][2]}`,
            }}
          >
            {podcast.title}
          </h1>
          <span className={classes.infoText}>{podcast.author}</span>
          <a href={podcast.link} className={classes.infoText}>
            {podcast.link}
          </a>
          <span className={classes.text}>{podcast.description}</span>
        </div>
      </div>
    </div>
  ) : (
    <div>Loading</div>
  );
};
