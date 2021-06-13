const express = require('express');
const dotenv = require('dotenv');
const app = new express();
const cors_app = require('cors');

dotenv.config();

function getNULInstance(analyzeParams, text, emotion, res) {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key
        }),
        serviceUrl: api_url
    });

    var analyzeParamsNLU = {};
    if (text) {
        analyzeParamsNLU = {
            'text': analyzeParams,
            'features': {
                'keywords': {
                    'emotion': emotion,
                    'sentiment': !emotion,
                    'limit': 5,
                }
            },
        };
    } else {
        analyzeParamsNLU = {
            'url': analyzeParams,
            'features': {
                'keywords': {
                    'emotion': emotion,
                    'sentiment': !emotion,
                    'limit': 5,
                },
            },
        };
    }

    naturalLanguageUnderstanding.analyze(analyzeParamsNLU).then(data => {
        res.status(200);
        if (data.result.keywords) {
            var dataFilter = data.result.keywords.sort((a, b) => a.count < b.count ? 1 : -1)[0];
            console.log(dataFilter);
            if (emotion) {
                if (dataFilter.emotion) {
                    res.send(dataFilter.emotion);
                } else {
                    res.send('Without data');
                }

            } else {
                if (dataFilter.sentiment.label) {
                    res.send(dataFilter.sentiment.label);
                } else {
                    res.send('Without data');
                }
            }
        } else {
            res.send('Without data');
        }
    }).catch(error => {
        res.status(500);
        res.send(error);
    });
}

app.use(express.static('client'))

app.use(cors_app());

app.get("/", (req, res) => {
    res.render('index.html');
});

app.get("/url/emotion", (req, res) => {
    getNULInstance(req.query.url, false, true, res);
});

app.get("/url/sentiment", (req, res) => {
    getNULInstance(req.query.url, false, false, res);
});

app.get("/text/emotion", (req, res) => {
    getNULInstance(req.query.text, true, true, res);
});

app.get("/text/sentiment", (req, res) => {
    getNULInstance(req.query.text, true, false, res);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

