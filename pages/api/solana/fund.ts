import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSafeUrl } from '@solana/lib';

export default async function fund(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  try {
    const url = getSafeUrl();
    const connection = new Connection(url, "confirmed");
    const address = req.body.address as PublicKey;
    const publicKey = new PublicKey(address) // created a PublicKey from the string formatted address.
    const hash = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL); // pass this public key to requestAirdrop, together with a constant which represents one SOL
    await connection.confirmTransaction(hash); // verify the transaction is confirmed by passing the transaction hash to the confirmTransaction method.
    res.status(200).json(hash); // return the hash of the transaction to the client side in JSON format
  } catch(error) {
    console.error(error)
    res.status(500).json('airdrop failed')
  }
}
