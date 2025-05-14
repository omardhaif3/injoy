import { createClient, ObjectId } from 'mongodb';

// MongoDB connection
const uri = 'mongodb+srv://omardhaif3:Dh_77021061r@cluster0.wnpyz1y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = createClient(uri);

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { optionId } = await request.json();
    
    // Validate required parameters
    if (!id || !optionId) {
      return new Response(
        JSON.stringify({ error: 'Post ID and option ID are required' }), 
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    await client.connect();
    const database = client.db('injoy');
    const posts = database.collection('posts');
    
    // Update the vote count for the specified option
    const result = await posts.updateOne(
      { 
        _id: new ObjectId(id),
        "options._id": optionId 
      },
      { 
        $inc: { "options.$.votes": 1 } 
      }
    );
    
    if (result.matchedCount === 0) {
      return new Response(
        JSON.stringify({ error: 'Post or option not found' }), 
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    return Response.json({ success: true });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to register vote' }), 
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } finally {
    await client.close();
  }
}