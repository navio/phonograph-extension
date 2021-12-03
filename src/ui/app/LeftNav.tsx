import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import { useHistory } from "react-router-dom";
import { Typography } from "@mui/material";



interface LeftNavProps {
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    open: boolean;
}

export default ({onClose, open}: LeftNavProps) => {
    let history = useHistory();
    const redirect = (name) => history.push(`/${name}`);
  
    return (
  <div>
    <React.Fragment>
      <Drawer
        open={open}
        onClose={() => onClose(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => null}
        >
          <List>
            <ListItem color={'primary'}>
              <ListItemText primary={"Sections"} />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button onClick={() => {redirect('discovery'); onClose(false)} }>
              <ListItemIcon>
                <TravelExploreIcon />
              </ListItemIcon>
              <ListItemText primary={"Discover"} />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <BookmarksIcon />
              </ListItemIcon>
              <ListItemText primary={"Library"} onClick={() => {redirect('/'); onClose(false);}}/>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </React.Fragment>
  </div>
);
    }
