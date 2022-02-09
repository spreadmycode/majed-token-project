import * as fs from 'fs';
import * as anchor from '@project-serum/anchor';
import { ConfirmOptions, Keypair, Transaction } from '@solana/web3.js';
import {TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID} from "@solana/spl-token";
import { IDL } from './idl';
import { CONNECTION, PROGRAM_ID } from './constants';

const confirmOption : ConfirmOptions = {
    commitment : 'finalized',
    preflightCommitment : 'finalized',
    skipPreflight : false
  }

export async function loadAnchorProgram(walletKeyPair: Keypair) {
    // @ts-ignore
    const walletWrapper = new anchor.Wallet(walletKeyPair);
    const provider = new anchor.Provider(CONNECTION, walletWrapper, confirmOption);
    const idl = IDL as anchor.Idl;
  
    const program = new anchor.Program(idl, PROGRAM_ID, provider);
    return program;
  }
  
export function loadWalletKey(keypair: string): Keypair {
    const loaded = Keypair.fromSecretKey(
        new Uint8Array(JSON.parse(fs.readFileSync(keypair).toString())),
    );
    return loaded;
}
  
export const getTokenWallet = async (
          wallet: anchor.web3.PublicKey,
          mint: anchor.web3.PublicKey
    ) => {
    return (
        await anchor.web3.PublicKey.findProgramAddress(
            [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
            ASSOCIATED_TOKEN_PROGRAM_ID
        )
    )[0];
};

export async function getTokenBalance(tokenAccount : anchor.web3.PublicKey) {
    try {
        const amount = (await CONNECTION.getTokenAccountBalance(tokenAccount)).value.uiAmount;
        return amount? amount : 0;
    } catch (e) {}
    return 0;
}
  
export const createAssociatedTokenAccountInstruction = (
        associatedTokenAddress: anchor.web3.PublicKey,
        payer: anchor.web3.PublicKey,
        walletAddress: anchor.web3.PublicKey,
        splTokenMintAddress: anchor.web3.PublicKey
    ) => {
    const keys = [
        { pubkey: payer, isSigner: true, isWritable: true },
        { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
        { pubkey: walletAddress, isSigner: false, isWritable: false },
        { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
        {
            pubkey: anchor.web3.SystemProgram.programId,
            isSigner: false,
            isWritable: false,
        },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        {
            pubkey: anchor.web3.SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
        },
    ];
    return new anchor.web3.TransactionInstruction({
        keys,
        programId: ASSOCIATED_TOKEN_PROGRAM_ID,
        data: Buffer.from([]),
    });
}
  
export async function sendTransaction(wallet: anchor.Wallet, transaction : Transaction,signers : Keypair[]) {
    try{
        transaction.feePayer = wallet.publicKey;
        transaction.recentBlockhash = (await CONNECTION.getRecentBlockhash('max')).blockhash;
        await transaction.setSigners(wallet.publicKey,...signers.map(s => s.publicKey));
        if(signers.length != 0)
            await transaction.partialSign(...signers)
        const signedTransaction = await wallet.signTransaction(transaction);
        let hash = await CONNECTION.sendRawTransaction(await signedTransaction.serialize());
        await CONNECTION.confirmTransaction(hash);
    } catch(err) {
        console.log(err);
    }
}