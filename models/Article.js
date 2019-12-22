var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({

    title: {
        type: String,
        required: true,
        unique: true
    },

    summary: {
        type: String,
        required: true,
        unique: true
    },

    saved: {
        type: Boolean,
        required: true,
        default: false
    },

    comment: [{
        type: Schema.ObjectId,
        ref: 'Comment'
    }]
});

var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;