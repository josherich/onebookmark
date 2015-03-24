var express = require('express');
var router = express.Router();
var w2v = require('word2vec');
var Model = {};

router.get('/simi', function(req, res, next) {
    var topics = req.query.topics.split('-');
    var cates = req.query.cates.split('-');
    var scores = {};
    cates.map(function(cate) {
        var sum = 0;
        topics.map(function(topic, i) {
            sum += getSimilarity(cate, topic) * ((i % 2 == 0) ? 2 : 1) * ((cate == topic) ? 2 : 1);
        });
        scores[cate] = sum;
    });
    res.send({ scores: scores });
});

function setupW2v() {
    w2v.loadModel('./vectors.txt', function(err, model) {
        if (err) {
            console.log('err in loading vectors.txt');
            return;
        }
        console.log('vectors.txt loaded');

        Model = model;
    });
}

function getSimilarity(w1, w2) {
    if (!w1 || !w2) {
        return 'error, word errors';
    }
    return Model.similarity(w1, w2);
}

setupW2v();
module.exports = router;
