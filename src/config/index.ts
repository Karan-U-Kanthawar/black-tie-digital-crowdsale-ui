import BigNumber from "bignumber.js/bignumber";

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

export const BLACK_TIE_DIGITAL_PRESALE_ID =
  "0x32d210761e36CC073c2D38dc7A8c67d65D1C9EF1";

export const crowdsale = {
  owner: "0xb60B993862673A87C16E4e6e5F75397131EEBb3e",
  token: {
    address: "0x286881d76b77617e5f5c6bc5a4c0a373ba9d297d",
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
    address: "0x671b68fb02778d37a885699da79c13faf0d3c560",
    // Get from contract dynamically
    tokenRate: "2.857142857142857",
    userBalance: "0",
  },
  {
    name: "USDT",
    symbol: "USDT",
    decimals: 6,
    address: "0xd89a2e56b778aefe719fc86e122b7db752bb6b41",
    // Get from contract dynamically
    tokenRate: "2.857142857142857",
    userBalance: "0",
  },
];

export const BLACK_TIE_DIGITAL_SOCIALS = {
  address: BLACK_TIE_DIGITAL_PRESALE_ID,
  twitter: {
    username: "CryptionNetwork",
    link: "https://twitter.com/B4Real_Official",
  },
  telegram: {
    username: "CryptionNetwork",
    link: "https://t.me/blacktiedigital",
  },
  whitepaper: {
    username: "Cryption Network",
    link: "https://b4real.s3.ap-southeast-2.amazonaws.com/B4REAL+White+Paper+(v1).pdf",
  },
  vestingInfo:
    "20% of the token will be given on 31st Jan & the remaining will be linearly vested for 6 months.",
};
