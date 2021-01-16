import React, { useContext, useState } from "react";
import { AppContext, IPodcast } from "./index";
import imageFetcher from "../utils/imageSaver";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    images: {
      width: `10vw`,
      height: `10vw`,
    },
    gridElement: {
      backgroundColor: `lightgray`,
      width: `10vw`,
      height: `10vw`,
      display: `block`,
    },
    grid: {
      display: `flex`,
      flexFlow: `row wrap`,
    },
  })
);

const PodcatImage = (props: { podcast: IPodcast }) => {
  const { podcast } = props;
  const classes = useStyles();
  const [image, setImage] = useState<string>("");
  React.useEffect(() => {
    imageFetcher(podcast.image).then(setImage);
  }, []);
  return (
    <a href={`#`} className={classes.gridElement}>
      <img src={image} title={podcast.title} className={classes.images} />
    </a>
  );
};

export default () => {
  const { collection } = useContext(AppContext);
  const classes = useStyles();
  return (
    <div className={classes.grid}>
      {collection.map((podcast) => (
        <PodcatImage podcast={podcast} />
      ))}
    </div>
  );
};
