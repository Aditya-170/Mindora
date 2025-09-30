import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  const data = await req.formData();
  const file = data.get('file');
  if (!file) {
    return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });
  }
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const uploadRes = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: 'study-platform/rooms' }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }).end(buffer);
    });
    return new Response(JSON.stringify({ secure_url: uploadRes.secure_url }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}