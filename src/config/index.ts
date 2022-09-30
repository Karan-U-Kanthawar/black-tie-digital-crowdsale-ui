import BigNumber from "bignumber.js/bignumber";

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

export const NATIVE_TOKENS = {
  80001: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: "18",
  },
  137: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: "18",
  },
  1: {
    name: "ETH",
    symbol: "ETH",
    decimals: "18",
  },
  1287: {
    name: "Glimmer",
    symbol: "GLMR",
    decimals: "18",
  },
};

export const ROUND_OFF_DECIMALS_TO = 3;

export const SUPPORTED_NETWORK_IDS = [137, 80001];

// // TESTNET Addresses
// export const MAINNET_CHAINID = 80001;
// export const BLACK_TIE_DIGITAL_PRESALE_ID =
//   "0xE9e57Af61640bD4f34DBFAD4d61896523671Cce1";
// export const crowdsale = {
//   owner: "0x4274A49FBeB724D75b8ba7bfC55FC8495A15AD1E",
//   token: {
//     address: "0x625D8DcfAE53C3fba7670b82bF1A7c2C689C416F",
//     name: "B4REAL",
//     symbol: "B4RE",
//     url: "https://cryption-network-local.infura-ipfs.io/ipfs/QmYcftrjFV4qRGixg8FZekc4siPndaQyYX1oJoJ1U9ie2g",
//     decimals: 18,
//   },
// };
// export const allowedInputTokens = [
//   {
//     name: "USDC",
//     symbol: "USDC",
//     decimals: 6,
//     address: "0x671b68fb02778d37a885699da79c13faf0d3c560",
//     // Get from contract dynamically
//     tokenRate: "2.857142857142857",
//     userBalance: "0",
//   },
//   // {
//   //   name: "USDT",
//   //   symbol: "USDT",
//   //   decimals: 6,
//   //   address: "0xd89a2e56b778aefe719fc86e122b7db752bb6b41",
//   //   // Get from contract dynamically
//   //   tokenRate: "2.857142857142857",
//   //   userBalance: "0",
//   // },
// ];

export const MAINNET_CHAINID = 137;

export const BLACK_TIE_DIGITAL_PRESALE_ID =
  "0xd7845A6D97Cb997EEf4acAd95ABE20fDAb4fbBc4";

export const crowdsale = {
  owner: "0x240c439011770253a379e4fcd391761071c06bfb",
  token: {
    address: "0x3c27564e3161bbaA6E7d2f0320fa4BE77AED54da",
    name: "B4REAL",
    symbol: "B4RE",
    url: "https://cryption-network-local.infura-ipfs.io/ipfs/QmYcftrjFV4qRGixg8FZekc4siPndaQyYX1oJoJ1U9ie2g",
    decimals: 18,
  },
};

export const allowedInputTokens = [
  {
    name: "USDC",
    symbol: "USDC",
    decimals: 6,
    address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    // Get from contract dynamically
    tokenRate: "2.857142857142857",
    userBalance: "0",
  },
  {
    name: "USDT",
    symbol: "USDT",
    decimals: 6,
    address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    // Get from contract dynamically
    tokenRate: "2.857142857142857",
    userBalance: "0",
  },
];

export const BLACK_TIE_DIGITAL_SOCIALS = {
  address: BLACK_TIE_DIGITAL_PRESALE_ID,
  twitter: {
    username: "B4Real",
    link: "https://twitter.com/B4Real_Official",
  },
  telegram: {
    username: "B4Real",
    link: "https://t.me/blacktiedigital",
  },
  whitepaper: {
    username: "B4Real",
    link: "https://b4real.s3.ap-southeast-2.amazonaws.com/B4REAL+White+Paper+(v1).pdf",
  },
  vestingInfo:
    "20% of the token will be given on 31st Jan & the remaining will be linearly vested for 6 months.",
};
