import React, { useState, useEffect, useContext } from "react";
import { Theme } from "@mui/material/styles";
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import { IPodcast } from "..";

import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import HeadsetIcon from "@mui/icons-material/Headset";
import EpisodeDisplay from './EpisodeDisplay';

import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";

import { clearText, dateFrom, displayTime } from "ui/utils/stringsTools";
import { IEpisode } from "podcastsuite/dist/Format";
import { PodcastImage } from "ui/utils/imageSaver";

import { AppContext } from "../index";
import AudioButton from "ui/common/AudioButton";
import { IMemoryEpisodes, IMemoryPodcast, IMemoryState } from "lib/Memory";
import { AudioState } from "player/types";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: theme.palette.background.paper,
      justifyContent: "center",
      color: theme.palette.text.primary
    },
    list: {
      margin: "0 4rem",
    },
    mediaButton: {
      border: "1px solid",
      borderRadius: "2rem",
      padding: ".5rem",
    },
    listHeader: {
      margin: "0 4rem",
      paddingLeft: "1rem",
      marginTop: ".6rem",
    },
    listHeaderText: { ...theme.typography.subtitle1, fontWeight: "bold" },
  })
);

const EpisodeListDescription = (props: {
  episode: IEpisode;
  listened: IMemoryState;
  onClick: React.MouseEventHandler<HTMLDivElement>
}) => {
  const { episode, listened } = props;
  return (
    <ListItemText
      onClick={props.onClick}
      primary={
        <>
          {episode.season && (
            <Typography color={"secondary"}>Season {episode.season}</Typography>
          )}
          <Typography variant="overline" component="div">
            {episode.episodeType && episode.episodeType !== "full" && (
              <Chip
                style={{ marginLeft: "10px" }}
                variant="outlined"
                size="small"
                label={episode.episodeType}
                color="secondary"
              />
            )}
          </Typography>
          <Typography component="p" variant="subtitle1" noWrap>
            {clearText(episode.title)}
          </Typography>
        </>
      }
      secondary={
        <>
          {dateFrom(episode.created)}{" "}
          
          {listened ? (
            <Chip
              style={{ marginLeft: "5px" }}
              size="small"
              icon={<HeadsetIcon />}
              label={ listened.completed ? 'Completed' :`${displayTime(listened.lastPosition)}`}
            />
          ) : (
            ""
          )}
        </>
      }
    />
  );
};



export default function EpisodeList(props: {
  podcast: IPodcast;
  image: PodcastImage;
  listened: IMemoryEpisodes;
}) {
  const [amount, setAmount] = useState<number>(1);
  const classes = useStyles();
  const { podcast, image, listened } = props;
  const episodeList = podcast.items.slice(0, 20 * amount);
  const { episode: selectedEpisode, audioState } = useContext(AppContext);
  const [clickedEpisode, setClickedEpisode] = useState<IEpisode>();

  return (
    <div className={classes.root}>
      <Divider />
      <div className={classes.listHeader}>
        <span className={classes.listHeaderText}>
          {episodeList.length} of {podcast.items.length} Episodes
        </span>
      </div>
      <List component="nav" className={classes.list} aria-label="Podcasts">
        <Divider />
        {episodeList.map((episode) => (
          <>
            <ListItem button >
              <AudioButton
                color={image.colors[0]}
                audioState={audioState}
                currentEpisode={selectedEpisode}
                episode={episode}
                podcastURL={podcast.url}
              />
              <EpisodeListDescription onClick={()=>setClickedEpisode(episode)} 
                listened={listened[episode.guid]}
                episode={episode}
              />
              <ListItemSecondaryAction>
                <MoreVertIcon />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </>
        ))}
      </List>
      {podcast.items.length > episodeList.length && (
        <Button
          onClick={() => setAmount(amount + 1)}
          variant="outlined"
          style={{ margin: "1rem auto", width: "80%" }}
          size="large"
          color="primary"
        >
          {" "}
          Load More Episodes{" "}
        </Button>
      )}
      <EpisodeDisplay 
        episode={clickedEpisode}
        handleClose={() => setClickedEpisode(undefined)} 
        open={!!clickedEpisode} />
    </div>
  );
}
