import BigNumber from "bignumber.js/bignumber";

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

export const BLACK_TIE_DIGITAL_PRESALE_ID =
  "0xC332D369483d1c690b845D1545575A1a402c073E";

export const crowdsale = {
  owner: "0xb60B993862673A87C16E4e6e5F75397131EEBb3e",
  crowdsaleTokenAllocated: "100000000000000000000",
  maxUserAllocation: "10000000000000000000",
  token: {
    address: "0x286881d76b77617e5F5C6Bc5a4c0A373ba9d297d",
    name: "Apple",
    symbol: "Apple",
    url: "https://i.ibb.co/8D5r4Hp/CNT.png",
    decimals: 18,
  },
};

export const allowedInputTokens = [
  {
    name: "Mango",
    symbol: "Mango",
    decimals: 18,
    address: "0xA62EAD46A8AB6cce617fA3748869dBbde5756587",
    // Get from contract dynamically
    tokenRate: "0",
    userBalance: "0",
  },
];

export const BLACK_TIE_DIGITAL_SOCIALS = {
  address: BLACK_TIE_DIGITAL_PRESALE_ID,
  twitter: {
    username: "CryptionNetwork",
    link: "https://twitter.com/CryptionNetwork",
  },
  telegram: {
    username: "CryptionNetwork",
    link: "https://t.me/CryptionNetwork",
  },
  whitepaper: {
    username: "Cryption Network",
    link: "https://www.cryption.network/assets/docs/Cryption-Network-Litepaper.pdf",
  },
  vestingInfo:
    "20% of the token will be given on 31st Jan & the remaining will be linearly vested for 6 months.",
};
