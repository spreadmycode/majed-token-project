# Token Buying and Selling Platform

1. Player sends a request with their public address to purchase the smart contract token.
Then server send a request to the smart contract to send the player an x amount of its token supply. When it does send, it basically increments a value in a table for that player (how much they bought today) and when they purchase again you want to make sure that they don't go over the max daily purchase.

2. Player calls a function on the smart contract to sell, the player can't specify where they sell to, as when you sell the token go straight to the server wallet.


# Current Project Specs

Token Mint: `GTMHqpr4hVY7MNhTxfRtFdRfUw2ednFYy2QUsQk9xiY2`

Token Decimals: 0

Smart Contract: `37AyxDEWFDzYH7Hnri994AYEL8iMFJBG6A2uti9BetPZ`

Pool Id: `HHnRDUq5pNybukpwyuxPzgKm7J3cfvNqr8hXmKQh1cjP`

Max daily bought amount: 100

Token price: 100 lamports

# Smart Contract Build & Deploy

- Build smart contract(Solana Sealevel - program) by Cargo
- Deploy smart contract to Solana chain(BPF - Berkle Packet Filter) by Solana cli

Smart Contract source is placed on `/smartcontract`.

## Install dependancies

### Cargo

Cargo is Rust’s build system and package manager. It is same as `NPM` in Node.js project.
In Rust project, you can see `Cargo.toml`. It is same as package.json in Node.js project.

```
$ curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

### Anchor

Anchor is a framework for Solana's Sealevel (opens new window)runtime providing several convenient developer tools.

```
$ npm i -g @project-serum/anchor-cli
```

### Solana

Install in [`here`](https://docs.solana.com/cli/install-solana-cli-tools).

## Build Smart Contract

In program folder, you can run following commands.

```
$ cargo clean
$ cargo build-bpf
```
Then you can see `so` file in `target` sub folder.

## Deploy Smart Contract to devnet

Please check `solana` cli is connected to devnet.
To do this,

```
$ solana config get
```

Check the url is switched `devnet`.

Some SOLs are needed and you'd better `airdrop` some SOLs.

After that run this command.

```
$ solana deploy contract.so
```

After success deployment, you can see the address(pubkey) of contract newly deployed.

Please copy this address for further setting.

Then, please generate IDL json file.

```
$ anchor idl parse -f ./src/lib.rs -o ./target/deploy/contract.json
```

It generates IDL json file int `target` sub folder.
IDL is same as ABI in Ethereum Solidity.(Interface Description Language)

Finally, you successfuly deploy your contract to `devnet`.

You can change network type(Solana cli url) to any one, then deploy smart contract to `main-net`, or `testnet`.

# Prepare environment

Create the token by using `spl-token` library.

Copy the token mint address and paste on `/backend/constants: 9ln`.

Copy the token mint address and paste on `/frontend/src/pages/index.tsx: 25ln`.

Copy the keypair file path and paste on `/backend/constants: 10ln`.

Copy the content of keypair file and paste on `/frontend/src/pages/index.tsx: 28ln`.

This keypair file will cover all fees on buying transaction.

Also when user sells the token, this keypair will send the token amount * token price (lamports) to seller.

So, this wallet should have some SOL.

Copy the RPC custom node url and paste on `/backend/constants: 5ln`.

Copy the RPC custom node url and paste on `/frontend/src/pages/index.tsx: 23ln`.

It will determin the chain - mainnet-beta, devnet or testnet.
Current one is my devnet quicknode url.
So it works on devnet.

Copy the contract id and paste on `/backend/constants: 7ln`.

Copy the contract id and paste on `/frontend/src/pages/index.tsx: 24ln`.

Copy the idl and paste on `/backend/idl.ts`.

Copy the idl and paste on `/frontend/src/pages/idl.ts`.

Create the database on MySQL by using dump file `/backend/db.sql`.

# Pool Management

Pool should be initialized with token mint author wallet.

```
$ ts-node ./backend/cli.ts init_pool -k <KEY_PAIR_PATH> -p <TOKEN_PRICE_LAMPORTS>
```

After running this command, you can see the Pool id.

Copy it and paste on `/backend/constants: 8ln`.

Copy it and paste on `/frontend/src/pages/index.tsx: 26ln`.

```
$ ts-node ./backend/cli.ts get_pool -k <KEY_PAIR_PATH>
```

After running this command, you can find the `Token Account Address`.
This account will store all token which is distributed to buyers and is accumulated from sellers.
This account is managed by Pool and Pool is managed by smart contract.
This is Solana token program model. Please check some references.
So you need to fund this account with token.

```
$ ts-node ./backend/cli.ts update_pool -k <KEY_PAIR_PATH> -p <TOKEN_PRICE_LAMPORTS>
```

You can update the Pool constants (token price) by using above command.

# Run the project

- Backend

```
$ node ./backend/app.js
```

- Frontend

Run following command in `/frontend`.

```
$ npm start
```

That's it.
Enjoy