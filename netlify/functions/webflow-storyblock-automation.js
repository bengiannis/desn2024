export default async (req, context) => {
  const apiKey = process.env.Webflow_API_Key;
  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };

  try {
    const body = await req.json();
    
    //`The user desn2024@gmail.com published the Story Oktober Fest (projects/oktober-fest)\nhttps://app.storyblok.com/#/me/spaces/1017572/stories/0/0/3325290`;

    // Regular expression to extract title, type, and slug
    const regex = /published the Story (.+) \(([^/]+)\/([^)]+)\)/;
    const matches = body.text.match(regex);

    if (!matches) {
      throw new Error(`No post info found`);
    }

    const storyTitle = matches[1]; // "Oktober Fest"
    const storyCollection = matches[2]; // "projects"
    const storySlug = matches[3]; // "oktober-fest"

    console.log(`Title: ${storyTitle}, Type: ${storyCollection}, Slug: ${storySlug}`);

    if (storyCollection != "projects") {
      throw new Error(`Not a project`);
    }

    const createCollectionItem = await fetch("https://api.webflow.com/v2/collections/65a3037472b070dda83f4b2d/items", {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        "isArchived": false,
        "isDraft": false,
        "fieldData": {
          "name": storyTitle,
          "slug": storySlug
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
