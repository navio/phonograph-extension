import React, { useState, useEffect, useContext } from "react";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { IPodcast } from "..";

import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import HeadsetIcon from "@mui/icons-material/Headset";
import CheckIcon from "@mui/icons-material/Check";
import EpisodeDisplay from "./EpisodeDisplay";

import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";

import { clearText, dateFrom, displayEpisode, displayTime, durationDisplay } from "ui/utils/stringsTools";
import { IEpisode } from "podcastsuite/dist/Format";
import { PodcastImage } from "ui/utils/imageSaver";

import { AppContext } from "../index";
import AudioButton from "ui/common/AudioButton";
import { IMemoryEpisodes, IMemoryPodcast, IMemoryState } from "lib/Memory";
import ActionMenu from "./ActionMenu";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: theme.palette.background.paper,
      justifyContent: "center",
      color: theme.palette.text.primary,
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
  onClick: React.MouseEventHandler<HTMLDivElement>;
}) => {
  const { episode, listened } = props;
  return (
    <ListItemText
      onClick={props.onClick}
      primary={
        <>
          {episode.season && (
            <Typography component={"span"} color={"secondary"}>
              S{episode.season}
            </Typography>
          )}
          {episode.episode && (
            <Typography component={"span"} color={"secondary"}>
              { displayEpisode(episode.episode)}
            </Typography>
          )}
          <Typography component="span" variant="subtitle1" noWrap>
            {clearText(episode.title)}
          </Typography>
          {episode?.duration && <Typography color={"primary"} component={"span"} variant="subtitle2" >
            {" "}{durationDisplay(''+episode.duration)}
          </Typography>}
        </>
      }
      secondary={
        <>
          {dateFrom(episode.created)}{" "}
          {episode.episodeType && episode.episodeType !== "full" && (
            <Chip
              style={{ marginLeft: "10px", textTransform: "capitalize" }}
              variant="outlined"
              size="small"
              label={episode.episodeType}
              color="secondary"
            />
          )}
          {listened ? (
            <Chip
              color={listened.completed ? "default" : "info"}
              style={{ marginLeft: "5px" }}
              size="small"
              variant="outlined"
              icon={listened.completed ? <CheckIcon /> : <HeadsetIcon />}
              label={
                listened.completed
                  ? "Completed"
                  : `${displayTime(listened.lastPosition)}`
              }
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
            <ListItem button>
              <AudioButton
                color={image.colors[0]}
                audioState={audioState}
                currentEpisode={selectedEpisode}
                episode={episode}
                podcastURL={podcast.url}
              />
              <EpisodeListDescription
                onClick={() => setClickedEpisode(episode)}
                listened={listened[episode.guid]}
                episode={episode}
              />
              <ListItemSecondaryAction>
                <ActionMenu episode={{ ...episode, time: 0 }}>
                  <MoreVertIcon />
                </ActionMenu>
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
        open={!!clickedEpisode}
      />
    </div>
  );
}
