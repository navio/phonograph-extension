import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { AudioState } from "player/types";
import { IEpisode } from "podcastsuite/dist/Format";
import React from "react";
import { ISimplePodcast } from "src/Podcast";
import AudioButton from "ui/common/AudioButton";
import { PodcastImage } from "ui/utils/imageSaver";
import Card from './Card';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      // width: "250px",
    },
  })
);

interface PopUpProps {
  episode: IEpisode;
  audioState: AudioState;
  podcast?: ISimplePodcast;
  media?: PodcastImage;
}

export default (props: PopUpProps) => {
  const classes = useStyles();
  const { episode, audioState, podcast, media } = props;
  return (
      episode && <Card title={episode.title} name={podcast && podcast.title} image={media && media.src}  />
  );
};


{/* <span>{podcast && podcast.title}</span>
<AudioButton
  audioState={audioState}
  currentEpisode={episode}
  episode={episode}
/> */}