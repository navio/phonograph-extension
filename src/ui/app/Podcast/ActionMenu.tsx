import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import PlaylistAddCircleIcon from "@mui/icons-material/PlaylistAdd";
import PlaylistAddCheckCircleIcon from "@mui/icons-material/PlaylistAddCheck";
import CheckCircleIcon from "@mui/icons-material/Check";
import { addEpisode, messagePlaylistAction } from "playlist/actions";
import { IEpisodeState } from "lib/State";
import { messagePlayerAction, Triggers } from "player/actions";

interface ActionMenuProps {
  children: React.ReactElement<any, any>;
  episode: IEpisodeState;
}

export default function ActionMenu({
  children: Trigger,
  episode,
}: ActionMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const addEpisodeHandler = (episode: IEpisodeState, next: boolean = false) =>
    messagePlaylistAction(addEpisode(episode, next), console.log);

  const markAsPlayedHandler = (episode: IEpisodeState) => {
    messagePlayerAction(Triggers.markAsPlayed(episode), () => {});
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        {Trigger}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            addEpisodeHandler(episode);
          }}
        >
          <ListItemIcon>
            <PlaylistAddCheckCircleIcon />
          </ListItemIcon>
          Add to Playlist
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            addEpisodeHandler(episode, true);
          }}
        >
          <ListItemIcon>
            <PlaylistAddCircleIcon />
          </ListItemIcon>
          Add Next
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            markAsPlayedHandler(episode);
          }}
        >
          <ListItemIcon>
            <CheckCircleIcon />
          </ListItemIcon>
          Mark As Played
        </MenuItem>
      </Menu>
    </div>
  );
}
