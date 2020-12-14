import React, { useState, useEffect } from "react";
import {
  messageBackgroundAction,
  initializeOptions,
} from "../background/actions";
import { InitializeOptionsResponse } from "../types";

const App = () => {
  const [message, setMessage] = useState("");
  useEffect(() => {
    messageBackgroundAction(initializeOptions("hello"), (response: InitializeOptionsResponse) => {
      const { id } = response.payload;
      setMessage(id);
    });
  }, []);

  return <div>{message}</div>;
};

export default App;
