import React, { useContext, useState } from "react";
import { AppContext, IPodcast } from "./index";
import imageFetcher from "ui/utils/imageSaver";
import Typography from "@material-ui/core/Typography";
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
      backgroundColor: theme.palette.background.paper,
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
    imageFetcher(podcast.image).then((media) => {
     setImage(media.src);
    });
  }, []);
  return (
    <Link to={`/podcast/${btoa(podcast.url)}`} className={classes.gridElement}>
      {image && <img src={image} title={podcast.title} className={classes.images} />}
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
