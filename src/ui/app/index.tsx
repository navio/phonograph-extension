import React, { useEffect, useState } from "react";
import { IPodcast as IPodcastSuitePodcast } from "podcastsuite/dist/PodcastSuite";
import Header from "./Header";
import Library from "./Library";
import Podcast from "./Podcast";

import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";

export type IPodcast = IPodcastSuitePodcast;
export type ILibrary = {[key:string]: IPodcast};

export const AppContext = React.createContext<{
  collection: IPodcast[];
  library: ILibrary;
}>({
  collection: [],
  library: undefined,
});

export interface IAppProps {
  collection: IPodcast[];
}

export default function App(props: IAppProps) {
  const [library, setLibrary ] = useState<ILibrary>({});
  const { collection } = props;

  useEffect(() => {
    collection.forEach((podcast) => library[podcast.url] =  podcast);
    setLibrary(library)
  }, [collection]);
  return (
    <AppContext.Provider value={{ library, collection }}>
      <Router>
        <Switch>
          <Route path="/podcast/:podcast">
            <Header />
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
