const browser = chrome;
export default {
  instance: browser,
  setTitle: (title: string) => browser.action.setTitle({ title }),

  setClickToPopup: (popup = "popup.html") =>
    browser.action.setPopup({ popup }),

  setClickToOption: (url = "options.html") =>
    browser.action.onClicked.addListener(() =>
      browser.tabs.create({ url })
    ),
  openOptionPage: (url = "options.html") => browser.tabs.create({ url }),
};
