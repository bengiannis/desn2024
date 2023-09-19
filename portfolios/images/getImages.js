//remember to sync these
let unshuffledPortfolios = [
    ["Nia Padua", "https://niapadua.com/"]
]


var fs = require('fs')
var request = require('request');

// @param {String} token - String containing your API Key 
// @param {String} url - Encoded URI string container the URI you're targeting 
// @param {Integer} width - Integer indicating the width of your target render
// @param {Integer} height - Integer indicating the height of your target render
// @param {String} output - String specifying the output format, "image" or "json"
var token = 'AFQM1YS-72WM5AP-PX6AT17-8A4HJG7';
var width = 1280;
var height = 768;
var output = 'image';

for (let i = 0; i < unshuffledPortfolios.length; i++) {
    const name = encodeURIComponent(unshuffledPortfolios[i][0]);
    const url = encodeURIComponent(unshuffledPortfolios[i][1]);
    // Construct the query params and URL
    var query = "https://shot.screenshotapi.net/screenshot";
    query += `?token=${token}&url=${url}&width=${width}&height=${height}&output=${output}&delay=5000`;

    // Call the API and save the screenshot
    request.get({url: query, encoding: 'binary'}, (err, response, body) => {
        fs.writeFile(`./screenshots/${name}.png`, body, 'binary', err => {
            if (err) {
                console.log(err);
            } else {
                console.log("The file was saved!");
            }
        });
    });
}