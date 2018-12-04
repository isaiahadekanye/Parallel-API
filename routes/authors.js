const express = require("express");
const router = express.Router();
const request = require("request");
const async = require('async');

let apiUrl = 'https://hatchways.io/api/assessment/blog/posts';
let apiUrlAuthors = 'https://hatchways.io/api/assessment/blog/authors';

router.get("/", async (req, res) => {
    const links = [apiUrl, apiUrlAuthors];

    apiCall(links, function (data) {
        let posts = [...data[0].posts];
        let authors = [...data[1].authors];
        let final = [];

        for (let i = 0; i < authors.length; i++) {
            let temp = {
                "bio": authors[i].bio,
                "firstName": authors[i].firstName,
                "id": authors[i].id,
                "lastName": authors[i].lastName,
                "posts": '',
                "tags": '',
                "totalLikeCount": '',
                "totalReadCount": ''
            };

            let totalPosts = posts.filter(post => post.authorId === authors[i].id);
            let totalTags = posts.filter(post => post.authorId === authors[i].id).map(key => key.tags);
            let countTotalLike = posts.filter(post => post.authorId === authors[i].id).reduce((prev, next) => prev + next.likes, 0);
            let countReadLike = posts.filter(post => post.authorId === authors[i].id).reduce((prev, next) => prev + next.reads, 0);

            let uniq = [].concat.apply([], totalTags);
            let finalTag = [...new Set(uniq)];

            temp.posts = totalPosts;
            temp.tags = finalTag;
            temp.totalLikeCount = countTotalLike;
            temp.totalReadCount = countReadLike;
            final.push(temp);
        }
        res.send(final);
    });
});

function apiCall(links, log) {

    const getPosts = function (opt, callback) {
        request(opt, (err, response, body) => {
            callback(err, JSON.parse(body));
        });
    };

    const functionArray = links.map((opt) => {
        return (callback) => getPosts(opt, callback);
    });


    async.parallel(
        functionArray, (err, results) => {
            if (err) {
                console.error('Error: ', err);
            } else {
                log(results);
            }
        }
    );

}


module.exports = router;