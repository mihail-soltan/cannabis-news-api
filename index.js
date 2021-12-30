import axios from "axios";
import express, { response } from "express";
import cheerio from "cheerio";

const PORT = process.env.PORT || 3000;

const app = express();
const newspapers = [
  {
    name: "hightimes",
    address: "https://hightimes.com/news/legalization/",
    base: "",
  },
  {
      name: "marijuanamoment",
      address: "https://www.marijuanamoment.net/",
      base: "",
  },
  {
      name: "cannabisnow",
      address: "https://cannabisnow.com/category/current-events/",
      base: "",
  },
  {
      name: "cannabisbusinesstimes",
      address: "https://www.cannabisbusinesstimes.com/news/",
      base: "",
  },
  {
      name: "newcannabisventures",
      address: "https://www.newcannabisventures.com/",
      base: "",
  }

];

const psychedArticles = [];
const cannabisArticles = [];

newspapers.forEach((newspaper) => {
    axios.get(newspaper.address).then((res)=>{
        const html = res.data;
        const $ = cheerio.load(html);

        $('a:contains("Cannabis")', html).each(function () {
            const title = $(this).text();
            const url = $(this).attr("href");

            cannabisArticles.push({
                title,
                url: newspaper.base + url,
                source: newspaper.name,
            })
        })
    })
})

app.get("/", (req, res) => {
  res.json("Welcome to my Cannabis News API");
});

app.get("/psychedelics", (req, res) => {
    newspapers.forEach((newspaper) => {
        axios.get(newspaper.address).then((res) => {
            const html = res.data;
            const $ = cheerio.load(html);
    
            $('a:contains("Psychedelics")', html).each(function(){
                const title = $(this).text();
                const url = $(this).attr("href");
    
                psychedArticles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })
        })
    })
res.json(psychedArticles)
console.log(psychedArticles.length)
});


app.get("/cannabis", (req, res) => {
    res.json(cannabisArticles)
    console.log(cannabisArticles.length)
})

app.get("/cannabis/:newspaperId", (req, res) => {
    const newspaperId = req.params.newspaperId;

    const newspaperAddress = newspapers.filter((newspaper) => newspaper.name == newspaperId)[0].address

    const newspaperBase = newspapers.filter((newspaper) => newspaper.name == newspaperId)[0].base;

    axios.get(newspaperAddress).then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const specificArticles = [];

        $('a:contains("Cannabis")', html).each(function() {
            const title = $(this).text();
            const url = $(this).attr("href");
            specificArticles.push({
                title,
                url: newspaperBase + url,
                source: newspaperId
            })
        })
        res.json(specificArticles)
        console.log(specificArticles.length)
    })
})

app.listen(PORT, () => {
  console.log(`server running on PORT ${PORT}`);
});
