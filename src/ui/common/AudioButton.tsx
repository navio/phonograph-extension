import React from "react";
import { useTheme } from '@mui/material/styles';
import { ListItemIcon, Theme, IconButton } from "@mui/material";
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { AudioState } from "player/types";
import { IEpisode } from "podcastsuite/dist/Format";
import { getRGBA, IColor } from "ui/utils/color";
import PlayIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/PauseOutlined";
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
  const theme = useTheme();
  const classes = useStyles();
  const { color = [0,0,0], episode, currentEpisode, audioState, podcastURL, size = "1.5rem" } = props;
  const playing = audioState ? audioState.playing : false;
  const isPlaying =
    currentEpisode && episode.guid === currentEpisode.guid && playing;
  
  const buttonColor = theme.palette.mode === 'dark' ? theme.palette.primary.main : getRGBA(color);
  return (
    <IconButton
      onClick={() => {
        if (isPlaying) {
          pauseAudio();
        } else {
          playAudio(episode, podcastURL);
        }
      }}
      size="large">
      {isPlaying ? (
        <PauseIcon
          style={{ fontSize: size , color: buttonColor }}
          className={classes.mediaButton}
        />
      ) : (
        <PlayIcon
          style={{ fontSize: size , color: buttonColor }}
          className={classes.mediaButton}
        />
      )}
    </IconButton>
  );
};
