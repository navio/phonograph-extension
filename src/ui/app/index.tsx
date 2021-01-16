import React, { useEffect } from "react";
import { IPodcast as IPodcastSuitePodcast } from "podcastsuite/dist/PodcastSuite";
import Header from "./Header";
import Library from "./Library";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";

export type IPodcast = IPodcastSuitePodcast;
export type ILibrary = Map<string, IPodcast>;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      // flexGrow: 1,
    },
  })
);

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

export default function SearchAppBar(props: IAppProps) {
  const library = new Map<string, IPodcast>()
  const classes = useStyles();
  const { collection } = props;

  useEffect(() => {
    collection.forEach((podcast) => library.set(podcast.url, podcast));
  }, [collection]);

  return (
    <AppContext.Provider value={{ library, collection }}>
      <div>
        <Header />
        <Library />
      </div>
    </AppContext.Provider>
  );
}
