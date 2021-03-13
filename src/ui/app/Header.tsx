import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import {
  createStyles,
  fade,
  Theme,
  makeStyles,
} from "@material-ui/core/styles";
import HeadsetIcon from "@material-ui/icons/Headset";
import SearchIcon from "@material-ui/icons/Search";
import { PodcastImage } from "ui/utils/imageSaver";
import { COLORS, contrastColor, getRGBA } from "ui/utils/color";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      display: "none",
      [theme.breakpoints.up("sm")]: {
        display: "block",
      },
    },
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
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
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: "12ch",
        "&:focus": {
          width: "20ch",
        },
      },
    },
  })
);

export default function SearchAppBar(props: {
  media?: PodcastImage;
  back?: boolean;
  title?: string;
}) {
  const [query, setQuery] = useState<string>("");
  const classes = useStyles();
  const { media, back = false, title = "Phonograph" } = props;
  let history = useHistory();
  const overwrite = media
    ? {
        backgroundColor: getRGBA(media.colors[1], 0.8),
        color: contrastColor(media.colors[1]),
      }
    : {};

  const searchHandler = (event) => {
    var enterKey = 13;
    if (event.which == enterKey) {
      history.push(`/search?q=${query}`);
    }
  };
  return (
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
              }
            }}
          >
            {back ? <ArrowBackIcon /> : <HeadsetIcon />}
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            {title}
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              style={
                overwrite.color === COLORS.black
                  ? { border: `1px solid darkgray`, borderRadius: "inherit" }
                  : {
                      border: `1px solid lightgray`,
                      borderRadius: "inherit",
                      fontWeight: "bold",
                    }
              }
              onKeyUp={searchHandler}
              onChange={(ev) => setQuery(ev.currentTarget.value)}
              inputProps={{ "aria-label": "search" }}
            />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
