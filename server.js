var express = require("express");
var mongoose = require("mongoose");

// var logger = require("morgan");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.PORT || 4440;


var app = express();

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
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
    // Grab every document in the Articles collection
    db.Article.find({})
        .then(function (dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

app.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

app.post("/articles/save/:id", function (req, res) {
    // Use the article id to find and update its saved boolean
    Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
        // Execute the above query
        .exec(function (err, data) {
            // Log any errors
            if (err) {
                console.log(err);
            }
            else {

                res.send(data);
            }
        });
});

app.post("/articles/delete/:id", function (req, res) {
    //Anything not saved
    Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": false })

        .exec(function (err, data) {
            // Log any errors
            if (err) {
                console.log(err);
            }
            else {
                res.send(data);
            }
        });
});


// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});