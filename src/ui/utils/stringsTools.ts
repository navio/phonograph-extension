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

export const displayTime = (time): string => {
  const allSeconds = +Number.parseFloat(time).toFixed();
  if (Number.isNaN(allSeconds)) return "∞";

  let seconds, minutes, hours;
  seconds = minutes = hours = 0;


  seconds = allSeconds % 60;
  console.log(allSeconds);
  const remainingSeconds = Math.floor(allSeconds / 60);

  if (remainingSeconds > 0) {
    minutes = remainingSeconds % 60;
    const remainingMinutes = Math.floor(remainingSeconds / 60);

    if (remainingMinutes > 0) {
      hours = Math.floor(remainingMinutes / 60);
    }
  }

  const singleDigitRule = (number: number): string =>
    number < 10 ? `0${number}` : `${number}`;

  const secondsDisplay = singleDigitRule(seconds);
  const minutesDisplay = singleDigitRule(minutes);
  const hoursDisplay = hours > 0 ? `${singleDigitRule(hours)}:` : "";

  return `${hoursDisplay}${minutesDisplay}:${secondsDisplay}`;
};