import BigNumber from "bignumber.js/bignumber";

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});
export const BLACK_TIE_DIGITAL_PRESALE_ID =
  "0x3c01c04f9420839e0a0d95aac2e3c2f69004245b";

export interface ICrowdsale {
  crowdsaleStart: string;
  crowdsaleEnd: string;
  cliffDuration: string;
  vestingStart: string;
  vestingEnd: string;
  tokenRemainingForSale: string;
  whitelistingEnabled: boolean;
  owner: string;
  hardcap: string;
  token: {
    id: string;
    address: string;
    name: string;
    symbol: string;
    url: string;
    decimals: number;
  };
}
export interface IInputToken {
  id: string;
  crowdsaleAddress: {
    id: string;
  };
  name: string;
  rate: string;
  symbol: string;
  decimals: number;
  address: string;
}

export const crowdsale: ICrowdsale = {
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

export const allowedInputTokens: IInputToken[] = [
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
