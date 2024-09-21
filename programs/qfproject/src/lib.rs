use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;


declare_id!("7ZHLRSZGJzpddsNhZqHbcpAJX8SCwpfmpkKXFMyceUCL");

#[program]
pub mod qfproject {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        let project_counter = &mut ctx.accounts.project_counter;
        project_counter.count = 0;
        Ok(())
    }

    pub fn create_project(ctx: Context<CreateProject>, name: String, description: String, funding_goal: u64, image_url: String) -> ProgramResult {
        let project = &mut ctx.accounts.project;
        let owner = &ctx.accounts.owner;
        let project_counter = &mut ctx.accounts.project_counter;

        project.owner = owner.key();
        project.name = name;
        project.description = description;
        project.funding_goal = funding_goal;
        project.current_funding = 0;
        project.index = project_counter.count;
        project.image_url = image_url;

        project_counter.count += 1;

        Ok(())
    }

    pub fn fund_project(ctx: Context<FundProject>, amount: u64) -> ProgramResult {
        let project = &mut ctx.accounts.project;
        project.current_funding += amount;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 8)]
    pub project_counter: Account<'info, ProjectCounter>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateProject<'info> {
    #[account(init, payer = owner, space = 8 + 32 + 100 + 1000 + 8 + 8 + 8 + 200)]
    pub project: Account<'info, Project>,
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut)]
    pub project_counter: Account<'info, ProjectCounter>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct FundProject<'info> {
    #[account(mut)]
    pub project: Account<'info, Project>,
    #[account(mut)]
    pub funder: Signer<'info>,
}

#[account]
pub struct Project {
    pub owner: Pubkey,
    pub name: String,
    pub description: String,
    pub funding_goal: u64,
    pub current_funding: u64,
    pub index: u64,
    pub image_url: String,
}

#[account]
pub struct ProjectCounter {
    pub count: u64,
}