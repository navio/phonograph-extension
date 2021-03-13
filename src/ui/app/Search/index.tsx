import React, { useEffect, useState } from "react";
import Card from "./Card";
import styled from "styled-components";
import { Typography } from "@material-ui/core";
import { useLocation } from "react-router-dom";

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

interface IAPodcastsResults {
  resultCount: number;
  results: IPodcastResult[];
}
interface IPodcastResult {
  trackName: string;
  feedUrl: string;
  artworkUrl100: string;
  artworkUrl600: string;
  artistName: string;
}

const searchTransformer = (data: IAPodcastsResults) => {
  return data.results.map((element) => {
    const {
      trackName: title,
      feedUrl: id,
      artworkUrl600: thumbnail,
      artistName: description,
    } = element;
    return { title, id, thumbnail, description };
  });
};

const useQuery = () => new URLSearchParams(useLocation().search);

export default () => {
  const [data, setData] = useState(null);
  const term = useQuery().get('q') || 'NPR';
  
  useEffect(() => {
    fetch(`https://itunes.apple.com/search?media=podcast&limit=20&term=${term}`)
      .then((response) => response.json())
      .then((response) => searchTransformer(response))
      .then(setData);
  }, []);
  const podcastRSS = (id:string) => btoa(`${id}`);

  return (
    <>
      <Title gutterBottom variant="h4" component="h1">
        Results for: {term}
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
    </>
  );
};
