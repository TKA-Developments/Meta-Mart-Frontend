# Meta Mart

This project is my first hands-on project on smart contract development.
Meta Mart is a simple NFT Marketplace where people can Mint, Buy, and Sell NFTs.
The Meta Mart contracts are deployed in Polygon Mumbai Testnet.

## Compiling Meta Mart smart Contract

```shell
npx hardhat compile
npx hardhat run scripts/deploy.js --network mumbai
```

After each deployment, don't forget to update the contract addresses in config.js

## Running Meta Mart front end

```shell
yarn i
npm run dev
```
