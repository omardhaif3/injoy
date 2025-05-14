import { createClient } from 'mongodb';

// MongoDB connection
const uri = 'mongodb+srv://omardhaif3:Dh_77021061r@cluster0.wnpyz1y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = createClient(uri);

export async function GET(request: Request) {
  try {
    await client.connect();
    const database = client.db('injoy');
    const posts = database.collection('posts');
    
    // Get all posts, sorted by most recent first
    const result = await posts.find({}).sort({ createdAt: -1 }).toArray();
    
    return Response.json(result);
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } finally {
    await client.close();
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, options } = body;
    
    // Validate required fields
    if (!question || !options || !Array.isArray(options) || options.length < 2) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request. Question and at least 2 options are required.' 
        }), 
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
    
    // Create new post document
    const post = {
      question,
      options: options.map(option => ({
        _id: new ObjectId().toString(),
        text: option.text,
        votes: 0
      })),
      comments: [],
      createdAt: new Date().toISOString()
    };
    
    const result = await posts.insertOne(post);
    
    if (result.acknowledged) {
      return Response.json({
        _id: result.insertedId,
        ...post
      });
    } else {
      throw new Error('Failed to create post');
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create post' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } finally {
    await client.close();
  }
}