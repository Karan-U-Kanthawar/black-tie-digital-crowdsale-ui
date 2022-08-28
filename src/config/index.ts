import BigNumber from "bignumber.js/bignumber";

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});
export const setMetamaskGasPrice = {
  maxPriorityFeePerGas: null,
  maxFeePerGas: null,
};
export const CAKE_PER_BLOCK = new BigNumber(0.75);
export const BLOCKS_PER_YEAR = new BigNumber(15768000);
export const SECONDS_PER_YEAR = new BigNumber(31536000);
export const BSC_BLOCK_TIME = 2.1;
export const CAKE_POOL_PID = 0;
export const BASE_URL = "https://pancakeswap.finance";
export const BASE_EXCHANGE_URL = "https://exchange.pancakeswap.finance";
export const BASE_ADD_LIQUIDITY_URL = `${BASE_EXCHANGE_URL}/#/add`;
export const BASE_LIQUIDITY_POOL_URL = `${BASE_EXCHANGE_URL}/#/pool`;
export const LOTTERY_MAX_NUMBER_OF_TICKETS = 50;
export const LOTTERY_TICKET_PRICE = 1;
export const ETHERJS_PATHS = [
  "/swap",
  "/find",
  "/pool",
  "/add",
  "/migrate",
  "/migrate/find",
];
export const CNTinUSDLink =
  "https://api.coingecko.com/api/v3/simple/price?ids=cryption-network&vs_currencies=USD";
export const CNT_CIRCULATING_SUPPLY_LINK =
  "https://api.cryption.network/circulating-supply";
export const CNT_TOTAL_SUPPLY_LINK =
  "https://api.cryption.network/total-supply";
export const SUPPORTED_NETWORK_IDS = [137, 80001, 1, 5, 56, 1287];
export const CROSS_CHAIN_API_LINK =
  "https://ccf-backend.polydex.org/transcation";
export const IPFS_DEFAULT_IMAGES = {
  CNT: "https://ipfs.infura.io/ipfs/QmceihNozdFNThRJiP2X93X2LXmSb5XWzsTaNsVBA7GwTZ",
  USDC: "https://ipfs.infura.io/ipfs/QmV17MDKrb3aCQa2a2SzBZaCeAeAFrpFmqCjn351cWApGS",
  USDT: "https://ipfs.infura.io/ipfs/QmTXHnF2hcQyqo7DGGRDHMizUMCNRo1CNBJYwbXUKpQWj2",
  DAI: "https://ipfs.infura.io/ipfs/QmVChZZtAijsiTnMRFb6ziQLnRocXnBU2Lb3F67K2ZPHho",
  MATIC:
    "https://ipfs.infura.io/ipfs/QmQnnPC9FKVdC2qnvHdDE45cz6q8grpeBLwBWNETVwzi5Q",
  WMATIC:
    "https://ipfs.infura.io/ipfs/QmQnnPC9FKVdC2qnvHdDE45cz6q8grpeBLwBWNETVwzi5Q",
};
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

export const BLACK_TIE_DIGITAL_PRESALE_ID =
  "0x3c01c04f9420839e0a0d95aac2e3c2f69004245b";

export const crowdsale = {
  // "__typename": "Crowdsale",
  crowdsaleStart: "1661630400",
  crowdsaleEnd: "1661689710",
  cliffDuration: "0",
  vestingStart: "1661776110",
  vestingEnd: "1661948910",
  tokenRemainingForSale: "10000000000000000000000",
  whitelistingEnabled: true,
  owner: "0x4274a49fbeb724d75b8ba7bfc55fc8495a15ad1e",
  hardcap: "10000000000000000000000",
  token: {
    // "__typename": "Token",
    id: "0x3c01c04f9420839e0a0d95aac2e3c2f69004245b-0xca8fd0eb2975c0d726d8be7ebbe02e72e3b1eb74",
    address: "0xca8fd0eb2975c0d726d8be7ebbe02e72e3b1eb74",
    name: "CNT",
    symbol: "CNT",
    url: "https://i.ibb.co/8D5r4Hp/CNT.png",
    decimals: 18,
  },
};

export const allowedInputTokens = [
  {
    // __typename: "AllowedInputToken",
    id: "0x3c01c04f9420839e0a0d95aac2e3c2f69004245b-0x671b68fb02778d37a885699da79c13faf0d3c560",
    crowdsaleAddress: {
      // __typename: "Crowdsale",
      id: "0x3c01c04f9420839e0a0d95aac2e3c2f69004245b",
    },
    name: "USD Coin",
    rate: "25000000",
    symbol: "USDC",
    decimals: 6,
    address: "0x671b68fb02778d37a885699da79c13faf0d3c560",
  },
  {
    // __typename: "AllowedInputToken",
    id: "0x3c01c04f9420839e0a0d95aac2e3c2f69004245b-0x6d4063bdc64c1ca2d0e28552f032804b2af117d0",
    crowdsaleAddress: {
      // __typename: "Crowdsale",
      id: "0x3c01c04f9420839e0a0d95aac2e3c2f69004245b",
    },
    name: "HONOR",
    rate: "12000000000000000000",
    symbol: "HONOR",
    decimals: 18,
    address: "0x6d4063bdc64c1ca2d0e28552f032804b2af117d0",
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
    "20% of the token will be given on 31st jan and the remaining will be linearly vested for 6 months.",
};
