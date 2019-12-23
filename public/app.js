// Grab the articles as a json
$.getJSON("/articles", function (data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
        $("#articles").prepend(`
        <div class="card">
        <div class="card-body" data-id=${data[i]._id}>
        <h3 class="card-title">${data[i].title}</h3>
        <p class="card-text">${data[i].summary}</p>
        <a href="${data[i].link}" class="btn btn-primary">Article Link</a>
        <button type="button" class="btn btn-success save">Save</button>
        <button type="button" class="btn btn-danger delete">Delete</button>`);
    }
});

$(".scrape").on("click", function() {
    $.ajax({
        method: "GET",
        url: "/scrape",
    }).done(function(data) {
        console.log(data)
        window.location = "/"
    })
});

$(".save").on("click", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/save/" + thisId
    }).done(function(data) {
        window.location = "/"
    })
});

$(".delete").on("click", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/delete/" + thisId
    }).done(function(data) {
        window.location = "/saved"
    })
});
