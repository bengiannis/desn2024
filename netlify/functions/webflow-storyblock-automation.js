export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const url = 'https://api.webflow.com/v2/collections/65a3037472b070dda83f4b2d/items';
  const apiKey = process.env.Webflow_API_Key;
  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
  const body = JSON.stringify({
    "isArchived": false,
    "isDraft": false,
    "fieldData": {
      "name": "Cadence Festival",
      "slug": "cadence-festival"
    }
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body
    });

    if (!response.ok) {
      // If the server response wasn't ok, throw an error
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // Parse the JSON from the response
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // Catch and respond with errors if the fetch fails
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
