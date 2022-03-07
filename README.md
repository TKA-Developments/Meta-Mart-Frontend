# Meta Mart

This project is my first hands-on project on smart contract development.
Meta Mart is a simple NFT Marketplace where people can Mint, Buy, and Sell NFTs.
The Meta Mart contracts are deployed in Polygon Mumbai Testnet.

Checkout the live website here: [Meta-Mart](https://meta-mart.netlify.app/)


## Demo Screenshots

1. Main Screen

   ![Meta Mart Main Screen](https://drive.google.com/uc?export=view&id=1nah3UFjXhjUeDgrQtv_IQ7IEXzGeK3zN)

2. Explore all NFT Collections

   ![Meta Mart Explore NFT Screen](https://drive.google.com/uc?export=view&id=13oRwkthtd8YcDevQWl9mqcjDfhy-502J)

3. Minting New NFTs

   ![Meta Mart Mint NFT](https://drive.google.com/uc?export=view&id=10WTc4v7drvtNiiUJel4A0nd-8y7tgdRD)

   ![Meta Mart Mint NFT 2](https://drive.google.com/uc?export=view&id=1vJcR_TXyoEOTp0jOHGtP-5t_lELwsDXy)

   ![Meta Mart Mint NFT 3](https://drive.google.com/uc?export=view&id=15kYuM3T8FeoZVKixyH5HcNgd87zYdnRO)

4. Buying NFT

   ![Meta Mart Buy NFT](https://drive.google.com/uc?export=view&id=1DiP78FYQ8yIqmiDGaKprDk14my8jY1Hh)

5. My Collections

   ![Meta Mart My Collection](https://drive.google.com/uc?export=view&id=1ZiTZIPsTJXRXx8BWvgdSmNbTYm3ToYAZ)


## Contracts

The project is consisted of 2 contracts.

| Name                                                                                                          | Description                                                                                       |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| [NFT Contract](https://mumbai.polygonscan.com/address/0xfD24FDBcf96271E9995c4aD83ba6A47418247a2F)             | This contract is used for storing the NFT metadata                                                |
| [NFT Marketplace Contract](https://mumbai.polygonscan.com/address/0x0ceA1777a3C748d461A3ca02752644D3983471f2) | This contract is used for listing the NFT in the marketplace and keeping track of its transaction |

## Running The Project

Below are some steps to get started with Meta Mart

## Compile and Deploying The Contracts

The contract needs to be compiled everytime it has been modified. The command below is used to compile and deploy the contract

```shell
npx hardhat compile
npx hardhat run scripts/deploy.js --network mumbai
```

Don't forget to set your environment variable `WALLET_PRIVATE_KEY` to be the private key of your deployed account. This is an important variable in `hardhat.config.js`

After each deployment, don't forget to update the contract addresses in `config.js`

## Running Meta Mart front end

```shell
yarn dev
```
