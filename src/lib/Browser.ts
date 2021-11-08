const browser = chrome;
export default {
  instance: browser,
  setTitle: (title: string) => browser.browserAction.setTitle({ title }),

  setClickToPopup: (popup = "popup.html") =>
    browser.browserAction.setPopup({ popup }),

  setClickToOption: (url = "options.html") =>
    browser.browserAction.onClicked.addListener(() =>
      browser.tabs.create({ url })
    ),
  openOptionPage: (url = "options.html") => browser.tabs.create({ url }),
};
