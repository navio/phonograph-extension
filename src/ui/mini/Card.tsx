import React, { ReactComponentElement } from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Replay10Icon from '@mui/icons-material/Replay10';
import Forward30Icon from '@mui/icons-material/Forward30';
import { messageBackgroundAction, openOptionsPage } from 'background/actions';
import { contrastColor, getRGB, getRGBA } from 'ui/utils/color';
import { PodcastImage } from 'ui/utils/imageSaver';
import { messagePlayerAction, Triggers } from "player/actions";

const openOptions = () => messageBackgroundAction(openOptionsPage(),() => {});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      height: 152,
      opacity: '.84'
    },
    details: {
      display: 'flex',
      flexDirection: 'column',
      width: 235
    },
    content: {
      flex: '1 0 auto',
      padding: '6px !important',
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
  return (
    <div className={classes.root} style={{backgroundColor: background ? getRGBA(background.colors[0]) : 'white' }} >
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography className={classes.titleName} style={{'color':contrastColor(background.colors[0])}} 
            align="center" component="h1" variant="body1">
           {title}
          </Typography>
          <Typography noWrap variant="body1" align="center" color="textSecondary">
            {name}
          </Typography>
        </CardContent>
        <div className={classes.controls}>
          <IconButton onClick={rewindsButtonHandler} aria-label="previous" size="large">
            <Replay10Icon fontSize="large"  />
          </IconButton>
          { PlayerButton}
          <IconButton onClick={forwardButtonHandler} aria-label="next" size="large">
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