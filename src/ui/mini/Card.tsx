import React, { ReactComponentElement } from 'react';
import { Theme, createStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import background from 'background/reducer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    details: {
      display: 'flex',
      flexDirection: 'column',
      width: '235px'
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
      paddingBottom: theme.spacing(1),
    },
    titleName: {
      height: 50,
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
    background?: string;
}

export default ({title, name, image, PlayerButton} : PlayerCardProps, background = '000') => {
  const classes = useStyles();

  return (
    <Card className={classes.root} raised>
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography className={classes.titleName} align="center" component="h1" variant="body1">
           {title}
          </Typography>
          <Typography noWrap variant="body1" align="center" color="textSecondary">
            {name}
          </Typography>
        </CardContent>
        <div className={classes.controls}>
          <IconButton aria-label="previous">
            <SkipPreviousIcon />
          </IconButton>
          { PlayerButton}
          <IconButton aria-label="next"><SkipNextIcon />
          </IconButton>
        </div>
      </div>
      <CardMedia
        className={classes.cover}
        image={image}
        title={name}
      />
    </Card>
  );
}