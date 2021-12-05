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
import { AppContext } from ".";

interface PlayList {
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  episodes: IEpisodeState[];
}

const EpisodeImage = styled.img`
    width: 3rem;
`;

export default ({ onClose, open, episodes }: PlayList) => {
    const { audioState, episode: currentEpisode } = React.useContext(AppContext);
  return (
    <div>
      <React.Fragment>
        <Drawer open={open} onClose={() => onClose(false)} anchor="right">
          <Box sx={{ width: '40vw' }} role="presentation" onClick={() => null}>
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
                    <AudioButton audioState={audioState} episode={episode} currentEpisode={currentEpisode} />
                  </ListItemIcon>
                  <ListItemText primary={episode.title} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </React.Fragment>
    </div>
  );
};
