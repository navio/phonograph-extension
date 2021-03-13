import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
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
