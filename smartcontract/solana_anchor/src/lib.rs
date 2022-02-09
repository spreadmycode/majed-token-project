pub mod utils;
use borsh::{BorshDeserialize, BorshSerialize};
use {
    crate::utils::*,
    anchor_lang::{
        prelude::*,
        AnchorDeserialize,
        AnchorSerialize,
        Key,
        solana_program::{
            program_pack::Pack,
            program::{invoke},
            system_instruction,
            msg
        }      
    },
    spl_token::state
};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod solana_anchor {
    use super::*;

    pub fn init_pool(
            ctx : Context<InitPool>,
            _bump : u8,
            price : u64,
        ) -> ProgramResult {

        msg!("Init Pool");

        let pool = &mut ctx.accounts.pool;
        let token_account : state::Account = state::Account::unpack_from_slice(&ctx.accounts.token_account.data.borrow())?;
        if token_account.owner != pool.key() {
            return Err(PoolError::InvalidTokenAccount.into());
        }
        if token_account.mint != *ctx.accounts.token_mint.key {
            return Err(PoolError::InvalidTokenAccount.into());
        }

        pool.owner = *ctx.accounts.owner.key;
        pool.rand = *ctx.accounts.rand.key;
        pool.token_mint = *ctx.accounts.token_mint.key;
        pool.token_account = *ctx.accounts.token_account.key;
        pool.token_price = price;
        pool.bump = _bump;

        Ok(())
    }

    pub fn update_pool(
            ctx : Context<UpdatePool>,
            price : u64,
        ) -> ProgramResult {

        msg!("Update Pool");

        let pool = &mut ctx.accounts.pool;
        if pool.owner != *ctx.accounts.owner.key {
            return Err(PoolError::InvalidOwner.into());
        }

        pool.token_price = price;

        Ok(())
    }

    pub fn buy_token(
            ctx : Context<BuyToken>,
            amount : u64
        ) -> ProgramResult {

        msg!("Buy Token");

        let pool = &ctx.accounts.pool;
        
        if pool.token_account != *ctx.accounts.source_account.key {
            msg!("Source  account must be pool's  account");
            return Err(PoolError::InvalidTokenAccount.into());
        }
        if pool.token_account == *ctx.accounts.dest_account.key {
            msg!("Dest  account is not allowed to be pool's  account");
            return Err(PoolError::InvalidTokenAccount.into());
        }

        let pool_token_account : state::Account = state::Account::unpack_from_slice(&ctx.accounts.source_account.data.borrow())?;
        let pool_token_amount = pool_token_account.amount;

        if pool_token_amount < amount {
            msg!("Pool has insufficient funds");
            return Err(PoolError::InsufficientFunds.into());
        }

        let pool_seeds = &[
            pool.rand.as_ref(),
            &[pool.bump],
        ];

        spl_token_transfer(
            TokenTransferParams{
                source : ctx.accounts.source_account.clone(),
                destination : ctx.accounts.dest_account.clone(),
                authority : pool.to_account_info().clone(),
                authority_signer_seeds : pool_seeds,
                token_program : ctx.accounts.token_program.clone(),
                amount : amount,
            }
        )?;

        Ok(())
    }

    pub fn sell_token(
            ctx : Context<SellToken>,
            amount : u64
        ) -> ProgramResult {
        
        msg!("Sell Token");

        let pool = &ctx.accounts.pool;
        
        if pool.token_account == *ctx.accounts.source_account.key {
            msg!("Source  account should not be pool's  account");
            return Err(PoolError::InvalidTokenAccount.into());
        }
        if pool.token_account != *ctx.accounts.dest_account.key {
            msg!("Dest  account should be pool's  account");
            return Err(PoolError::InvalidTokenAccount.into());
        }

        spl_token_transfer_without_seed(
            TokenTransferParamsWithoutSeed{
                source : ctx.accounts.source_account.clone(),
                destination : ctx.accounts.dest_account.clone(),
                authority : ctx.accounts.owner.clone(),
                token_program : ctx.accounts.token_program.clone(),
                amount : amount,
            }
        )?;

        let lamports: u64 = amount * pool.token_price;

        invoke(
            &system_instruction::transfer(
                &ctx.accounts.wallet.key,
                ctx.accounts.owner.key,
                lamports,
            ),
            &[
                ctx.accounts.wallet.clone(),
                ctx.accounts.owner.clone(),
                ctx.accounts.system_program.to_account_info().clone(),
            ],
        )?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct BuyToken<'info> {
    #[account(mut, signer)]
    owner : AccountInfo<'info>,   

    pool : ProgramAccount<'info,Pool>,

    #[account(mut,owner=spl_token::id())]
    source_account : AccountInfo<'info>,

    #[account(mut,owner=spl_token::id())]
    dest_account : AccountInfo<'info>,

    #[account(address=spl_token::id())]
    token_program : AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct SellToken<'info> {
    #[account(mut, signer)]
    owner : AccountInfo<'info>,  
    
    #[account(mut, signer)]
    wallet : AccountInfo<'info>,  

    pool : ProgramAccount<'info,Pool>,

    #[account(mut,owner=spl_token::id())]
    source_account : AccountInfo<'info>,

    #[account(mut,owner=spl_token::id())]
    dest_account : AccountInfo<'info>,

    #[account(address=spl_token::id())]
    token_program : AccountInfo<'info>,

    system_program : Program<'info,System>,
}

#[derive(Accounts)]
#[instruction(_bump : u8)]
pub struct InitPool<'info> {
    #[account(mut, signer)]
    owner : AccountInfo<'info>,

    #[account(init, seeds=[(*rand.key).as_ref()], bump = _bump, payer = owner, space = 8 + POOL_SIZE)]
    pool : ProgramAccount<'info, Pool>,

    rand : AccountInfo<'info>,

    #[account(owner=spl_token::id())]
    token_mint : AccountInfo<'info>,

    #[account(owner=spl_token::id())]
    token_account : AccountInfo<'info>,

    system_program : Program<'info,System>,
}

#[derive(Accounts)]
pub struct UpdatePool<'info> {
    #[account(mut, signer)]
    owner : AccountInfo<'info>,

    pool : ProgramAccount<'info, Pool>,
}

pub const POOL_SIZE : usize = 32 + 32 + 32 + 32 + 8 + 1;

#[account]
pub struct Pool {
    pub owner : Pubkey,
    pub rand : Pubkey,
    pub token_mint : Pubkey,
    pub token_account : Pubkey,
    pub token_price : u64,
    pub bump : u8,
}

#[error]
pub enum PoolError {
    #[msg("Token mint to failed")]
    TokenMintToFailed,

    #[msg("Token set authority failed")]
    TokenSetAuthorityFailed,

    #[msg("Token transfer failed")]
    TokenTransferFailed,

    #[msg("Invalid token account")]
    InvalidTokenAccount,

    #[msg("Insufficient Pool Funds")]
    InsufficientFunds,

    #[msg("You are not Pool owner")]
    InvalidOwner,
}