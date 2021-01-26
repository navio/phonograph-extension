import React, { useContext, useEffect, useState } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { IPodcast } from "../index";
import { PodcastImage } from "ui/utils/imageSaver";
import { clearText, dateFrom } from "ui/utils/stringsTools";
import { getRGBA, getRGB, contrastColor } from "ui/utils/color";
import MicIcon from "@material-ui/icons/MicNoneOutlined";
import BookmarkIcon from '@material-ui/icons/Bookmark';
import { Button } from "@material-ui/core";

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

export default (props: {
  podcast: IPodcast;
  image: PodcastImage;
  inLibrary: boolean;
  subscribe: (url: string) => void;
}) => {
  const { podcast, image, inLibrary, subscribe } = props;
  const classes = useStyles();
  return (
    <div
      className={classes.container}
      style={{
        backgroundColor: getRGBA(image.colors[0]),
      }}
    >
      <div className={classes.head}>
        <img
          title={podcast.title}
          style={{ width: "15rem", height: "15rem" }}
          src={image.src}
        />
        <div className={classes.info}>
          <h1
            className={classes.title}
            style={{
              color: getRGBA(image.colors[1]),
            }}
          >
            {podcast.title}
          </h1>
          <span className={classes.infoText}>
            <MicIcon style={{ height: "1rem" }} />
            {podcast.author}
          </span>
          <span
            style={{ color: contrastColor(image.colors[0]) }}
            className={classes.text}
          >
            {clearText(podcast.description)}
          </span>
          {inLibrary ? (
            <Button
            style={{
              width: "200px",
              margin: "1rem 0",
              color: getRGB(image.colors[1]),
              borderColor: getRGB(image.colors[1]),
            }}
            onClick={() => console.log('remove me!')}
            variant="outlined"
          >
            Unsubscribe
          </Button>
          ):
          (
            <Button
              style={{
                width: "200px",
                margin: "1rem 0",
                color: getRGB(image.colors[1]),
                borderColor: getRGB(image.colors[1]),
              }}
              onClick={() => subscribe(podcast.url)}
              variant="outlined"
            >
              <BookmarkIcon /> Subscribe
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
