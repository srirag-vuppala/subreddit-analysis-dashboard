import { stickyWords } from "./constants";

export interface PostItem {
  created_utc: number;
  day: string;
  hour: number;
  title: string;
}

export function postsByDayOfWeek(arr: PostItem[]) {
  let counts = {
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
    Sunday: 0,
  };
  for (const val of arr) {
    counts[val.day] += 1;
  }
  let final = new Array();
  for (const [k, v] of Object.entries(counts)) {
    final.push({ day: k, count: v });
  }
  return final;
}

export function postsByHourOfDay(arr: PostItem[]) {
  let counts: number[] = new Array(24).fill(0);
  for (const val of arr) {
    counts[val.hour] += 1;
  }
  let final = new Array();
  for (let i = 0; i < 12; i++) {
    final.push({
      time: i + 1,
      AM: counts[i],
      PM: counts[i + 12],
      fullMark: counts.reduce((a, b) => Math.max(a, b), -Infinity),
    });
  }
  return final;
}

const pickHighest = (obj, num = 1) => {
  const requiredObj = {};
  if (num > Object.keys(obj).length) {
    return false;
  }
  Object.keys(obj)
    .sort((a, b) => obj[b] - obj[a])
    .forEach((key, ind) => {
      if (ind < num) {
        requiredObj[key] = obj[key];
      }
    });
  return requiredObj;
};

export function commonWordsInTitles(arr: PostItem[]) {
 
  //   Join all titles in a string
  let str = "";
  for (const val of arr) {
    str = str + " " + val.title;
  }

  str = str.toLowerCase();
  var splitUp = str.split(/\s/);
  let wordsArray = splitUp.filter(function (x) {
    return !stickyWords.includes(x.trim());
  });
  wordsArray = wordsArray.filter((element) => {
    return element !== "";
  });
  let wordOccurrences = {};
  for (let i = 0; i < wordsArray.length; i++) {
    wordOccurrences[wordsArray[i].trim().toLowerCase()] =
      (wordOccurrences[wordsArray[i].trim()] || 0) + 1;
  }

  let final = Object.entries(pickHighest(wordOccurrences, 10)).map((s, i) => ({
    name: s[0],
    size: s[1],
  }));

  return final;
}

export function commonLengthInTitles(arr: PostItem[]) {
  let allLengths = new Array();
  for (const val of arr) {
    var splitUp = val.title.split(/\s/);
    allLengths.push(splitUp.length);
  }
  const counts = {};
  for (const num of allLengths) {
    counts[num] = (counts[num] || 0) + 1;
  }
  let final = Object.entries(pickHighest(counts, 5)).map((s, i) => ({
    title_length: s[0],
    count: s[1],
  }));

  return final;
}
