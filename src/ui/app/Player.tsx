import React, { useContext } from "react";
import { Card } from "@material-ui/core";
import styled from "styled-components";
import { AppContext, IPodcast, IAppContext } from "./index";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Slider } from "@material-ui/core";
import AudioButton from "../common/AudioButton";
import { percentPlayed } from "src/Audio";

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
  margin: 0.2rem 1.2rem 0.2rem .8rem;
`;

const Title = styled.div`
  position: absolute;
  top: .8rem;
  font-size: 1.3rem;
`;

const HorizontalContainer = styled.div`
  display: flex;
  margin: 0px 2rem 0px .5rem;
`;
const ProgressContainer = styled.div`
  position: relative;
  display: block;
  width: 100%;
  & > div.MuiLinearProgress-root, span.MuiSlider-root {
    position: absolute;
    top: 50%;
    width: 100%;
  }
`;

export default () => {
  const { episode, audioState }: IAppContext = useContext(AppContext);

  console.log(episode, audioState);
  return (
    <MediaControlsWrapper>
      {!!audioState?.loaded && episode && (
        <Card variant="outlined">
          <MediaControls>
            <HorizontalContainer>
              <AudioButton
                audioState={audioState}
                currentEpisode={episode}
                episode={episode}
                size={"3.2rem"}
              />
              <ProgressContainer>
                <Title align="center">
                    {episode.title}
                </Title>
                <LinearProgress
                  variant="buffer"
                  value={percentPlayed(audioState)}
                  valueBuffer={100}
                />
                 <Slider
                    style={{ padding: "0px" }}
                    value={percentPlayed(audioState)}
                    aria-labelledby="audio"
                    // onChange={props.seek}
                  />
              </ProgressContainer>
            </HorizontalContainer>
          </MediaControls>
        </Card>
      )}
    </MediaControlsWrapper>
  );
};
