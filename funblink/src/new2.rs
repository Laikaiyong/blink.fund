use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod blink_contract {
    use super::*;

    pub fn create_blink(
        ctx: Context<CreateBlink>,
        amount: u64,
        recipient: Pubkey,
        expiration: i64,
        custom_fields: Vec<String>,
    ) -> Result<()> {
        let blink = &mut ctx.accounts.blink;
        blink.creator = ctx.accounts.creator.key();
        blink.recipient = recipient;
        blink.amount = amount;
        blink.token_mint = ctx.accounts.token_mint.key();
        blink.expiration = expiration;
        blink.claimed = false;
        blink.custom_fields = custom_fields;

        // Transfer tokens from creator to blink account
        let transfer_instruction = Transfer {
            from: ctx.accounts.creator_token_account.to_account_info(),
            to: ctx.accounts.blink_token_account.to_account_info(),
            authority: ctx.accounts.creator.to_account_info(),
        };

        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                transfer_instruction,
            ),
            amount,
        )?;

        Ok(())
    }

    pub fn claim_blink(ctx: Context<ClaimBlink>) -> Result<()> {
        let blink = &mut ctx.accounts.blink;

        require!(!blink.claimed, BlinkError::AlreadyClaimed);
        require!(
            blink.expiration > Clock::get()?.unix_timestamp,
            BlinkError::Expired
        );

        // Transfer tokens from blink account to recipient
        let transfer_instruction = Transfer {
            from: ctx.accounts.blink_token_account.to_account_info(),
            to: ctx.accounts.recipient_token_account.to_account_info(),
            authority: blink.to_account_info(),
        };

        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                transfer_instruction,
                &[&[
                    b"blink",
                    blink.creator.as_ref(),
                    &[ctx.bumps.blink],
                ]],
            ),
            blink.amount,
        )?;

        blink.claimed = true;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateBlink<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + 32 + 32 + 8 + 32 + 8 + 1 + 4 + 200, // Adjust space as needed
        seeds = [b"blink", creator.key().as_ref()],
        bump
    )]
    pub blink: Account<'info, Blink>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub token_mint: Account<'info, Mint>,
    #[account(
        mut,
        constraint = creator_token_account.owner == creator.key(),
        constraint = creator_token_account.mint == token_mint.key()
    )]
    pub creator_token_account: Account<'info, TokenAccount>,
    #[account(
        init,
        payer = creator,
        token::mint = token_mint,
        token::authority = blink,
    )]
    pub blink_token_account: Account<'info, TokenAccount>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct ClaimBlink<'info> {
    #[account(
        mut,
        seeds = [b"blink", blink.creator.as_ref()],
        bump,
        has_one = recipient,
    )]
    pub blink: Account<'info, Blink>,
    #[account(mut)]
    pub recipient: Signer<'info>,
    #[account(
        mut,
        constraint = blink_token_account.owner == blink.key(),
        constraint = blink_token_account.mint == blink.token_mint,
    )]
    pub blink_token_account: Account<'info, TokenAccount>,
    #[account(
        mut,
        constraint = recipient_token_account.owner == recipient.key(),
        constraint = recipient_token_account.mint == blink.token_mint,
    )]
    pub recipient_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct Blink {
    pub creator: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
    pub token_mint: Pubkey,
    pub expiration: i64,
    pub claimed: bool,
    pub custom_fields: Vec<String>,
}

#[error_code]
pub enum BlinkError {
    #[msg("This blink has already been claimed")]
    AlreadyClaimed,
    #[msg("This blink has expired")]
    Expired,
}