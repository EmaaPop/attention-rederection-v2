export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token r8_PIbNEA9kMktqQ6bdsue4KceE5ElqUmK4JCVH7",
      },
      body: JSON.stringify({
        version: "6359a0cab3ca6e4d3320c33d79096161208e9024d174b2311e5a21b6c7e1131c",
        input: {
          prompt: `professional headshot photo of ${prompt}, 8k, highly detailed`,
          num_outputs: 4,
          negative_prompt: "cartoon, illustration, anime, painting, drawing, distorted, blurry, deformed, watermark"
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate images');
    }

    const prediction = await response.json();
    return Response.json({ prediction });
  } catch (error) {
    return Response.json({ error: 'Failed to generate images' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const predictionId = searchParams.get('id');

  if (!predictionId) {
    return Response.json({ error: 'Prediction ID is required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.replicate.com/v1/predictions/${predictionId}`,
      {
        headers: {
          Authorization: "Token r8_PIbNEA9kMktqQ6bdsue4KceE5ElqUmK4JCVH7",
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch prediction');
    }

    const prediction = await response.json();
    return Response.json({ prediction });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch prediction' }, { status: 500 });
  }
} 