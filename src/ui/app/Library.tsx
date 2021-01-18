import React, { useContext, useState } from "react";
import { AppContext, IPodcast } from "./index";
import imageFetcher from "../utils/imageSaver";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
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
      backgroundColor: theme.palette.secondary.light,
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
    imageFetcher(podcast.image, { media: true }).then((media) => {
      setImage(typeof media === "string" ? media : media.url);
    });
  }, []);
  return (
    <Link to={`/podcast/${btoa(podcast.url)}`} className={classes.gridElement}>
      <img src={image} title={podcast.title} className={classes.images} />
    </Link>
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
