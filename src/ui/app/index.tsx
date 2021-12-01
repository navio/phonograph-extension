import React from "react";
import { IPodcast as IPodcastSuitePodcast } from "podcastsuite/dist/PodcastSuite";
import Header from "./Header";
import Library from "./Library";
import Podcast from "./Podcast";
import Player from "./Player";

import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import { IEpisode } from "podcastsuite/dist/Format";
import { AudioState } from "src/Audio";
import Discovery from "./Discovery";
import Search from "./Search";

import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export type IPodcast = IPodcastSuitePodcast;

export interface IAppProps {
  collection: IPodcast[];
  episode: IEpisode;
  audioState: AudioState;
}

export type IAppContext = Partial<IAppProps>;

export const AppContext = React.createContext<IAppContext>({
  collection: [],
});

export default function App(props: IAppProps) {
  const { collection, episode, audioState } = props;

  return (
    <ThemeProvider theme={theme}>
      <AppContext.Provider value={{ collection, episode, audioState }}>
        <Router>
          <Switch>
            <Route path="/podcast/:podcast">
              <Podcast />
            </Route>
            <Route path="/discovery">
              <Header back title="Discovery" />
              <Discovery />
            </Route>
            <Route path="/search">
              <Header title="Search" />
              <Search />
            </Route>
            <Route path="/">
              <Header title="Library" />
              <Library />
            </Route>
          </Switch>
        </Router>
        <Player />
      </AppContext.Provider>
    </ThemeProvider>
  );
}
