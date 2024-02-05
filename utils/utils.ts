import { Alchemy, Network } from "alchemy-sdk";

const config = {
  apiKey: "XITKHvItMhhVRr55ED8Uvh2vjtahxHwe",
  network: Network.ETH_MAINNET,
};

const minute = 60;
const hour = 60 * 60;
const day = 60 * 60 * 24;

export const alchemy = new Alchemy(config);

export const format = (account: string) => `${account.slice(0, 5)}...${account.slice(-5)}`;

export const timeFormat = (timestamp: number) => {
  const time = Math.floor(Date.now() / 1000) - timestamp;
  switch (true) {
    case time < minute:
      return `${time} secs ago`;
    case time < hour:
      return `${Math.floor(time / 60)} min ${time % 60} secs ago`;
    case time < day:
      return `${Math.floor(time / hour)} hrs ${Math.floor((time % hour) / minute)} mins ago`;
    default:
      return `${Math.floor(time / day)} days ago`;
  }
};

export const blockStatus = (finalized: number, current: number) => {
  switch (true) {
    case finalized >= current:
      return "finalized";
    case current - finalized <= 32:
      return "safe";
    default:
      return "latest"; //unfinalized
  }
};

// export const blockStatus = (blockNum, timestamp) => {
//   let slot = blockNum % 32;
//   let checkPointTimestamp = slot === 0 ? timestamp : (32 - slot) * 12 + timestamp;
//   let elapsedTime = Math.floor(Date.now() / 1000) - checkPointTimestamp;
//   let epochTime = 6.4 * minute;
//   switch (true) {
//     case elapsedTime >= 2 * epochTime:
//       return "finalized";
//     case elapsedTime >= epochTime:
//       return "safe";
//     default:
//       return "latest";
//   }
// };
