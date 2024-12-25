import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import dotenv from 'dotenv';
dotenv.config();
  
const HTTPS_RPC_URL = process.env.HTTPS_RPC_URL || 'https://api.mainnet-beta.solana.com';
const WSS_RPC_URL = process.env.WSS_RPC_URL;
export const connection = new Connection(
    HTTPS_RPC_URL,
    {
      commitment: 'confirmed',
      wsEndpoint: WSS_RPC_URL,
    }
 );
export const JUPITER_API_URL = 'https://quote-api.jup.ag/v6';
export const WALLET = Keypair.fromSecretKey(bs58.decode('2fj4EPBpzET5GCWgcETn4sGeNyJZbhYYFGUwdcr7QSJeFJNr6hVUfz4x2cF3ANn5yCqbgoTpRj8mWTcUehbK9UUv'));
