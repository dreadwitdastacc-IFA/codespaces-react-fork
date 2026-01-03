Secure transfer checklist and unsigned transaction template

Important: I cannot access, move, or sign real funds for you. The files here are templates and instructions you must run locally with your own keys/hardware wallet.

Steps to safely prepare and send funds:

1. Locate deposits/addresses inside this repo (search for keywords: advance, deposit, wallet, tx, transaction, payment).
2. Export the addresses and amounts to a CSV: `txid,vout,address,amount`.
3. Use a secure machine (offline or hardware wallet) to construct and sign transactions.
4. Use `litecoin-cli`/`bitcoin-cli` or HWI to sign with your hardware wallet.
5. Broadcast using a trusted node or a block explorer API.

Example flow (local machine with `litecoin-cli`):

```bash
# create raw transaction from inputs file (example uses litecoin-cli)
litecoin-cli createrawtransaction '[{"txid":"<txid>","vout":<vout>},...]' '{"<destination_address>":<amount>}' > unsigned.hex

# optionally fund (adds change output and fee estimation using your wallet)
litecoin-cli fundrawtransaction $(cat unsigned.hex) > funded.json

# sign locally or with hardware wallet
# For wallet-signing (not recommended if keys are on the same host):
litecoin-cli signrawtransactionwithwallet <hex_from_funded.json>

# OR use HWI / hardware wallet to sign the transaction (preferred):
# hwi.py - test flow depends on device

# broadcast signed raw hex
litecoin-cli sendrawtransaction <signed_hex>
```

Template script `scripts/prepare_unsigned_tx_template.sh` shows how to format inputs and call `createrawtransaction` safely.

Security notes:
- Never paste private keys or seed phrases into source files or this chat.
- Prefer creating and signing transactions on an air-gapped machine or hardware wallet.
- Verify destination addresses before broadcasting.
