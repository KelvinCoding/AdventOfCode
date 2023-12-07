import { dirname } from "path";
import fs from "fs";

const __dirname = dirname(new URL(import.meta.url).pathname);

const input = fs.readFileSync(`${__dirname}/input.txt`, "utf-8").trim();

const testInput = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
`.trim();

function getCardHexValue(card, isPart2 = false) {
  switch (card) {
    case "A":
      return "E";
    case "K":
      return "D";
    case "Q":
      return "C";
    case "J":
      return isPart2 ? "0" : "B";
    case "T":
      return "A";
    case "9":
    case "8":
    case "7":
    case "6":
    case "5":
    case "4":
    case "3":
    case "2":
      return card;

    default:
      throw new Error("what?", card);
  }
}

const HandValueMap = {
  highCard: 0,
  onePair: 1,
  twoPair: 2,
  threeOfAKind: 3,
  fullHouse: 4,
  fourOfAKind: 5,
  fiveOfAKind: 6,
};

/**
 * @param {string} input
 */
function solve(input) {
  const { part1Data, part2Data } = parseInput(input);

  console.log({
    part1: getTotalWinnings(part1Data),
    part2: getTotalWinnings(part2Data),
  });
}

function parseInput(input) {
  return input.split("\n").reduce(
    (acc, line) => {
      const [cards, bid] = line.split(" ");

      const { cardCount, p1CardHex, p2CardHex } = [...cards].reduce(
        (acc, card) => {
          acc.cardCount[card] = (acc.cardCount[card] || 0) + 1;

          acc.p1CardHex += getCardHexValue(card);
          acc.p2CardHex += getCardHexValue(card, true);

          return acc;
        },
        {
          cardCount: [],
          p1CardHex: "",
          p2CardHex: "",
        }
      );
      acc.part1Data.push({
        cardCount,
        bid: Number(bid),
        handValue: getHandValue(cardCount),
        cardsHex: parseInt(p1CardHex, 16),
      });

      acc.part2Data.push({
        cardCount,
        bid: Number(bid),
        handValue: getHandValue(cardCount, true),
        cardsHex: parseInt(p2CardHex, 16),
      });

      return acc;
    },
    {
      part1Data: [],
      part2Data: [],
    }
  );
}

function getTotalWinnings(cardsAndBids) {
  const sortedCards = cardsAndBids.sort((a, b) => {
    return a.handValue - b.handValue || a.cardsHex - b.cardsHex;
  });

  const winnings = sortedCards.reduce((total, card, index) => {
    return total + card.bid * (index + 1);
  }, 0);

  return winnings;
}

function getHandValue(cardCount, isPart2 = false) {
  const jokerCount = isPart2 ? cardCount["J"] || 0 : 0;
  const counts = Object.entries(cardCount).reduce((acc, [card, count]) => {
    if (card !== "J" || !isPart2) {
      acc.push(count);
    }

    return acc;
  }, []);

  const maxCardCount = counts.length ? Math.max(...counts) || 0 : 0;

  if (maxCardCount + jokerCount === 5) {
    return HandValueMap.fiveOfAKind;
  }

  if (maxCardCount + jokerCount === 4) {
    return HandValueMap.fourOfAKind;
  }

  // Full House
  if (maxCardCount === 3 && jokerCount === 0) {
    return counts.includes(2)
      ? HandValueMap.fullHouse
      : HandValueMap.threeOfAKind;
  }

  if (maxCardCount === 2) {
    const pairCount = counts.filter((count) => count === 2).length;

    if (pairCount === 2 && jokerCount === 1) {
      return HandValueMap.fullHouse;
    }

    if (pairCount === 2 && jokerCount === 0) {
      return HandValueMap.twoPair;
    }

    if (pairCount === 1 && jokerCount === 1) {
      return HandValueMap.threeOfAKind;
    }

    return HandValueMap.onePair;
  }

  if (maxCardCount === 1 && jokerCount == 2) {
    return HandValueMap.threeOfAKind;
  }

  if (maxCardCount === 1 && jokerCount == 1) {
    return HandValueMap.onePair;
  }

  return HandValueMap.highCard;
}

solve(testInput); // { part1: 6440, part2: 5905 }
solve(input); // { part1: 248113761, part2: 246285222 }
