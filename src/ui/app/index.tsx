import React, { useEffect } from "react";
import { IPodcast as IPodcastSuitePodcast } from "podcastsuite/dist/PodcastSuite";
import Header from "./Header";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";

export type IPodcast = IPodcastSuitePodcast;
export type ILibray = Map<string, IPodcast>;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
  })
);

export const AppContext = React.createContext<{
  collection: IPodcast[];
  library: ILibray;
}>({
  collection: [],
  library: undefined,
});

export const Consumer = AppContext.Consumer;
export interface IAppProps {
  collection: IPodcast[];
}

export default function SearchAppBar(props: IAppProps) {
  const classes = useStyles();
  const library = new Map<string, IPodcast>();
  const { collection } = props;
  useEffect(() => {
    collection.forEach((podcast) => library.set(podcast.url, podcast));
  }, [collection]);
  return (
    <AppContext.Provider value={{ library, collection }}>
      <div className={classes.root}>
        <Header />
        <ul>
          {collection.map((podcast: IPodcast) => (
            <li>
              {podcast.title} <br /> {podcast.summary}
            </li>
          ))}
        </ul>
      </div>
    </AppContext.Provider>
  );
}
