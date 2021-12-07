import * as React from "react";
import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { IEpisode } from "podcastsuite/dist/Format";
import Styled from "styled-components";
import { useTheme } from "@mui/material/styles";
import { Chip, Typography } from "@mui/material";
import { displayTime, durationDisplay } from "ui/utils/stringsTools";

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';

const EpisodeImage = Styled.img`
  height: 50vh;
  padding-bottom: 1.5rem;
  margin: 0 auto;
  display: block;
`;

interface EpisodeProps {
  open: boolean;
  handleClose: () => void;
  episode: IEpisode;
}

export default ({ handleClose, open = false, episode }: EpisodeProps) => {
  const theme = useTheme();
  const Content = Styled.div`
    a {
      color: ${theme.palette.primary.main}
    }
`;
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={"paper"}
        fullWidth={true}
        maxWidth={"md"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        {episode?.title && (
          <DialogTitle id="scroll-dialog-title">{episode.title}</DialogTitle>
        )}
        <DialogContent>
          {episode?.image && <EpisodeImage src={episode.image} />}
          <Typography gutterBottom>
            {episode?.duration && (
              <Chip
                style={{ marginLeft: "10px", textTransform: "capitalize" }}
                size="medium"
                icon={<AccessTimeIcon />}
                label={durationDisplay(episode.duration+"")}
                color="primary"
              />
            )}
            {episode?.episodeType && (
              <Chip
                style={{ marginLeft: "10px", textTransform: "capitalize" }}
                size="medium"
                label={episode.episodeType}
                color="primary"
              />
            )}
            {episode?.season && (
              <Chip
                style={{ marginLeft: "10px", textTransform: "capitalize" }}
                size="medium"
                label={'Season '+episode.season}
                color="primary"
              />
            )}
            {episode?.episode! && (
              <Chip
                style={{ marginLeft: "10px", textTransform: "capitalize" }}
                size="medium"
                label={'Episode '+episode.episode}
                color="primary"
              />
            )}

          </Typography>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            <Content
              dangerouslySetInnerHTML={{ __html: episode?.description }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
