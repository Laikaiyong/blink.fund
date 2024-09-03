import idl from "../../contract/blink.json";
import { AnchorProvider, Idl, Program, Wallet } from "@project-serum/anchor";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";

const programID = new PublicKey(idl.metadata.address);

const getProvider = (connection, wallet) => {
  if (!wallet) {
    throw new Error("Wallet is not connected");
  }
  const provider = new AnchorProvider(
    connection,
    wallet,
    AnchorProvider.defaultOptions()
  );
  return provider;
};

const createBlink = async (
  connection,
  wallet,
  title,
  iconURL,
  description,
  toPubkey,
  actions
) => {
  try {
    const anchorProvider = getProvider(connection, wallet);
    const program = new Program(idl, programID, anchorProvider);

    const blinkSeeds = [Buffer.from("blink_list"), wallet.publicKey.toBuffer()];
    const [blinkAccount] = PublicKey.findProgramAddressSync(
      blinkSeeds,
      program.programId
    );

    let id;
    try {
      const blinks = await program.account.blinkList.fetch(blinkAccount);
      const lastElement = (blinks.blinks)[
        (blinks.blinks).length - 1
      ];
      id = parseInt(lastElement.id) + 1;
    } catch (error) {
      console.log("Blink List not found");
      id = 0;
    }

    await program.methods
      .createBlink(
        id?.toString(),
        title,
        iconURL,
        description,
        "Transfer",
        toPubkey,
        generateActionsString()
      )
      .accounts({
        blinkList: blinkAccount,
        signer: anchorProvider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([])
      .rpc();

    return { status: "success", data: { id } };
  } catch (error) {
    return { status: "error", data: error };
  }
};

const fetchBlinkList = async (connection, wallet) => {
  try {
    const anchorProvider = getProvider(connection, wallet);
    const program = new Program(idl, programID, anchorProvider);

    const blinkSeeds = [Buffer.from("blink_list"), wallet.publicKey.toBuffer()];
    const [blinkAccount] = PublicKey.findProgramAddressSync(
      blinkSeeds,
      program.programId
    );
    const blinkAccountString = blinkAccount.toBase58();

    const blinks = await program.account.blinkList.fetch(blinkAccount);
    return { status: "success", data: { blinks }, pda: { blinkAccountString } };
  } catch (error) {
    return { status: "error", data: error };
  }
};

const generateActionsString = (
) => {
  const baseHref = "${baseHref}";

  const actionStrings = [];

    actionStrings.push(`{
        "label":"Stake & Contribute",
        "href":"${baseHref}&amount={amount}",
        "parameters":[
          {
            "name":"amount",
            "label":"Enter amount",
            "required":true
          }
        ]
      }`);

  return `{
      "actions":[${actionStrings.join(",")}]
    }`;
};

export { createBlink, fetchBlinkList, generateActionsString };