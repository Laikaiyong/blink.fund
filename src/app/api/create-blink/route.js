import {
  ActionPostResponse,
  createActionHeaders,
  createPostResponse,
  ActionGetResponse,
  ActionPostRequest,
} from "@solana/actions";

export const POST = async (req) => {
    const body = await req.json(); 
      
    // insert transaction logic here
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Encoding, Accept-Encoding',
    }  
        
    const payload = await createPostResponse({
      fields: {
        transaction,
        message: "Optional message to include with transaction",
      },
    });
    
    return Response.json(payload, {
      headers,
    });
  };