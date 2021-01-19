import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export const clearText = (html: string) => {
  let tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText;
};

dayjs.extend(relativeTime);
const today = dayjs();

export const dateFrom = (date: number) => today.from(date, true);
