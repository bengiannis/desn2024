export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const data = await req.json(); // Parse the JSON body
  return new Response(JSON.stringify(data), { 
    status: 200,
    headers: {
      "Content-Type": "application/json" // Set the Content-Type header
    }
  });
};
