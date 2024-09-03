/**
 * FunBlink Actions Example
 */

import { generateActionsString } from "@/app/lib/utils";
import idl from "../../../contract/blink.json";
import { AnchorProvider, Idl, Program } from "@project-serum/anchor";

import {
  ActionGetRequest,
  ActionPostRequest,
  ActionPostResponse,
  createActionHeaders,
} from "@solana/actions";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { projectsData } from "../../../../data/projectData";

// Create the standard headers for this route (including CORS)
const headers = createActionHeaders();

const DEFAULT_SOL_AMOUNT = 0.1;
const DEFAULT_SOL_ADDRESS = new PublicKey(
  "DYVT2LQ6U7PERSYgBLWDkrruhJxpTrWdK55yeVJqfg1c" // devnet wallet
);

export async function GET(req) {
  try {
    const requestUrl = new URL(req.url);
    const blink = await loadUserPDA(requestUrl);

    if (!blink) {
      throw new Error("Failed to load blink");
    }

    // Calculate baseHref
    const baseHref = new URL(
      `/api/actions?to=${blink.toPubkey}`,
      requestUrl.origin
    ).toString();
    const blinkActionsLink = JSON.parse(blink.link);

    // Parse the link and replace ${baseHref} with the actual baseHref
    const blinkData = JSON.parse(
      generateActionsString(blinkActionsLink.a, blinkActionsLink.m)
    );
    const actions = blinkData.actions.map(
      (action) => ({
        ...action,
        href: action.href.replace("${baseHref}", baseHref),
      })
    );
    console.log("Actions:", actions);

    const payload = {
      title: blink.title ?? "Actions Example - Transfer Native SOL",
      icon:
        blink.icon ??
        new URL("/solhealthy.png", requestUrl.origin).toString(),
      description: blink.description ?? "Transfer SOL to another Solana wallet",
      label: blink.label ?? "Transfer",
      links: {
        actions: actions,
      },
    };

    return Response.json(payload, {
      headers,
    });
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new Response(message, {
      status: 400,
      headers,
    });
  }
}

export async function POST(req) {
  try {
    const requestUrl = new URL(req.url);
    const { amount, toPubkey } = validatedQueryParams(requestUrl);

    const body = await req.json();

    // Validate the client provided input
    let account;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      return new Response('Invalid "account" provided', {
        status: 400,
        headers,
      });
    }

    const connection = new Connection(clusterApiUrl("mainnet-beta"));

    // SEND Token Mint Address
    const tokenMintAddress = new PublicKey(
      "SENDdRQtYMWaQrBroBrJ2Q53fgVuq95CV9UPGEvpCxa"
    );

    // Get the associated token addresses for the sender and receiver
    const fromTokenAccount = await getAssociatedTokenAddress(
      tokenMintAddress,
      account
    );
    const toTokenAccount = await getAssociatedTokenAddress(
      tokenMintAddress,
      new PublicKey(toPubkey)
    );

    // create a transaction
    const tx = new Transaction();
    tx.feePayer = account;
    tx.recentBlockhash = (
      await connection.getLatestBlockhash({ commitment: "finalized" })
    ).blockhash;

    // Check if the receiving account exists; if not, create it
    const toTokenAccountInfo = await connection.getAccountInfo(toTokenAccount);
    if (toTokenAccountInfo === null) {
      // Create the associated token account for the receiver
      const createToAccountIx = createAssociatedTokenAccountInstruction(
        account, // Payer of the transaction
        toTokenAccount, // Associated token account to be created
        new PublicKey(toPubkey), // Receiver's public key
        tokenMintAddress // The token mint
      );
      tx.add(createToAccountIx);
    }

    // Create a transfer instruction for SPL tokens
    const transferTokenInstruction = createTransferInstruction(
      fromTokenAccount, // Sender's associated token account
      toTokenAccount, // Receiver's associated token account
      account, // Owner of the sender's account
      amount * Math.pow(10, 6) // Number of tokens to send
    );

    tx.add(transferTokenInstruction);

    const serialTX = tx
      .serialize({ requireAllSignatures: false, verifySignatures: false })
      .toString("base64");

    const payload = {
      transaction: serialTX,
      message: `Send ${amount} SEND token to ${toPubkey.toBase58()}`,
    };

    return Response.json(payload, {
      headers,
    });
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new Response(message, {
      status: 400,
      headers,
    });
  }
}

// DO NOT FORGET TO INCLUDE THE `OPTIONS` HTTP METHOD
// THIS WILL ENSURE CORS WORKS FOR BLINKS
export const OPTIONS = async (req) => {
  return new Response(null, { headers });
};

function validatedQueryParams(requestUrl) {
  let toPubkey = DEFAULT_SOL_ADDRESS;
  let amount = DEFAULT_SOL_AMOUNT;

  try {
    if (requestUrl.searchParams.get("to")) {
      toPubkey = new PublicKey;
    }
  } catch (err) {
    throw "Invalid input query parameter: to";
  }

  try {
    if (requestUrl.searchParams.get("amount")) {
      amount = parseFloat;
    }

    if (amount <= 0) throw "amount is too small";
  } catch (err) {
    throw "Invalid input query parameter: amount";
  }

  return {
    amount,
    toPubkey,
  };
}
async function loadUserPDA(requestUrl) {
  const pda = requestUrl.searchParams.get("pda") ?? "";
  const id = requestUrl.searchParams.get("id");

  try {
    const dummyWallet = {
      publicKey: null,
      signTransaction: async (tx) => tx,
      signAllTransactions: async (txs) => txs,
    };

    const anchorProvider = new AnchorProvider(
      new Connection(clusterApiUrl("devnet")),
      dummyWallet,
      AnchorProvider.defaultOptions()
    );

    const program = new Program(
      idl,
      idl.metadata.address,
      anchorProvider
    );

    const blinks = await program.account.blinkList.fetch(pda);
    console.log("Blinks:", blinks);

    // Filter the blink entry by id
    const blink = (blinks.blinks).find(
      (blink) => blink.id === id
    );

    if (blink) {
      return blink;
    } else {
      console.error("Blink not found");
      return null;
    }
  } catch (error) {
    console.error("Error", error);
    return null;
  }
}