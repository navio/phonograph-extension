import React, { useContext } from 'react';
import { AppContext} from "./index";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    images: {
        width: `10vw`,
        height: `10vw`
    },
    gridElement: {
        backgroundColor: `red`,
        width: `10vw`,
        height: `10vw`,
        display: `block`,
    },
    grid: {
        display: `flex`,
        flexFlow: `row wrap`,
    }
  })
);


export default () => {
    const { collection } = useContext(AppContext);
    const classes = useStyles()
    return <div className={classes.grid}>
    {collection.map((podcast) => (
      <a href={`#`} className={classes.gridElement}>
        <img src={podcast.image} title={podcast.title} className={classes.images} /> 
      </a>
    ))}
  </div>
};