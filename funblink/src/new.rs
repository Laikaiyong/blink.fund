use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint};

declare_id!("5Z4UkWTCAQu2sNRKkq4GcredbKuF9jGdSxG5mH7ypY6B");

#[program]
pub mod dynamic_token_blink {
    use super::*;

    pub fn create_blink(
        ctx: Context<CreateBlink>, 
        id: String,
        title: String,
        icon: String,
        description: String,
        label: String,
        amount: u64,
    ) -> Result<()> {
        let blink_list = &mut ctx.accounts.blink_list;
        blink_list.is_initialized = true;

        let new_blink = Blink {
            id,
            title,
            icon,
            description,
            label,
            to_pubkey: ctx.accounts.recipient.key().to_string(),
            token_mint: ctx.accounts.token_mint.key(),
            amount,
        };

        blink_list.blinks.push(new_blink);

        Ok(())
    }

    pub fn execute_blink(ctx: Context<ExecuteBlink>, id: String) -> Result<()> {
        let blink_list = &mut ctx.accounts.blink_list;
        let blink = blink_list.blinks.iter().find(|b| b.id == id).ok_or(ErrorCode::BlinkNotExist)?;

        // Transfer tokens
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: ctx.accounts.sender_token_account.to_account_info(),
                    to: ctx.accounts.recipient_token_account.to_account_info(),
                    authority: ctx.accounts.signer.to_account_info(),
                },
            ),
            blink.amount,
        )?;

        // Remove the executed blink
        blink_list.blinks.retain(|b| b.id != id);

        Ok(())
    }

    // ... (delete_blink and close_blink functions remain the same)
}

#[derive(Accounts)]
pub struct CreateBlink<'info> {
    #[account(init_if_needed, payer = signer, space = 10240, seeds = [b"blink_list", signer.key().as_ref()], bump)]
    pub blink_list: Account<'info, BlinkList>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub recipient: AccountInfo<'info>,
    pub token_mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ExecuteBlink<'info> {
    #[account(mut, seeds = [b"blink_list", signer.key().as_ref()], bump)]
    pub blink_list: Account<'info, BlinkList>,
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(mut)]
    pub sender_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub recipient_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

// ... (DeleteBlink and CloseBlink structs remain the same)

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct Blink {
    id: String,
    title: String,
    icon: String,
    description: String,
    label: String,
    to_pubkey: String,
    token_mint: Pubkey,
    amount: u64,
}

#[account]
pub struct BlinkList {
    blinks: Vec<Blink>,
    is_initialized: bool,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Blink exists")]
    BlinkExists,
    #[msg("Blink does not exist")]
    BlinkNotExist,
}