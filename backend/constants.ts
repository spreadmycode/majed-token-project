import * as anchor from '@project-serum/anchor';

// Mutable
export const CANDY_MACHINE_ID = "EZnaTuo58c1rP2fYKfSBFi3m6PwuW4bw8X7kRtyuEnov";
export const RPC_HOST_URL = "https://sparkling-dry-thunder.solana-devnet.quiknode.pro/08975c8cb3c5209785a819fc9a3b2b537d3ba604/";
export const CONNECTION = new anchor.web3.Connection(RPC_HOST_URL);
export const PROGRAM_ID = new anchor.web3.PublicKey('FLbXLhQKfKcwJ9AZbnmqgexgy4wDLuwLZaTPJJo515jC');
export const POOL_ID = new anchor.web3.PublicKey('7Vteu9VMuoTqdQDEJ3JZ4eVP2DDNaeJLftb1WmM3FWhW');
export const TOKEN_MINT = new anchor.web3.PublicKey('HtJD15RcUEAztidwPqha3t2BDEgLsjZTpzjceGDQYp37');
export const KEYPAIR_PATH = "E:\\program.json";