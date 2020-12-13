export enum BACKGROUND_EVENTS {
  INITIALIZATION = "INIT",
}

export enum POPUP_EVENTS {
  INITIALIZATION = "INIT",
}

export interface IState {
  message: IMessage;
  sender: chrome.runtime.MessageSender;
  sendResponse: (response?: any) => void;
}

export interface IMessage {
  [key: string]: any;
  action: string;
}

export interface InitializePopUp {
  action: typeof BACKGROUND_EVENTS.INITIALIZATION;
  payload: {
    id: string;
  };
}

export interface InitializePopUpResponse {
  action: typeof POPUP_EVENTS.INITIALIZATION;
  payload: {
    id: string;
  };
}

export type Actions = InitializePopUp;

export type ActionFn = (props: any) => Actions;
export type GenericFn = (data: any) => void;
