var express = require("express");

var logger = require("morgan");

var mongoose = require("mongoose");

var axios = require("axios");

var cheerio = require("cheerio");

var db = require("./models");

var PORT = 4440;

var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);


app.get("/scrape", function (req, res) {

    axios.get("https://www.nytimes.com/section/technology").then(function (response) {

        var $ = cheerio.load(response.data);

        var nyTimes = "https://www.nytimes.com";

        $("h2.css-1j9dxys").each(function (i, element) {

            var result = {};

            result.title = $(this)
                .text();
            result.summary = $(this)
                .next().text();
            result.link = `${nyTimes}${$(this).parent().attr("href")}`;

            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });

        res.send("Scrape Complete!");
    });
});

app.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("comment")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// axios.get("https://www.nytimes.com/section/technology").then(function (response) {

//     var $ = cheerio.load(response.data);

//     var nyTimes = "https://www.nytimes.com";

//     var results = [];

//     $("h2.css-1j9dxys").each(function (i, element) {

//         var title = $(element).text();

//         var summary = $(element).next().text();

//         var link = `${nyTimes}${$(element).parent().attr("href")}`;

//         results.push({
//             title: title,
//             summary: summary,
//             link: link,
//         });
//     });

//     console.log(results);
//     console.log(results);

// });
// 
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});




