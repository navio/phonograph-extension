import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { AudioState } from "player/types";
import { IEpisode } from "podcastsuite/dist/Format";
import React from "react";
import AudioButton from "ui/common/AudioButton";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: "200px",
    },
  })
);

interface PopUpProps {
  episode: IEpisode;
  audioState: AudioState;
}

export default (props: PopUpProps) => {
  const classes = useStyles();
  const { episode, audioState } = props;
  return (
    <div className={classes.container}>
      {episode && (
        <>
          <span>{episode.title}</span>
          <AudioButton
            audioState={audioState}
            currentEpisode={episode}
            episode={episode}
          />
          <img src={episode.image} />
        </>
      )}
    </div>
  );
};
