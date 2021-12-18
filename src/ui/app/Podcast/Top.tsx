import React, { useContext, useEffect, useState } from "react";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { IPodcast } from "../index";
import { PodcastImage } from "ui/utils/imageSaver";
import { clearText, dateFrom } from "ui/utils/stringsTools";
import { getRGBA, getRGB, contrastColor } from "ui/utils/color";
import MicIcon from "@mui/icons-material/MicNoneOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { Button, Chip, IconButton, Typography } from "@mui/material";
import { margin } from "@mui/system";
import Styled from "styled-components";

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

const LineRow = Styled(Typography)`
  display: flex;
  align-items: baseline;
`;

export default (props: {
  podcast: IPodcast;
  image: PodcastImage;
  inLibrary: boolean;
  subscribe: (url: string) => void;
  unsubscribe: (url: string) => void;
}) => {
  const { podcast, image, inLibrary, subscribe, unsubscribe } = props;
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
            {inLibrary && <IconButton
              title="Unsubscribe"
              style={{
                color: getRGB(image.colors[1]),
                borderColor: getRGB(image.colors[1]),
              }}
              onClick={() => unsubscribe(podcast.url)}
            >
              <BookmarkIcon />
            </IconButton>}
            {podcast.title}
          </h1>
          {!inLibrary && (
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

          <div>
            {podcast?.author && (
              <LineRow component={"div"} variant="body1">
                Author:
                <Typography style={{paddingLeft:".5rem"}} variant="body2">{podcast.author}</Typography>
              </LineRow>
            )}
            {podcast?.explicit && (
              <LineRow component={"div"} variant="body1">
                Explicit:
                <Chip
                  style={{ margin: ".2rem", marginTop: "0", color: getRGB(image.colors[1]) }}
                  size="small"
                  label={podcast?.explicit}
                />
                {podcast?.language && (
                  <>
                    Language:
                    <Chip
                      style={{
                        textTransform: "capitalize",
                        margin: ".5rem",
                        marginTop: "0",
                        color: getRGB(image.colors[1])
                      }}
                      size="small"
                      label={podcast.language}
                    />
                  </>
                )}
              </LineRow>
            )}
            {podcast?.copyright && (
              <Typography variant="caption">{podcast.copyright}</Typography>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
