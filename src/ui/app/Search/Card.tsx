import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useHistory } from "react-router-dom";

const clearText = (html) => {
  let tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText;
};

const useStyles = makeStyles({
  root: {
    width: 320,
    // height: 400,
    marginBottom: 10
  },
  media: {
      width: `100%`,
      height: `100%`,
  },
  description:{
    overflow: 'scroll',
    height: 140,  
  },
  cardRoot:{
    height:185,
  },
  title:{
    overflow: 'hidden',
  }
});


interface MediaCardProps {
    id: string;
    title: string;
    image: string;
    description: string;
}
export default function MediaCard({title, image, description, id}: MediaCardProps) {
  const classes = useStyles();
  const rss = (id);
  const history = useHistory();
  return (
    <Card className={classes.root}>
      <CardActionArea onClick={() => history.push(`/podcast/${rss}`)}>
      <CardContent >
      <img src={image} title={title} className={classes.media} />
          <Typography noWrap variant="h5" className={classes.title} component="h2">
            {title}
          </Typography>
          <Typography noWrap variant="body2" color="textSecondary" component="p">
            {clearText(description)}
          </Typography>
        </CardContent>

      </CardActionArea>
      {/* <CardActions>
        <Button size="small" color="primary">
          Add
        </Button>
        <Button size="small" color="primary">
            View
        </Button>
      </CardActions> */}
    </Card>
  );
}
