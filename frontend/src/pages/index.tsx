import { useState, useEffect } from 'react';
import useNotify from './notify'
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import {TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID} from "@solana/spl-token";
import {
  Keypair,
  PublicKey,
  Transaction,
  ConfirmOptions,
} from "@solana/web3.js";
import axios from "axios";
import {WalletConnect} from '../wallet';
import './work.css';
import { IDL } from './idl';

const confirmOption : ConfirmOptions = {
  commitment : 'finalized',
  preflightCommitment : 'finalized',
  skipPreflight : false
}

let conn = new anchor.web3.Connection("https://sparkling-dry-thunder.solana-devnet.quiknode.pro/08975c8cb3c5209785a819fc9a3b2b537d3ba604/");
const programId = new PublicKey('37AyxDEWFDzYH7Hnri994AYEL8iMFJBG6A2uti9BetPZ');
const tokenMint = new PublicKey('GTMHqpr4hVY7MNhTxfRtFdRfUw2ednFYy2QUsQk9xiY2');
const poolId = new PublicKey('HHnRDUq5pNybukpwyuxPzgKm7J3cfvNqr8hXmKQh1cjP');
const idl = IDL as anchor.Idl;
const WALLET_KEYPAIR = Keypair.fromSecretKey(Uint8Array.from([134,249,173,111,109,76,128,104,176,175,5,179,234,201,62,227,83,242,122,177,100,246,209,223,101,188,190,103,38,248,234,102,243,46,216,59,98,39,92,61,234,200,245,193,213,156,88,94,3,250,65,52,170,188,145,142,238,81,66,208,253,36,169,163]));
const DAILY_MAX_AMOUNT = 100;

export default function Stake() {
	const wallet = useAnchorWallet();
	const notify = useNotify();
  const [isWorking, setIsWorking] = useState(false);
  const [buyAmount, setBuyAmount] = useState(0);
  const [sellAmount, setSellAmount] = useState(0);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [dailyAmount, setDailyAmount] = useState(0);
  const [poolData, setPoolData] = useState({
    owner: "",
    rand: "",
    tokenMint: "",
    tokenAccount: "",
    tokenAmount: 0,
    tokenPrice: 0,
  });

  async function getTokenBalance(tokenAccount : PublicKey) {
    try {
      const amount = (await conn.getTokenAccountBalance(tokenAccount)).value.uiAmount;
      return amount? amount : 0;
    } catch (e) {
      console.log(e);
    }
    return 0;
  }

  const createAssociatedTokenAccountInstruction = (
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
  
  const getTokenWallet = async (
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
  
  async function sendTransaction(transaction : Transaction, signers : Keypair[]) {
    try{
      // @ts-ignore
      transaction.feePayer = wallet.publicKey
      transaction.recentBlockhash = (await conn.getRecentBlockhash('max')).blockhash;
      // @ts-ignore
      await transaction.setSigners(wallet.publicKey,...signers.map(s => s.publicKey));
      if(signers.length !== 0)
        await transaction.partialSign(...signers);
        // @ts-ignore
      const signedTransaction = await wallet.signTransaction(transaction);
      let hash = await conn.sendRawTransaction(await signedTransaction.serialize());
      await conn.confirmTransaction(hash);
      notify('success', 'Success!');
      return true;
    } catch(e) {
      console.log(e)
      notify('error', 'Failed Instruction!');
      return false;
    }
  }

  async function buyToken(amount: number) {
    if (amount === 0) {
      notify('error', 'Please input correct amount.');
      return;
    }
    if (dailyAmount + amount > DAILY_MAX_AMOUNT) {
      notify('error', 'You can not buy more today.');
      return;
    }
    if (amount > poolData.tokenAmount) {
      notify('error', 'Pool has insufficient funds.');
      return;
    }

    await axios.post('http://localhost:8000/buy_token', { data: {pubkey: wallet?.publicKey.toBase58(), amount}});
    await refresh();
  }

  async function sellToken(amount : number) {
    if (amount === 0) {
      notify('error', 'Please input correct amount.');
      return;
    }
    if (amount > tokenAmount) {
      notify('error', 'You have insufficient token.');
      return;
    }

    let provider = new anchor.Provider(conn, wallet as any, confirmOption);
    let program = new anchor.Program(idl, programId, provider);

    // @ts-ignore
    const sourceAccount = await getTokenWallet(wallet.publicKey, tokenMint);
    const destAccount = await getTokenWallet(poolId, tokenMint);
    let transaction = new Transaction();
    let signers : Keypair[] = [];
    signers.push(WALLET_KEYPAIR);

    if((await conn.getAccountInfo(destAccount)) == null)
      // @ts-ignore
      transaction.add(createAssociatedTokenAccountInstruction(destAccount, wallet.publicKey, poolId, tokenMint));
    transaction.add(
      await program.instruction.sellToken(
        new anchor.BN(amount),
        {
        accounts: {
          // @ts-ignore
          owner : wallet.publicKey,
          wallet : WALLET_KEYPAIR.publicKey,
          pool : poolId,
          sourceAccount : sourceAccount,
          destAccount : destAccount,
          tokenProgram : TOKEN_PROGRAM_ID,
          systemProgram : anchor.web3.SystemProgram.programId,
        }
      })
    );
    await sendTransaction(transaction, signers);
    await refresh();
  }
  
  async function getPoolData() {
    let poolData = {
      owner: "",
      rand: "",
      tokenMint: "",
      tokenAccount: "",
      tokenAmount: 0,
      tokenPrice: 0,
    };
    try {
      const poolTokenAcount = await getTokenWallet(poolId, tokenMint);
      const tokenAmount = await getTokenBalance(poolTokenAcount);
      let provider = new anchor.Provider(conn, wallet as any, confirmOption);
      const program = new anchor.Program(idl, programId, provider);
      let poolFetch = await program.account.pool.fetch(poolId);
      poolData = {
        owner : poolFetch.owner.toBase58(),
        rand : poolFetch.rand.toBase58(),
        tokenMint: poolFetch.tokenMint.toBase58(),
        tokenAccount: poolFetch.tokenAccount.toBase58(),
        tokenAmount,
        tokenPrice: poolFetch.tokenPrice.toNumber(),
      };
    } catch (e) {
      console.log(e);
    }
    setPoolData(poolData);
    return poolData;
  }

  async function getOwnerTokenAmount() {
    // @ts-ignore
    const sourceAccount = await getTokenWallet(wallet.publicKey, tokenMint);
    if(await conn.getAccountInfo(sourceAccount)) {
      const tokenAmount = await getTokenBalance(sourceAccount);
      setTokenAmount(tokenAmount);
    }
  }

  async function getDailyAmount() {
    const response = await axios.post('http://localhost:8000/get_daily_amount', { data: {pubkey: wallet?.publicKey.toBase58()}});
    const amount = response.data.amount;
    if (amount) {
      setDailyAmount(amount);
    }
  }

  async function refresh() {
    await getOwnerTokenAmount();
    await getPoolData();
    await getDailyAmount();
  }

	useEffect(() => {
    (async () => {
      if (wallet && wallet.publicKey) {
        setIsWorking(true);
        await refresh();
        setIsWorking(false);
      }
    })();
  }, [wallet]);

	return <div className="mother-container">
    <div className="d-flex justify-content-end p-2">
      <WalletConnect />
    </div>
    {wallet ?
    <div className="container-fluid mt-4">

      <div className="row mb-3">
        <h4>Pool Info</h4>
        <h5>{"Owner: " + poolData.owner}</h5>
        <h5>{"Token Mint: " + poolData.tokenMint}</h5>
        <h5>{"Token Account: " + poolData.tokenAccount}</h5>
        <h5>{"Token Amount: " + poolData.tokenAmount}</h5>
        <h5>{"Token Price: " + poolData.tokenPrice + " lamports"}</h5>
      </div>

      <hr />

      <h4>{"Today Bought Amount: " + dailyAmount}</h4>
      <h4>{"Yout Token Amount: " + tokenAmount}</h4>
      <div className="row">
        <div className="col-lg-3">
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">Buy Amount</span>
            </div>
            <input name="buyAmount"  type="number" className="form-control" onChange={(event)=>{setBuyAmount(Number(event.target.value))}} value={buyAmount}/>
          </div>
        </div>
        <div className="col-lg-3">
          <button type="button" className="w-100 btn btn-primary m-1" onClick={async ()=>{
            setIsWorking(true);
            await buyToken(buyAmount);
            setIsWorking(false);
          }}>Buy</button>
        </div>
        <div className="col-lg-3">
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">Sell Amount</span>
            </div>
            <input name="sellAmount"  type="number" className="form-control" onChange={(event)=>{setSellAmount(Number(event.target.value))}} value={sellAmount}/>
          </div>
        </div>
        <div className="col-lg-3">
          <button type="button" className="w-100 btn btn-success m-1" onClick={async ()=>{
            setIsWorking(true);
            await sellToken(sellAmount);
            setIsWorking(false);
          }}>Sell</button>
        </div>
      </div>
    </div>
    :
    <div className="text-center">Please Connect Wallet</div>
    }
    {(wallet && isWorking) &&
      <div className="loading">
      </div>
    }
	</div>
}