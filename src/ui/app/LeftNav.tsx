import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MapIcon from '@mui/icons-material/Map';

interface LeftNavProps {
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    open: boolean;
}

export default ({onClose, open}: LeftNavProps) => (
  <div>
    <React.Fragment>
      {/* <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button> */}
      <Drawer
        // anchor={anchor}
        open={open}
        onClose={() => onClose(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => null}
        //   onKeyDown={() => null}
        >
          <List>
            <ListItem color={'primary'}>
              <ListItemText primary={"Phonograph"} />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button>
              <ListItemIcon>
                <MapIcon />
              </ListItemIcon>
              <ListItemText primary={"Discover"} />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </React.Fragment>
  </div>
);
