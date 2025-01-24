import { revalidatePath } from 'next/cache';

export async function POST(req:Request) {
  try {
    const { path } = await req.json(); // Receive the path to revalidate
    revalidatePath(path); // Revalidate the specified path
    return new Response('Path revalidated successfully', { status: 200 });
  } catch (error) {
    console.error('Error revalidating path:', error);
    return new Response('Failed to revalidate path', { status: 500 });
  }
}
