import React, { useContext, useEffect, useState } from "react";
import { Card } from "@material-ui/core";
import styled from "styled-components";
import { AppContext, IPodcast, IAppContext } from "./index";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Slider } from "@material-ui/core";
import AudioButton from "../common/AudioButton";
import { percentPlayed, AudioState, timeByPercentage } from "src/Audio";
import {
  messagePlayerAction,
  progressEmissionListener,
  Triggers,
} from "player/actions";
import { displayTime } from "ui/utils/stringsTools";
import { IEpisode } from "podcastsuite/dist/Format";

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
  width: 100%;

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



export default () => {
  const { episode, audioState }: IAppContext = useContext(AppContext);
  const [audioStateInternal, setAudioStateInternal] =
    useState<AudioState>(audioState);

  useEffect(() => {
    progressEmissionListener(({ payload }) => {
      const currentTime: number = payload.percentage;
      setAudioStateInternal((state) => {
        return { ...state, currentTime };
      });
    });
  }, [progressEmissionListener]);

  useEffect(() => {
    setAudioStateInternal(audioState);
  }, [audioState]);

  const seekHandler = (event, value) => {
    const currentTime = timeByPercentage(value, audioState);
    setAudioStateInternal((state) => {
      return { ...state, currentTime };
    });
    messagePlayerAction(Triggers.seek(currentTime), (response) => {});
  };

  return (
    <MediaControlsWrapper>
      {!!audioStateInternal?.loaded && episode && (
        <Card variant="outlined">
          <MediaControls>
            <HorizontalContainer>
              <EpisodeImage src={episode.image} />
              <AudioButton
                audioState={audioStateInternal}
                currentEpisode={episode}
                episode={episode}
                size={"2rem"}
              />
              <TimeDisplay align="center">
                {displayTime(audioStateInternal.currentTime)}
              </TimeDisplay>
              <ProgressContainer>
                <Title align="center">{episode.title}</Title>
                <LinearProgress
                  variant="buffer"
                  value={percentPlayed(audioStateInternal)}
                  valueBuffer={100}
                />
                <Slider
                  style={{ padding: "0px" }}
                  value={percentPlayed(audioStateInternal)}
                  aria-labelledby="audio"
                  valueLabelDisplay={"auto"}
                  onChange={seekHandler}
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
  );
};
