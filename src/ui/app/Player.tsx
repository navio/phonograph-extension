import React, { useContext, useEffect, useState } from "react";
import { Card, useTheme } from "@mui/material";
import styled from "styled-components";
import { AppContext, IPodcast, IAppContext } from "./index";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import { Slider } from "@mui/material";
import AudioButton from "../common/AudioButton";
import { percentPlayed, AudioState, timeByPercentage } from "lib/Audio";
import {
  messageBackgroundAction,
  initializePopUp,
  getPlayerState,
} from "background/actions";
import {
  messagePlayerAction,
  progressEmissionListener,
  Triggers,
} from "player/actions";
import { displayTime } from "ui/utils/stringsTools";
import { InitializePopUpResponse } from "popup/types";
import { ISimplePodcast } from "lib/Podcast";
import { PodcastImage } from "ui/utils/imageSaver";
import { getRGBA } from "ui/utils/color";
import { GetPlayerState } from "background/types";
import { GetPlayerStatusResponse } from "options/types";

const MediaControlsWrapper = styled.div`
  & > div {
    display: flex;
    position: fixed;
    bottom: 0;
    width: 100%;
  }
`;

const MediaControls = styled.div`
  position: relative;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin: 0.2rem 1.2rem 0.2rem 0.8rem;
`;

const Title = styled.div`
  font-size: 1rem;
  padding-top: 0.5rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const TimeDisplay = styled.div`
  display: flex;
  margin: 0px 1rem;
  align-items: center;
  font-size: 1.2rem;
  width: 3rem;
`;

const HorizontalContainer = styled.div`
  display: flex;
  margin: 0px 2rem 0px 0.5rem;
`;
const ProgressContainer = styled.div`
  position: relative;
  display: block;
  width: 100vw;

  & > div.MuiLinearProgress-root,
  span.MuiSlider-root {
    position: absolute;
    top: 50%;
    width: 100%;
  }
`;

const EpisodeImage = styled.img`
  height: 4rem;
  padding-top: 0.3rem;
`;

const ContentExtender = styled.div`
  height: 5rem;
`;

const LinearProgressStyled = styled(LinearProgress)`
  & .MuiLinearProgress-colorPrimary,
  & .MuiLinearProgress-barColorPrimary {
    background-color: ${(props) => props.color};
  }
`;

export default () => {
  const { episode, audioState }: IAppContext = useContext(AppContext);
  const [audioStateInternal, setAudioStateInternal] =
    useState<AudioState>(audioState);

  const [media, setMedia] = useState<PodcastImage>();

  const theme = useTheme();

  useEffect(() => {
    progressEmissionListener(({ payload }) => {
      const currentTime: number = payload.percentage;
      const duration: number = payload.duration;
      setAudioStateInternal((state) => {
        return { ...state, currentTime, duration };
      });
      return true;
    });
  }, [progressEmissionListener]);

  useEffect(() => {
    messageBackgroundAction(
      getPlayerState(),
      (response: GetPlayerStatusResponse) => {
        const { podcastImage, state } = response.payload;
        setMedia(podcastImage);
        setAudioStateInternal(state);
      }
    );
  }, [episode]);

  useEffect(() => {
    setAudioStateInternal(audioState);
  }, [audioState]);

  const seekHandler = (_, value) => {
    const currentTime = timeByPercentage(value, audioStateInternal);
    setAudioStateInternal((state) => {
      return { ...state, currentTime };
    });
    messagePlayerAction(Triggers.seek(currentTime), () => { return true });
  };

  const masterColor =
    theme.palette.mode === "dark"
      ? theme.palette.primary.main
      : getRGBA(media?.colors[0] || [0, 0, 0]);

  return (
    <>
      <MediaControlsWrapper>
        {!!audioStateInternal?.loaded && episode && (
          <Card variant="outlined">
            <MediaControls>
              <HorizontalContainer>
                <EpisodeImage src={episode?.image || media?.src || null} />
                <AudioButton
                  audioState={audioStateInternal}
                  currentEpisode={episode}
                  episode={episode}
                  size={"2rem"}
                  color={media?.colors[0]}
                />
                <TimeDisplay align="center">
                  {displayTime(audioStateInternal.currentTime)}
                </TimeDisplay>
                <ProgressContainer>
                  <Title align="center">{episode.title}</Title>
                  {/* <LinearProgressStyled
                    color={masterColor}
                    variant="buffer"
                    value={percentPlayed(audioStateInternal)}
                    valueBuffer={audioStateInternal.duration > 0 ? 100 : 0}
                  /> */}
                  <Slider
                    style={{ padding: "0px", color: masterColor }}
                    value={percentPlayed(audioStateInternal)}
                    aria-labelledby="audio"
                    valueLabelDisplay={"auto"}
                    onChange={(a,b) => seekHandler(a,b)}
                  />
                </ProgressContainer>
                <TimeDisplay align="center">
                  {displayTime(audioStateInternal.duration)}
                </TimeDisplay>
              </HorizontalContainer>
            </MediaControls>
          </Card>
        )}
      </MediaControlsWrapper>
      {!!audioStateInternal?.loaded && episode && <ContentExtender />}
    </>
  );
};
