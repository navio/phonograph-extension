import React, { useEffect, useState } from "react";
import Card from "./Card";
import styled from "styled-components";
import { Typography } from "@material-ui/core";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  margin: 10px auto;
`;

const Title = styled(Typography)`
  padding-left: 2rem;
  padding-top: 1rem;
`;

export default () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("https://odd-lake-0e8b.navio.workers.dev")
      .then((response) => response.json())
      .then((response) => response["podcasts"])
      .then(setData);
  }, []);

  return (
    <>
      <Title gutterBottom variant="h3" component="h1">
        Trending
      </Title>
      <Container>
        {data &&
          data.map((podcast) => (
            <Card
              title={podcast.title}
              id={podcast.id}
              image={podcast.thumbnail}
              description={podcast.description}
            />
          ))}
      </Container>
    </>
  );
};
