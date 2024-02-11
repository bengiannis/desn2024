export default async (req, context) => {
  const apiKey = process.env.Webflow_API_Key;
  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };

  try {
    const body = await req.json();

    const createCollectionItem = await fetch("https://api.webflow.com/v2/collections/65a3037472b070dda83f4b2d/items", {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        "isArchived": false,
        "isDraft": false,
        "fieldData": {
          "name": body.text,
          "slug": "cadence-festival"
        }
      })
    });

    if (!createCollectionItem.ok) {
      // If the server response wasn't ok, throw an error
      throw new Error(`HTTP error! status: ${createCollectionItem.status}`);
    }

    const publishSite = await fetch("https://api.webflow.com/v2/sites/65a2feccc5f42eb050926cbe/publish", {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        "publishToWebflowSubdomain": true,
        "customDomains": [
          "65c78a39fb54fe2ecb441db6"
        ]
      })
    });

    if (!publishSite.ok) {
      // If the server response wasn't ok, throw an error
      throw new Error(`HTTP error! status: ${publishSite.status}`);
    }

    const data = await publishSite.json(); // Parse the JSON from the response
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
