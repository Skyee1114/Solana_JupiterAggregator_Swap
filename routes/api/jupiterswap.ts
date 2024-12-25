import { Router, Request, Response, NextFunction } from 'express';
import { VersionedTransaction } from "@solana/web3.js";
import { JUPITER_API_URL, WALLET, connection } from '../../config';

const router: Router = Router();

interface SwapRequestBody {
    inputToken: string;  
    outputToken: string;
    amount: number;     
    slippage: number; 
}

router.post(
    '/',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            
            const { inputToken, outputToken, amount, slippage } = req.body as SwapRequestBody;

            if (!inputToken || !outputToken || !amount || slippage === undefined) {
                res.status(400).json({ 
                    error: 'Missing required fields: inputToken, outputToken, solAmount, slippage' 
                });
                return; // Exit the handler after sending the response
            }
            console.log('Input: ', inputToken);
            console.log('Output: ', outputToken);
            console.log('Amount: ', amount);
            console.log('Slippage: ', slippage);
            const solAmount = Number(amount) * 1000000000;
            
            const quoteResponse = await (
                await fetch(`${JUPITER_API_URL}/quote?inputMint=${inputToken}&outputMint=${outputToken}&amount=${solAmount}&slippageBps=${slippage}`)
              ).json();

            const { swapTransaction } = await (
                await fetch(`${JUPITER_API_URL}/swap`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    quoteResponse,
                    userPublicKey: WALLET.publicKey.toString(),
                    wrapAndUnwrapSol: true,
                })
                })
            ).json();

            const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
            var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
            console.log(transaction);  
            transaction.sign([WALLET]);

            const latestBlockHash = await connection.getLatestBlockhash();
            const rawTransaction = transaction.serialize();
            const txid = await connection.sendRawTransaction(rawTransaction, {
                skipPreflight: false,
                maxRetries: 2
            });
            await connection.confirmTransaction({
                blockhash: latestBlockHash.blockhash,
                lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
                signature: txid
            });
            console.log('Transaction: ', txid);

            res.status(200).json({ 
                message: `${txid}` 
            });

           
        } catch (err: any) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to swap' });
        }
    }
)

export default router;
