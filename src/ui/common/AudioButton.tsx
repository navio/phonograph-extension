import React from "react";
import {
  createStyles,
  ListItemIcon,
  makeStyles,
  Theme,
  IconButton,
} from "@material-ui/core";
import { AudioState } from "player/types";
import { IEpisode } from "podcastsuite/dist/Format";
import { getRGBA, IColor } from "ui/utils/color";
import PlayIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/PauseOutlined";
import { messagePlayerAction, Triggers } from "player/actions";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mediaButton: {
      border: "1px solid",
      borderRadius: "2rem",
      padding: ".5rem",
    },
  })
);

const pauseAudio = () =>
  messagePlayerAction(Triggers.stop(), (response) => {
  });

const playAudio = (episode: IEpisode, podcastURL?: string) => {
  messagePlayerAction(Triggers.load(episode, podcastURL), (response) => {
  });
};

export default (props: {
  color?: IColor;
  episode: IEpisode;
  currentEpisode: IEpisode;
  audioState: AudioState;
  podcastURL?: string;
  size?: string;
}) => {
  
  const classes = useStyles();
  const { color = [0,0,0], episode, currentEpisode, audioState, podcastURL, size = "1.5rem" } = props;
  const playing = audioState ? audioState.playing : false;
  const isPlaying =
    currentEpisode && episode.guid === currentEpisode.guid && playing;
    
  return (
    <IconButton
      onClick={() => {
        if (isPlaying) {
          pauseAudio();
        } else {
          playAudio(episode, podcastURL);
        }
      }}
    >
      {isPlaying ? (
        <PauseIcon
          style={{ fontSize: size , color: getRGBA(color) }}
          className={classes.mediaButton}
        />
      ) : (
        <PlayIcon
          style={{ fontSize: size , color: getRGBA(color) }}
          className={classes.mediaButton}
        />
      )}
    </IconButton>
  );
};
