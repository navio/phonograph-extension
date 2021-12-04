import React, { useEffect, useState } from "react";
import Card from "./Card";
import styled from "styled-components";
import { Typography, useTheme } from "@mui/material";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  margin: 0 auto;
  padding-top: 1rem;
`;

const Title = styled(Typography)`
  padding-left: 2rem;
  padding-top: 1rem;
`;

export default () => {
  const [data, setData] = useState(null);
  const theme = useTheme();
  const Wrapper = styled.div`
    background-color: ${theme.palette.background.paper}
  `;
  useEffect(() => {
    fetch("https://odd-lake-0e8b.navio.workers.dev")
      .then((response) => response.json())
      .then((response) => response["podcasts"])
      .then(setData);
  }, []);
  const podcastRSS = (id:string) => btoa(`https://www.listennotes.com/c/r/${id}`);
  return (
    <Wrapper>
      <Title color={'primary'} gutterBottom variant="h4" component="h1">
        Discover
      </Title>
      <Container>
        {data &&
          data.map((podcast) => (
            <Card
              title={podcast.title}
              id={podcastRSS(podcast.id)}
              image={podcast.thumbnail}
              description={podcast.description}
            />
          ))}
      </Container>
    </Wrapper>
  );
};
