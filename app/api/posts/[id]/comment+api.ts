import { createClient, ObjectId } from 'mongodb';

// MongoDB connection
const uri = 'mongodb+srv://omardhaif3:Dh_77021061r@cluster0.wnpyz1y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = createClient(uri);

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { text } = await request.json();
    
    // Validate required parameters
    if (!id || !text) {
      return new Response(
        JSON.stringify({ error: 'Post ID and comment text are required' }), 
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
    
    // Create new comment
    const comment = {
      _id: new ObjectId().toString(),
      text,
      createdAt: new Date().toISOString()
    };
    
    // Add comment to the post
    const result = await posts.updateOne(
      { _id: new ObjectId(id) },
      { $push: { comments: comment } }
    );
    
    if (result.matchedCount === 0) {
      return new Response(
        JSON.stringify({ error: 'Post not found' }), 
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    return Response.json(comment);
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to add comment' }), 
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