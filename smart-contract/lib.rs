use anchor_lang::prelude::*;

declare_id!("YourProgramId1111111111111111111111111111111111");

#[program]
pub mod ai_prediction {
    use super::*;

    pub fn submit_prediction(
        ctx: Context<SubmitPrediction>,
        prediction_id: String,
        model_hash: [u8; 32],
        input_hash: [u8; 32],
        predicted_output: u64,
        timestamp: i64,
    ) -> Result<()> {
        let prediction = &mut ctx.accounts.prediction;
        prediction.prediction_id = prediction_id;
        prediction.model_hash = model_hash;
        prediction.input_hash = input_hash;
        prediction.predicted_output = predicted_output;
        prediction.timestamp = timestamp;
        prediction.submitter = ctx.accounts.submitter.key();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct SubmitPrediction<'info> {
    #[account(init, payer = submitter, space = 8 + Prediction::LEN)]
    pub prediction: Account<'info, Prediction>,
    #[account(mut)]
    pub submitter: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Prediction {
    pub prediction_id: String,
    pub model_hash: [u8; 32],
    pub input_hash: [u8; 32],
    pub predicted_output: u64,
    pub timestamp: i64,
    pub submitter: Pubkey,
}

impl Prediction {
    // 每个字段最大长度，用于计算账户空间大小
    const LEN: usize = 
        4 + 64 +     // prediction_id (string)
        32 +         // model_hash
        32 +         // input_hash
        8 +          // predicted_output (u64)
        8 +          // timestamp (i64)
        32;          // submitter (Pubkey)
}
