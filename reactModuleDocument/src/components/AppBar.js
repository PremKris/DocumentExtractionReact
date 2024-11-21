import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    marginLeft: theme.spacing(2)
  }
}));

export default function AppMainBar() {
  const classes = useStyles();

  return (
    <AppBar position="static">
    </AppBar>
  );
}
