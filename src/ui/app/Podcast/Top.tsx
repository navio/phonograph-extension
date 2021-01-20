import React, { useContext, useEffect, useState } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { IPodcast } from "../index";
import { PodcastImage } from "ui/utils/imageSaver";
import { clearText, dateFrom } from "ui/utils/stringsTools";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "block",
      width: "100%",
    //   height: "100vh",
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
    infoText: theme.typography.subtitle1,
    text: theme.typography.body2,
  })
);

export default (props: { podcast: IPodcast; image: PodcastImage }) => {
  const { podcast, image } = props;
  const classes = useStyles();
  return (
    <div
      className={classes.container}
      style={{
        backgroundColor: `rgba(${image.colors[0][0]}, ${image.colors[0][1]}, ${image.colors[0][2]}, 0.8)`,
      }}
    >
      <div className={classes.head}>
        <img title={podcast.title} style={{ width: "15rem", height: "15rem" }} src={image.src} />
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
          <span className={classes.text}>{clearText(podcast.description)}</span>
        </div>
      </div>
    </div>
  );
};
