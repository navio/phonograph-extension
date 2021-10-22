import React, { ReactComponentElement } from 'react';
import { Theme, createStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Replay10Icon from '@material-ui/icons/Replay10';
import Forward30Icon from '@material-ui/icons/Forward30';
import { messageBackgroundAction, openOptionsPage } from 'background/actions';
import { contrastColor, getRGB, getRGBA } from 'ui/utils/color';
import { PodcastImage } from 'ui/utils/imageSaver';
import { messagePlayerAction, Triggers } from "player/actions";

const openOptions = () => messageBackgroundAction(openOptionsPage(),() => {});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      height: 152
    },
    details: {
      display: 'flex',
      flexDirection: 'column',
      width: 235
    },
    content: {
      flex: '1 0 auto',
      padding: '.5rem',
      paddingBottom: 0
    },
    cover: {
      width: 151,
      height: 151
    },
    controls: {
      display: 'flex',
      alignItems: 'center',
      margin: '0 auto',
      // paddingBottom: theme.spacing(1),
    },
    titleName: {
      minHeight: 35,
      maxHeight: 50,
      overflowY: 'hidden'
    },
    playIcon: {
      height: 38,
      width: 38,
    },
  }),
);

interface PlayerCardProps{
    title: string;
    name: string;
    image: string;
    PlayerButton: JSX.Element
    background?: PodcastImage;
    imageClick: () => void;
}

const forwardButtonHandler = () => messagePlayerAction(Triggers.fastforwad(30), (response) => {});
const rewindsButtonHandler = () => messagePlayerAction(Triggers.rewind(10), (response) => {});


export default ({title, name, image, PlayerButton, imageClick, background } : PlayerCardProps) => {
  const classes = useStyles();
  console.log(background);
  return (
    <div className={classes.root} style={{backgroundColor: background ? getRGBA(background.colors[3]) : 'white' }} >
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography className={classes.titleName} style={{'color':contrastColor(background.colors[3])}} 
            align="center" component="h1" variant="body1">
           {title}
          </Typography>
          <Typography noWrap variant="body1" align="center" color="textSecondary">
            {name}
          </Typography>
        </CardContent>
        <div className={classes.controls}>
          <IconButton onClick={rewindsButtonHandler} aria-label="previous">
            <Replay10Icon fontSize="large"  />
          </IconButton>
          { PlayerButton}
          <IconButton onClick={forwardButtonHandler} aria-label="next">
            <Forward30Icon fontSize="large" />
          </IconButton>
        </div>
      </div>
      <CardMedia
        onClick={() => imageClick()}
        className={classes.cover}
        image={image}
        title={name}
      />
    </div>
  );
}