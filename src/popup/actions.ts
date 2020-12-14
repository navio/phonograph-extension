import {
    POPUP_EVENTS,
    InitializePopUpResponse,
  } from "../types";

  export const initializeResponsePopUp = (
    id: string
  ): InitializePopUpResponse => ({
    action: POPUP_EVENTS.INITIALIZATION,
    payload: { id },
  });
