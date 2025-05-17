import asyncio
from anchorpy import Program, Provider, Wallet
from solana.publickey import PublicKey
from solana.keypair import Keypair
from solana.rpc.async_api import AsyncClient
from solana.system_program import SYS_PROGRAM_ID
from base64 import b64decode
import json
import time
from hashlib import sha256

# === CONFIG ===
PROGRAM_ID = PublicKey("YOUR_PROGRAM_ID_HERE")  # 替换为你的实际合约地址
IDL_PATH = "./target/idl/ai_prediction.json"    # Anchor 自动生成的 IDL
WALLET_PATH = "~/.config/solana/id.json"        # 你的钱包密钥文件
CLUSTER_URL = "https://api.devnet.solana.com"

async def main():
    # === Setup client & wallet ===
    wallet = Wallet.local()
    connection = AsyncClient(CLUSTER_URL)
    provider = Provider(connection, wallet)
    
    # === Load program ===
    with open(IDL_PATH, "r") as f:
        idl = json.load(f)
    program = Program(idl, PROGRAM_ID, provider)

    # === Create a new PDA for prediction ===
    prediction_id = "predict-001"
    prediction_seed = bytes(prediction_id, "utf-8")
    prediction_pda, _ = PublicKey.find_program_address([prediction_seed], program.program_id)

    # === Prediction content ===
    model_hash = sha256(b"My AI model v1").digest()
    input_hash = sha256(b"input features").digest()
    predicted_output = 123456
    timestamp = int(time.time())

    # === Send transaction ===
    tx = await program.rpc["submit_prediction"](
        prediction_id,
        list(model_hash),
        list(input_hash),
        predicted_output,
        timestamp,
        ctx=program.ctx(
            accounts={
                "prediction": prediction_pda,
                "submitter": wallet.public_key,
                "system_program": SYS_PROGRAM_ID,
            },
        )
    )

    print(f"✅ Prediction submitted. Transaction: {tx}")
    print(f"📦 Account: {prediction
