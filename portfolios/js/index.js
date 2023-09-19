let unshuffledPortfolios = [
    ["Sam Loiselle", "https://www.studio5am.design"],
    ["Cindy Xie", "https://xiaocnd.com"],
    ["Jessica Lo", "https://www.jxlo.design"],
    ["Nia Padua", "https://niapadua.com"],
    ["Ben Giannis", "https://bengiannis.com"],
    ["Seth Brown-Graham", "https://sethbg.webflow.io"],
    ["Mitchel Meneses-Sandoval", "https://mitchelmeneses.myportfolio.com"],
    ["Khushi Patel", "https://readymag.com/u68705229/4113311"],
    ["Lora Rotondo", "https://lorarotondo.myportfolio.com"],
    ["Karishma Singh", "https://karishmasingh2016.wixsite.com/mysite"],
    ["Reid Sandvold", "https://reid-sandvold.webflow.io"],
    ["Valentina Khan", "https://readymag.com/u1470846661/4130036"],
    ["Laiba Farrukh", "https://readymag.com/4158770"],
    ["Roslyn Nip", "https://roslyn-nip.github.io/index.html"],
    ["Naba Soleja", "https://www.nabadesign.com"],
    ["Nicole Nguyen", "https://nicolenguyen.ca"],
    ["Shayna Adivi", "https://www.shaynadesignz.com"],
    ["Shane Toyama", "https://shanet02.myportfolio.com"],
    ["Jonathan Chua", "https://jcchua.com"],
    ["Douglas Fong", "https://douglasfong.myportfolio.com"],
    ["Guneet Jassal", "https://embedportfolio.com"],
    ["Malak Elsharkawy", "https://malakelsharkawy.myportfolio.com"],
    ["Maddy North", "https://maddynorthdesign.com"],
    ["Nicole How", "https://nicole-how.webflow.io"],
    ["Victoria Sze", "https://victoriasze.myportfolio.com"],
    ["Dylan Fleuelling", "https://dylanfleuelling.myportfolio.com"],
    ["Abby Bingham", "https://abbybinghamdesign.myportfolio.com"],
    ["Kesha Upadhyay", "https://readymag.com/4121593"],
    ["Kenny Khuu", "https://www.kennykhuu.ca"],
    ["Sophia Zhou", "https://sophiazhou.myportfolio.com"],
    ["Nuha Aneez", "https://nuha-aneez.squarespace.com"],
    ["Joey Matar", "https://joey102cb3.myportfolio.com"],
    ["Stefan Vranjes", "https://stefanvranjesdesign.myportfolio.com/work"],
    ["Justin Correia", "https://justincorreia.design"],
    ["Jordan Yee", "https://jordanyee.myportfolio.com"],
    ["Kris Fan", "https://krisfan.myportfolio.com/work"],
    ["Rama Abdelwahed", "https://rama28.myportfolio.com"],
    ["Michelle Tieu", "https://michelletieu.design"],
    ["Alessia Magurno", "https://aless20bb89.myportfolio.com"],
    ["Saumya Wickramasinghe", "https://www.saumyaw.com"],
    ["Sirui Xu", "https://xusirui.wixsite.com/my-site-6"],
    ["Caitlin Yim", "https://caityim.myportfolio.com"],
    ["Ipun Kandola", "https://www.ipun.ca"],
    ["Christi Chu", "https://christichu.myportfolio.com/work"],
    ["Matteo De Sanctis", "https://matteodesanctis.com"],
    ["Han Blizzard", "https://hanblizzard.xyz"]
]

const portfolios = shuffle(unshuffledPortfolios);


for (let i = 0; i < portfolios.length; i++) {
    const name = portfolios[i][0];
    const link = portfolios[i][1];
    
    const portfolio = document.createElement("a");
    portfolio.href = link;
    portfolio.target = "_blank";
    portfolio.classList.add("portfolio");
    portfolio.classList.add("portfolio-before");

    const portfolioPreview = document.createElement("img");
    portfolioPreview.src = `./images/screenshots/${encodeURIComponent(encodeURIComponent(name))}.png`;
    portfolioPreview.classList.add("portfolio-preview");
    portfolio.appendChild(portfolioPreview);

    const portfolioName = document.createElement("div");
    portfolioName.classList.add("portfolio-name");
    portfolioName.innerText = name;
    portfolio.appendChild(portfolioName);

    const portfolioLink = document.createElement("div");
    portfolioLink.classList.add("portfolio-link");
    portfolioLink.innerText = link.replace("https://", "").replace("www.", "");
    portfolio.appendChild(portfolioLink);

    document.getElementById("portfolios").appendChild(portfolio);
}


//animate in
const portfolioElementsToAnimate = document.getElementById("portfolios").children;
for (let i = 0; i < portfolioElementsToAnimate.length; i++) {
    const portfolioElementToAnimate = portfolioElementsToAnimate[i];
    // navLinkElement.classList.add("portfolio-before");
    setTimeout(() => {
        portfolioElementToAnimate.classList.add("portfolio-transition");
        portfolioElementToAnimate.classList.remove("portfolio-before");
    }, 100 + (150 * Math.pow(i, 0.8)));
}


function shuffle(oldArray) {
    let shuffledArray = []

    let count = 0;

    while (oldArray.length > 0) {
        const randomSeed = "QmVuIEdpYW5uaXM=";
        let randomIndex = Math.floor(Math.random(randomSeed) * (oldArray.length));
        let newRandomIndex = Math.floor(Math.random() * (shuffledArray.length));

        shuffledArray.splice(Math.floor(newRandomIndex/((btoa(oldArray[randomIndex][0]) == randomSeed) + 1)), 0, oldArray[randomIndex]);
        oldArray.splice(randomIndex, 1);

        count++;
        if (count > 500) {
            // just in case
            // while loops are scary
            return oldArray;
            break;
        }
    }
  
    return shuffledArray;
}

function newTabToggled(event) {
    Array.from(document.getElementsByClassName("portfolio")).forEach(function(element) {
        element.target = (event.target.checked) ? "_blank" : "_self";
    });
}