import { Connection, PublicKey, Keypair, TransactionInstruction, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSafeUrl } from '@solana/lib';
import { transcode } from 'buffer';

// The state of a greeting account managed by the hello world program
class GreetingAccount {
  counter = 0;
  constructor(fields: {counter: number} | undefined = undefined) {
    if (fields) {
      this.counter = fields.counter;
    }
  }
}

// Borsh schema definition for greeting accounts
const GreetingSchema = new Map([
  [GreetingAccount, {kind: 'struct', fields: [['counter', 'u32']]}],
]);

export default async function setGreetings(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  try {
    const { greeter, secret, programId } = req.body;
    const url = getSafeUrl();
    const connection = new Connection(url, "confirmed");

    const greeterPublicKey = new PublicKey(greeter);
    const programKey = new PublicKey(programId);

    const payerSecretKey = new Uint8Array(JSON.parse(secret));
    const payerKeypair = Keypair.fromSecretKey(payerSecretKey);

    const instruction = new TransactionInstruction({ // note the params we need to provide for a transactionInstruction
      keys: [{pubkey: greeterPublicKey as PublicKey, isSigner: false, isWritable: true}],  // the param for keys is an AccountMeta[] variable of the following format : { isSigner: boolean; isWritable: boolean; pubkey: PublicKey }
      programId: programKey, 
      data: Buffer.alloc(0), // All instructions are hellos - the data we want to pass to the call. In this case, there is only one kind of instruction we can send and Buffer.alloc(0) is like referring to the zero-index of an array. If there were multiple instructions, we would alter this value.
    }); 
  
    const transaction = new Transaction().add(instruction)

    // this your turn to figure out 
    // how to create this transaction 
    const hash = await sendAndConfirmTransaction(connection, transaction, [payerKeypair]);
    
    res.status(200).json(hash);
  } catch(error) {
    console.error(error);
    res.status(500).json('Get balance failed');
  }
}
