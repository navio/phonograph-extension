import { OPTIONS_EVENTS, InitializeOptionsResponse } from "../types";

export const initializeOptionsResponse = (
  id: string
): InitializeOptionsResponse => ({
  action: OPTIONS_EVENTS.INITIALIZATION,
  payload: { id },
});
