import { program } from 'commander';
import * as anchor from '@project-serum/anchor';
import { Keypair, PublicKey, Transaction } from '@solana/web3.js';
import log from 'loglevel';
import { TOKEN_MINT, CONNECTION, POOL_ID, PROGRAM_ID } from './constants';
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { createAssociatedTokenAccountInstruction, getTokenBalance, getTokenWallet, loadAnchorProgram, loadWalletKey, sendTransaction } from './util';

program.version('0.0.1');

log.setLevel(log.levels.INFO);

program.
  command('init_pool')
  .option(
    '-k, --keypair <path>',
    `Solana wallet location`,
    '--keypair not provided',
  )
  .option(
    '-p, --price <string>',
    `Token Price (Lamports)`,
    '--price not provided',
  )
  .action(async (directory, cmd) => {
    const { keypair, price } = cmd.opts();

    const walletKeyPair = loadWalletKey(keypair);
    const anchorProgram = await loadAnchorProgram(walletKeyPair);

    let randomPubkey = Keypair.generate().publicKey;
    let [pool, bump] = await anchor.web3.PublicKey.findProgramAddress([randomPubkey.toBuffer()], PROGRAM_ID);
    let tokenAccount = await getTokenWallet(pool, TOKEN_MINT);
    let transaction = new Transaction();
    let signers : Keypair[] = [];

    transaction.add(createAssociatedTokenAccountInstruction(tokenAccount, walletKeyPair.publicKey, pool, TOKEN_MINT));
    transaction.add(
        await anchorProgram.instruction.initPool(
            new anchor.BN(bump),
            new anchor.BN(price),
            {
                accounts:{
                    owner : walletKeyPair.publicKey,
                    pool : pool,
                    rand : randomPubkey,
                    tokenMint : TOKEN_MINT,
                    tokenAccount : tokenAccount,
                    systemProgram : anchor.web3.SystemProgram.programId,
                }
            }
        )
    );
    await sendTransaction(new anchor.Wallet(walletKeyPair), transaction, signers);

    console.log(`Pool is initialized: ${pool.toBase58()}`);
});

program.
  command('update_pool')
  .option(
    '-k, --keypair <path>',
    `Solana wallet location`,
    '--keypair not provided',
  )
  .option(
    '-p, --price <string>',
    `Token Price (Lamports)`,
    '--price not provided',
  )
  .action(async (directory, cmd) => {
    const { keypair, price } = cmd.opts();

    const walletKeyPair = loadWalletKey(keypair);
    const anchorProgram = await loadAnchorProgram(walletKeyPair);

    let transaction = new Transaction();
    let signers : Keypair[] = [];

    transaction.add(
        await anchorProgram.instruction.updatePool(
            new anchor.BN(price),
            {
                accounts:{
                    owner : walletKeyPair.publicKey,
                    pool : POOL_ID
                }
            }
        )                               
    );
    await sendTransaction(new anchor.Wallet(walletKeyPair), transaction, signers);
    
    console.log(`Pool is updated: ${POOL_ID.toBase58()}`);
});

program.
  command('get_pool')
  .option(
    '-k, --keypair <path>',
    `Solana wallet location`,
    '--keypair not provided',
  )
  .action(async (directory, cmd) => {
    const { keypair } = cmd.opts();

    let poolData: any = {};
    try {
      const poolTokenAcount = await getTokenWallet(POOL_ID, TOKEN_MINT);
      const tokenAmount = await getTokenBalance(poolTokenAcount);

      const walletKeyPair = loadWalletKey(keypair);
      const anchorProgram = await loadAnchorProgram(walletKeyPair);
      let poolFetch = await anchorProgram.account.pool.fetch(POOL_ID);
      poolData = {
        owner : poolFetch.owner.toBase58(),
        rand : poolFetch.rand.toBase58(),
        tokenMint : poolFetch.tokenMint.toBase58(),
        tokenAccount : poolFetch.tokenAccount.toBase58(),
        tokenAmount,
        bump: poolFetch.bump
      };
    } catch (e) {}

    console.log(poolData);
});

program.
  command('buy_token')
  .option(
    '-k, --keypair <path>',
    `Solana wallet location`,
    '--keypair not provided',
  )
  .option(
    '-p, --pubkey <string>',
    `Wallet Address`,
    '--pubkey not provided',
  )
  .option(
    '-a, --amount <string>',
    `Token amount`,
    '--amount not provided',
  )
  .action(async (directory, cmd) => {
    const { keypair, pubkey, amount } = cmd.opts();

    const walletKeyPair = loadWalletKey(keypair);
    const anchorProgram = await loadAnchorProgram(walletKeyPair);

    let sourceAccount = await getTokenWallet(POOL_ID, TOKEN_MINT);
    let destAccount = await getTokenWallet(new PublicKey(pubkey), TOKEN_MINT);

    let transaction = new Transaction();
    let signers : Keypair[] = [];

    if((await CONNECTION.getAccountInfo(destAccount)) == null)
      transaction.add(createAssociatedTokenAccountInstruction(destAccount, walletKeyPair.publicKey, new PublicKey(pubkey), TOKEN_MINT))  ;

    transaction.add(
        await anchorProgram.instruction.buyToken(
            new anchor.BN(amount),
            {
                accounts:{
                    owner : walletKeyPair.publicKey,
                    pool : POOL_ID,
                    sourceAccount : sourceAccount,
                    destAccount : destAccount,
                    tokenProgram : TOKEN_PROGRAM_ID,
                }
            }
        )                               
    );
    await sendTransaction(new anchor.Wallet(walletKeyPair), transaction, signers);
});

program.parse(process.argv);
