import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { IEpisodeState } from "lib/State";
import styled from "styled-components";
import AudioButton from "ui/common/AudioButton";
import HeadsetIcon from "@mui/icons-material/Headset";
import { AppContext } from ".";
import { Chip, IconButton, ListItemSecondaryAction } from "@mui/material";
import { displayTime } from "ui/utils/stringsTools";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import { IEpisode } from "podcastsuite/dist/Format";
import { messagePlaylistAction, removeEpisode } from "playlist/actions";

interface PlayList {
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  episodes: IEpisodeState[];
}

const dequeueEpisode = (episode: IEpisode) => {
  messagePlaylistAction(removeEpisode(episode), () => {});
};

const EpisodeImage = styled.img`
  width: 3rem;
`;

export default ({ onClose, open, episodes }: PlayList) => {
  const { audioState, episode: currentEpisode } = React.useContext(AppContext);
  if (episodes.length === 0) {
    onClose(false);
  }
  return (
    <div>
      <React.Fragment>
        <Drawer open={open} onClose={() => onClose(false)} anchor="right">
          <Box sx={{ width: "40vw" }} role="presentation" onClick={() => null}>
            <List>
              {episodes.map((episode) => (
                <ListItem
                  button
                  onClick={() => {
                    onClose(false);
                  }}
                >
                  <ListItemIcon>
                    {/* <EpisodeImage src={episode.image} /> */}
                    <AudioButton
                      audioState={audioState}
                      episode={episode}
                      currentEpisode={currentEpisode}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={episode.title}
                    secondary={
                      <>
                        {episode.time > 0 ? (
                          <Chip
                            size="small"
                            icon={<HeadsetIcon />}
                            color="info"
                            label={displayTime(episode.time)}
                          />
                        ) : null}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => dequeueEpisode(episode)}>
                      <PlaylistRemoveIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </React.Fragment>
    </div>
  );
};
