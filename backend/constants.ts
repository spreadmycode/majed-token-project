import * as anchor from '@project-serum/anchor';


// Mutable
export const RPC_HOST_URL = "https://sparkling-dry-thunder.solana-devnet.quiknode.pro/08975c8cb3c5209785a819fc9a3b2b537d3ba604/";
export const CONNECTION = new anchor.web3.Connection(RPC_HOST_URL);
export const PROGRAM_ID = new anchor.web3.PublicKey('37AyxDEWFDzYH7Hnri994AYEL8iMFJBG6A2uti9BetPZ');
export const POOL_ID = new anchor.web3.PublicKey('HHnRDUq5pNybukpwyuxPzgKm7J3cfvNqr8hXmKQh1cjP');
export const TOKEN_MINT = new anchor.web3.PublicKey('GTMHqpr4hVY7MNhTxfRtFdRfUw2ednFYy2QUsQk9xiY2');
export const KEYPAIR_PATH = "E:\\program.json";