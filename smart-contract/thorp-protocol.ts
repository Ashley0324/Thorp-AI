import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AiPrediction } from "../target/types/ai_prediction";

describe("ai_prediction", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.AiPrediction as Program<AiPrediction>;

  it("Submits a prediction", async () => {
    const [predictionPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("prediction1")],
      program.programId
    );

    await program.methods.submitPrediction(
      "prediction1",
      new Array(32).fill(1),
      new Array(32).fill(2),
      new anchor.BN(100),
      new anchor.BN(Date.now())
    ).accounts({
      prediction: predictionPda,
      submitter: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    }).rpc();

    const prediction = await program.account.prediction.fetch(predictionPda);
    console.log("Prediction stored:", prediction);
  });
});
