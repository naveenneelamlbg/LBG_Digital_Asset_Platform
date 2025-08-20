---

⚠️ **Warning**: The current version of this backends are **Proof of Concept (PoC)** and is intended for demonstration and testing purposes only. It is currently pre configured to work using few settings either from .env or some hard coded values. Please exercise caution and do not use it in production or with real assets until further development and testing have been completed.

--- 

## Description

This project provides a REST API for managing tokens using ERC3643 smart contracts and Nest.js. The API allows you to create users onchain id's, manage tokens, and interact with the EVM Based ledgers.

## Project setup

```bash
$ npm install
```

## Compile and run the project

Please follow the readme in ../hardhat folder for local node and smart contract deployment before running this project as this backend is targeting the hardhat environment

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
