import React, { useContext, useEffect, useState } from "react";
import { Card } from "@material-ui/core";
import styled from "styled-components";
import { AppContext, IPodcast, IAppContext } from "./index";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Slider } from "@material-ui/core";
import AudioButton from "../common/AudioButton";
import { percentPlayed } from "src/Audio";
import { messagePlayerAction, progressEmissionListener, Triggers } from "player/actions";
import { AudioState } from "Audio";

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
  position: absolute;
  top: 0.8rem;
  font-size: 1.3rem;
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

const seekHandler = (event, value) => {
  console.log(value);
  messagePlayerAction(Triggers.seek(value), (response) => {});
}

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

  return (
    <MediaControlsWrapper>
      {!!audioStateInternal?.loaded && episode && (
        <Card variant="outlined">
          <MediaControls>
            <HorizontalContainer>
              <AudioButton
                audioState={audioStateInternal}
                currentEpisode={episode}
                episode={episode}
                size={"3.2rem"}
              />
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
                  // valueLabelDisplay={"auto"}
                  onChange={seekHandler}
                />
              </ProgressContainer>
            </HorizontalContainer>
          </MediaControls>
        </Card>
      )}
    </MediaControlsWrapper>
  );
};
