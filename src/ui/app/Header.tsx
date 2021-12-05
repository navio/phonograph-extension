import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import ListIcon from "@mui/icons-material/List";
import InputBase from "@mui/material/InputBase";
import { alpha, Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import HeadsetIcon from "@mui/icons-material/Headset";
import SearchIcon from "@mui/icons-material/Search";
import { PodcastImage } from "ui/utils/imageSaver";
import { COLORS, contrastColor, getRGBA } from "ui/utils/color";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useHistory } from "react-router-dom";
import LeftNav from "./LeftNav";
import Badge from "@mui/material/Badge";
import {
  getEpisodes,
  listenPlayListBroadcast,
  messagePlaylistAction,
} from "playlist/actions";
import { IEpisodeState } from "lib/State";
import Playlist from "./Playlist";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      marginLet: "1rem",
      display: "none",
      textDecoration: "none",
      color: "white",
      fontSize: "x-large",
      [theme.breakpoints.up("sm")]: {
        display: "block",
      },
      flexGrow: 100,
    },
    discovery: {
      flexGrow: 1,
    },
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: alpha(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: "auto !important",
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    inputRoot: {
      color: "inherit",
    },
    inputInput: {
      padding: `${theme.spacing(1, 1, 1, 0)} !important`,
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}) !important`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: "17ch",
        "&:focus": {
          width: "20ch",
        },
      },
    },
  });
});

export default function SearchAppBar(props: {
  media?: PodcastImage;
  back?: boolean;
  title?: string;
}) {
  const [leftNav, setLeftNav] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [playlist, setPlaylist] = useState<IEpisodeState[]>([]);
  const [openPlaylist, setOpenPlaylist] = useState<boolean>(false);
  const classes = useStyles();
  const { media, back = false, title = "Phonograph" } = props;
  let history = useHistory();
  const overwrite = media
    ? {
        backgroundColor: getRGBA(media.colors[1], 0.8),
        color: contrastColor(media.colors[1]),
      }
    : {};

  useEffect(() => {
    listenPlayListBroadcast((message) => {
      const { payload } = message;
      const { playlist } = payload;
      if (playlist) {
        setPlaylist(playlist);
      }
      return true;
    });
  }, []);

  useEffect(() => {
    messagePlaylistAction(getEpisodes(), (message) => {
      const { episodes } = message.payload;
      setPlaylist(episodes);
    });
  }, history);

  const searchHandler = (event) => {
    var enterKey = 13;
    if (event.which == enterKey) {
      history.push(`/search?q=${query}`);
    }
  };

  return (
    <>
      <div className={classes.root}>
        <AppBar position="static" style={overwrite}>
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
              onClick={() => {
                if (back) {
                  history.push("/");
                } else {
                  setLeftNav(true);
                }
              }}
              size="large"
            >
              {back ? <ArrowBackIcon /> : <HeadsetIcon />}
            </IconButton>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search podcasts"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                style={
                  overwrite.color === COLORS.black
                    ? { border: `1px solid darkgray`, borderRadius: "inherit" }
                    : {
                        // border: `1px solid lightgray`,
                        borderRadius: "inherit",
                        fontWeight: "bold",
                        color: "white",
                      }
                }
                onKeyUp={searchHandler}
                onChange={(ev) => setQuery(ev.currentTarget.value)}
                inputProps={{ "aria-label": "search" }}
              />
            </div>
            <IconButton onClick={() => setOpenPlaylist(true)} title="playlist" disabled={playlist.length === 0}>
              <Badge badgeContent={playlist.length} color="primary">
                <ListIcon color={playlist.length === 0 ? "disabled" :"action"} />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
      </div>
      <LeftNav open={leftNav} onClose={setLeftNav} />
      <Playlist open={openPlaylist} onClose={setOpenPlaylist} episodes={playlist} />
    </>
  );
}
