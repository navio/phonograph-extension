import React, { useContext, useState } from "react";
import { AppContext, IPodcast } from "./index";
import imageFetcher from "ui/utils/imageSaver";
import Typography from "@mui/material/Typography";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { Link } from "react-router-dom";
import Styled from "styled-components";
import { TextField } from "@mui/material";

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
      {image && (
        <img src={image} title={podcast.title} className={classes.images} />
      )}
    </Link>
  );
};

const CenterContent = Styled.div`
  margin: 0px auto;
  margin-top: 30vh;
  text-align: center;
`;

const NoPodcasts = () => (
  <CenterContent>
    <Typography gutterBottom variant="h4">
      {" "}
      Get your favorite podcasts or find new ones.
    </Typography>
    {/* <TextField style={{width: '30vw'}} id="outlined-basic" label="Find your next Podcast" variant="outlined" /> */}
  </CenterContent>
);

export default () => {
  const { collection } = useContext(AppContext);
  const classes = useStyles();
  return (
    <div className={classes.grid}>
      {collection.map((podcast) => (
        <PodcatImage podcast={podcast} />
      ))}
      {/* {collection.length === 0 && <NoPodcasts />} */}
    </div>
  );
};
