import React, { useState, useEffect, useContext } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import { IPodcast } from "..";

import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import PlayIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/PauseOutlined";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";

import { clearText, dateFrom } from "ui/utils/stringsTools";
import { IEpisode } from "podcastsuite/dist/Format";
import { PodcastImage } from "ui/utils/imageSaver";
import { getRGBA, IColor } from "ui/utils/color";

import { messagePlayerAction, Triggers } from "player/actions";
import { AppContext } from "../index";
import { AudioState } from "player/audio";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: theme.palette.background.paper,
      justifyContent: "center",
    },
    list: {
      margin: "0 4rem",
    },
    mediaButton: {
      border: "1px solid",
      borderRadius: "2rem",
      padding: ".5rem",
    },
    listHeader: {
      margin: "0 4rem",
      paddingLeft: "1rem",
      marginTop: ".6rem",
    },
    listHeaderText: { ...theme.typography.subtitle1, fontWeight: "bold" },
  })
);

const EpisodeListDescription = (props: { episode: IEpisode }) => {
  const { episode } = props;
  return (
    <ListItemText
      primary={
        <>
          {episode.season && (
            <Typography color={"secondary"}>Season {episode.season}</Typography>
          )}
          <Typography component="div" variant="subtitle1" noWrap>
            {clearText(episode.title)}
          </Typography>
          <Typography variant="overline" component="div">
            {episode.episodeType && episode.episodeType !== "full" && (
              <Chip
                style={{ marginLeft: "10px" }}
                variant="outlined"
                size="small"
                label={episode.episodeType}
                color="secondary"
              />
            )}
          </Typography>
        </>
      }
      secondary={dateFrom(episode.created)}
    />
  );
};

const PlayerIcon = (props: {
  color: IColor;
  episode: IEpisode;
  currentEpisode: IEpisode;
  audioState: AudioState;
}) => {
  const classes = useStyles();
  const { color, episode, currentEpisode, audioState } = props;
  const playing = audioState ? audioState.playing : false;
  const isPlaying =
    currentEpisode && episode.guid === currentEpisode.guid && playing;

  return (
    <ListItemIcon
      onClick={() => {
        if (isPlaying) {
          pauseAudio();
        } else {
          playAudio(episode);
        }
      }}
    >
      {isPlaying ? (
        <PauseIcon
          style={{ color: getRGBA(color) }}
          className={classes.mediaButton}
        />
      ) : (
        <PlayIcon
          style={{ color: getRGBA(color) }}
          className={classes.mediaButton}
        />
      )}
    </ListItemIcon>
  );
};

const pauseAudio = () =>
  messagePlayerAction(Triggers.stop(), (response) => {
    // console.log(response);
  });

const playAudio = (episode: IEpisode) => {
  messagePlayerAction(Triggers.load(episode), (response) => {
    // console.log(response);
  });
};

export default function EpisodeList(props: {
  podcast: IPodcast;
  image: PodcastImage;
}) {
  const [amount, setAmount] = useState<number>(1);
  const classes = useStyles();
  const { podcast, image } = props;
  const episodeList = podcast.items.slice(0, 20 * amount);
  const { episode: selectedEpisode, audioState } = useContext(AppContext);
  return (
    <div className={classes.root}>
      <Divider />
      <div className={classes.listHeader}>
        <span className={classes.listHeaderText}>
          {episodeList.length} of {podcast.items.length} Episodes
        </span>
      </div>
      <List component="nav" className={classes.list} aria-label="Podcasts">
        <Divider />
        {episodeList.map((episode) => (
          <>
            <ListItem button>
              <PlayerIcon
                color={image.colors[0]}
                audioState={audioState}
                currentEpisode={selectedEpisode}
                episode={episode}
              />
              <EpisodeListDescription episode={episode} />
              <ListItemSecondaryAction>
                <MoreVertIcon />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </>
        ))}
      </List>
      <Button
        onClick={() => setAmount(amount + 1)}
        variant="outlined"
        style={{ margin: "1rem auto", width: "80%" }}
        size="large"
        color="primary"
      >
        {" "}
        Load More Episodes{" "}
      </Button>
    </div>
  );
}
