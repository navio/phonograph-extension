import { Theme } from "@mui/material";
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { AudioState } from "player/types";
import { IEpisode } from "podcastsuite/dist/Format";
import React, { useCallback } from "react";
import { ISimplePodcast } from "src/Podcast";
import AudioButton from "ui/common/AudioButton";
import { getRGBA } from "ui/utils/color";
import { PodcastImage } from "ui/utils/imageSaver";
import Card from './Card';
import { messageBackgroundAction, openOptionsPage } from 'background/actions';
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({});

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
  
  const fullView = 
    useCallback(() => messageBackgroundAction(openOptionsPage(btoa(podcast.url)),() => {}),[podcast]);
  console.log( episode, audioState, (podcast && podcast.url), media);
  return (
    (episode && audioState && podcast && media) ? 
      <ThemeProvider theme={theme}><Card 
        title={episode.title} 
        name={podcast && podcast.title} 
        image={media && media.src} 
        imageClick={fullView}
        background={(media)}
        PlayerButton={
        <AudioButton
          audioState={audioState}
          currentEpisode={episode}
          episode={episode}
          color={media.colors[1]}
        />
        }  /></ThemeProvider> :
      <>Loading</>
  );
};
// 

{/* <span>{podcast && podcast.title}</span>
<AudioButton
  audioState={audioState}
  currentEpisode={episode}
  episode={episode}
/> */}