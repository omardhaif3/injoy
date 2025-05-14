import { createClient, ObjectId } from 'mongodb';

// MongoDB connection
const uri = 'mongodb+srv://omardhaif3:Dh_77021061r@cluster0.wnpyz1y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = createClient(uri);

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    // Validate the ID
    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Post ID is required' }), 
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
    
    // Find the post by ID
    const post = await posts.findOne({ _id: new ObjectId(id) });
    
    if (!post) {
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
    
    return Response.json(post);
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch post' }), 
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