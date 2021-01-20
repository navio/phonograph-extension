import React, { useEffect, useState } from "react";
import { IPodcast as IPodcastSuitePodcast } from "podcastsuite/dist/PodcastSuite";
import Header from "./Header";
import Library from "./Library";
import Podcast from "./Podcast";

import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";

export type IPodcast = IPodcastSuitePodcast;

export const AppContext = React.createContext<{
  collection: IPodcast[];
}>({
  collection: [],
});

export interface IAppProps {
  collection: IPodcast[];
}

export default function App(props: IAppProps) {
  const { collection } = props;

  return (
    <AppContext.Provider value={{ collection }}>
      <Router>
        <Switch>
          <Route path="/podcast/:podcast">
            <Podcast />
          </Route>
          <Route path="/">
            <Header />
            <Library />
          </Route>
        </Switch>
      </Router>
    </AppContext.Provider>
  );
}
