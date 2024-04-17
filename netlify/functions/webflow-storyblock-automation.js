export default async (req, context) => {
  const apiKey = process.env.Webflow_API_Key;
  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };

  const body = await req.json();
  const regex = /published the Story (.+) \(([^/]+)\/([^)]+)\)/;
  const matches = body.text.match(regex);

  if (!matches) {
    return;
  }

  const storyTitle = matches[1]; // "Oktober Fest"
  const storyCollection = matches[2]; // "projects"
  const storySlug = matches[3]; // "oktober-fest"

  if (storyCollection != "projects") {
    return;
  }

  const baseUrl = "https://api.webflow.com/v2/collections/65a3037472b070dda83f4b2d/items";
  let offset = 0;
  let total = null;
  let allItems = [];

  do {
    const url = `${baseUrl}?limit=100&offset=${offset}`;
    const fetchResponse = await fetch(url, {
      method: 'GET',
      headers: headers
    });
    const responseJson = await fetchResponse.json();
    allItems = allItems.concat(responseJson.items);

    // Update the offset for the next iteration
    offset += responseJson.items.length;

    // Set total from the response if it's not already set
    if (total === null) {
      total = responseJson.pagination.total;
    }
  } while (offset < total);

  // Check if any item matches the storySlug
  if (allItems.some(item => item.fieldData.slug === storySlug)) {
    return;
  }

  await fetch("https://api.webflow.com/v2/collections/65a3037472b070dda83f4b2d/items", {
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

  await fetch("https://api.webflow.com/v2/sites/65a2feccc5f42eb050926cbe/publish", {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      "publishToWebflowSubdomain": true,
      "customDomains": [
        "65c78a39fb54fe2ecb441db6"
      ]
    })
  });
};
