var parseXml = require('xml2js').parseString;
var pubSubHubbub = require("pubsubhubbub");
var request = require("request").defaults({
    'headers': {
        'User-Agent': process.env.UA || 'ytdsc'
    }
});

if (!process.env.CALLBACK) {
    console.error("Please specify the CALLBACK environment variable");
    process.exit(1);
}

var topic = 'https://www.youtube.com/xml/feeds/videos.xml?channel_id=' + (process.env.CHID || 'UC1CSCMwaDubQ4rcYCpX40Eg');
var hub = 'https://pubsubhubbub.appspot.com/';

var pubSubSubscriber = pubSubHubbub.createServer({
    callbackUrl: process.env.CALLBACK
});
pubSubSubscriber.listen(process.env.PORT || 8000);

pubSubSubscriber.on('listen', function () {
    pubSubSubscriber.on('subscribe', function (data) {
        console.log(data.topic + ' subscribed');
    });
    pubSubSubscriber.on('unsubscribe', function (data) {
        console.log(data.topic + ' unsubscribed');
    });
    pubSubSubscriber.subscribe(topic, hub, function (err) {
        if (err) console.error(err);
    });
    pubSubSubscriber.on('feed', function (data) {
        var feedstr = data.feed.toString('utf8');
        parseXml(feedstr, function (err, feed) {
            if (err) {
                console.error("ERROR", err);
            }
            console.log("JSON:", JSON.stringify(feed.feed));
            if (feed.feed.entry) {
                feed.feed.entry.forEach(postToHook);
            } else console.log("No entry");
        });
    });
});

function postToHook(entry) {
    if (entry["published"]) {
        request.post(process.env.HOOKURL, {
            form: {
                content: "New upload: " + entry["title"] + " - https://youtu.be/" + entry['yt:videoId'],
                embeds: [{
                    video: "https://youtu.be/" + entry['yt:videoId']
                }]
            }
        });
    }
}


process.on('SIGINT', function () {
    pubSubSubscriber.unsubscribe(topic, hub, function (err) { if (err) console.log(err); process.exit(0); });
});
