# The Webway Decentralized Metaverse Builder and Space Minting Protocol

This repository is the front-end single-page application for the Webway Decentralized metaverse,
where each world is a self-contained, ownable sovereign entity on the blockchain and IPFS.

The smart contract and graphql code are hosted at:
https://github.com/LPSCRYPT/webway


## Useful code snippets

### Front-End and Data Schema

* [Types that define the 3d scene graph *(SceneConfiguration)*](src/Scene/Config/types/scene.ts)
* [Example scene graph that can be converted into JSON and have all of its assets iploaded to IPFS](scripts/src/publishToIpfs.ts)
* [GraphQl queries](src/lib/queries)
* [Root 3d Scene where configuration is loaded from a token's ipfs metadata](src/Scene/TokenScene.tsx)

### Smart Contract and Graph Ql schema

This is all hosted in another repository:

* [Smart Contract](https://github.com/LPSCRYPT/webway/blob/main/packages/hardhat/contracts/Webway.sol)
* [Subgraph yaml](https://github.com/LPSCRYPT/webway/blob/main/packages/subgraph/subgraph.yaml)
* [Subgraph Schema](https://github.com/LPSCRYPT/webway/blob/main/packages/subgraph/src/schema.graphql)
* [Subgraph Mapping](https://github.com/LPSCRYPT/webway/blob/main/packages/subgraph/src/mapping.ts)

## Setup

Install dependencies:

    yarn install

Start the application:

    yarn start

To test out the application not connected to the blockchain open `http://localhost:3000/test?scene=marble`

