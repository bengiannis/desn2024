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

  const fetchExistingCollectionItems = await fetch("https://api.webflow.com/v2/collections/65a3037472b070dda83f4b2d/items", {
    method: 'GET',
    headers: headers
  });
  const existingCollectionItems = await fetchExistingCollectionItems.json();

  if (existingCollectionItems.items.some(item => item.fieldData.slug == storySlug)) {
    return;
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
};
