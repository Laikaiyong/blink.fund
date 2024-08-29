import {
    ActionPostResponse,
    createActionHeaders,
    createPostResponse,
    ActionGetResponse,
    ActionPostRequest,
  } from "@solana/actions";
  
  export const runtime = 'edge';

  export async function GET() {
      
    return Response.json({
        "status": "Error"
    });
    }