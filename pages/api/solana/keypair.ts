import { Keypair } from '@solana/web3.js';
import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseT = {
    secret: string
    address: string
}
export default async function keypair(
  _req: NextApiRequest,
  res: NextApiResponse<string | ResponseT>
) {
  try {
    const keypair = Keypair.generate()
    const address = keypair?.publicKey.toString()
    const secret = JSON.stringify(Array.from(keypair?.secretKey)) // The secret key is kept in array format, so to send it back to the client-side we need to remember to use JSON.stringify.

    res.status(200).json({
        secret,
        address,
    });
  } catch(error) {
    console.error(error);
    res.status(500).json('Get balance failed');
  }
}
