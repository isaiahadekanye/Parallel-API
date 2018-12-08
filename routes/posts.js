const express = require("express");
const router = express.Router();
const request = require("request");
const async = require('async');

let apiUrl = '';

const error = [{
    "error": "Tag parameter is required"
}, {
    "error": "sortBy parameter is invalid"
}, {
    "error": "direction parameter is invalid"
}];

const sortBy = ["id", "reads", "likes", "popularity"];
const direction = ["desc", "asc"];


router.get("/", async (req, res) => {

    const tagIndividual = req.query.tag;
    const sortByIndividual = req.query.sortBy;
    const directionIndividual = req.query.direction;

    if (!tagIndividual) return res.status(400).send(error[0]);
    if (sortByIndividual && !(sortBy.includes(sortByIndividual))) return res.status(400).send(error[1]);
    if (directionIndividual && !(direction.includes(directionIndividual))) return res.status(400).send(error[2]);

    const tag = tagIndividual.split(",");

    apiCall(tag, function (data) {
        let final = [];
        let i = 0;
        let len = tag.length;

        while (i < len) {
            let temp = data[i].posts;
            for (let a = 0; a < temp.length; a++) {
                if (final.findIndex(x => x.id === temp[a].id) === -1) {
                    final.push(temp[a]);
                }
            }
            i++;
        }

        if (directionIndividual === "desc") {
            final.sort((a, b) => b[sortByIndividual] - a[sortByIndividual]);
        } else {
            final.sort((a, b) => a[sortByIndividual] - b[sortByIndividual]);
        }

        res.send(final);
    });
});

function apiCall(tag, log) {

    const getPosts = function (opt, callback) {
        request(opt, (err, response, body) => {
            callback(err, JSON.parse(body));
        });
    };

    const functionArray = tag.map((opt) => {
        return (callback) => getPosts(apiUrl + "?tag=" + opt, callback);
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