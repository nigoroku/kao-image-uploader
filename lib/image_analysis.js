'use strict';

const async = require("async");
const fs = require('fs');
const express = require("express");
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');

const WATSON_KEY = "3QALONR67CPfpxC0404e0RX2u5NzOUxnWUKqK0gZ6NQd";
const WATSON_CLASSIFIER = "DefaultCustomModel_1398963545";

const visual_recognition = new VisualRecognitionV3({
    iam_apikey: WATSON_KEY,
    version: '2018-03-19'
});

function analyzeImage(image, callback) {
    var fileName = image.path;

    var params = {
        images_file: fs.createReadStream(fileName),
        classifier_ids: [WATSON_CLASSIFIER],
        threshold: 0.6
    };
    visual_recognition.classify(params, function (err, res) {

        if (err) {
            console.log(err)
        } else {
            console.log(res)
            image.analysis = res
            callback()
        }
    });
}


module.exports = {
    analyzeImage,
};
