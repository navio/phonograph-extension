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
import React from "react";
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
    // console.log(response);
  });

const playAudio = (episode: IEpisode) => {
  messagePlayerAction(Triggers.load(episode), (response) => {
    // console.log(response);
  });
};

export default (props: {
  color?: IColor;
  episode: IEpisode;
  currentEpisode: IEpisode;
  audioState: AudioState;
}) => {
  const classes = useStyles();
  const { color = [0,0,0], episode, currentEpisode, audioState } = props;
  const playing = audioState ? audioState.playing : false;

  const isPlaying =
    currentEpisode && episode.guid === currentEpisode.guid && playing;

  return (
    <IconButton
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
    </IconButton>
  );
};
