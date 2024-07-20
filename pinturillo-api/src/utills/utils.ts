import { Rooms } from "@src/entities/entities";
import { WORDS } from "./constants";

export const getRoomsAvailables = (rooms: Rooms): Rooms => {
  const roomsAvailables = Object.fromEntries(
    Object.entries(rooms).filter(
      ([_, value]) =>
        value.players.length !== value.configuration.slots && !value.started
    )
  );

  return roomsAvailables;
};

export const getRandomIndex = <T>(item: string | T[]): number => {
  const randomIndex = Math.floor(Math.random() * item.length);
  return randomIndex;
};

export const replaceChar = (
  origString: string,
  replaceChar: string,
  index: number
) => {
  const firstPart = origString.slice(0, index);
  const lastPart = origString.slice(index + 1);
  const newString = firstPart + replaceChar + lastPart;

  return newString;
};

export const getFourRandomWords = (): Promise<string[]> => {
  const words = [...WORDS];

  return new Promise((resolve) => {
    const wordsToChoose: string[] = [];

    while (wordsToChoose.length < 4) {
      const randomIndex = getRandomIndex<string>(words);
      const word = words[randomIndex];
      words.splice(randomIndex, 1);

      wordsToChoose.push(word);
    }

    resolve(wordsToChoose);
  });
};

export const generateWordPlaceholder = (word: string): string => {
  return word.replace(/[A-Za-z]/g, "_");
};

export const revealLetter = (
  word: string,
  wordPlaceholder: string
): Promise<string> => {
  return new Promise((resolve) => {
    const indexUsed: number[] = [];
    const wordPlaceholderWithoutSpaces = wordPlaceholder.replace(/\s/g, "");

    let letterReplaced = false;

    while (!letterReplaced) {
      const randomIndex = getRandomIndex(word);
      const letterToReplace = word[randomIndex];

      if (word === wordPlaceholderWithoutSpaces) {
        resolve(word.split("").join(" "));
        break;
      }

      if (
        wordPlaceholderWithoutSpaces[randomIndex].trim() ===
          letterToReplace.trim() ||
        indexUsed.includes(randomIndex)
      ) {
        indexUsed.push(randomIndex);
        continue;
      }

      const wordPlaceholder = replaceChar(
        wordPlaceholderWithoutSpaces,
        letterToReplace,
        randomIndex
      );

      resolve(wordPlaceholder.split("").join(" "));
      break;
    }
  });
};
