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

var channelId = process.env.CHID || 'UC1CSCMwaDubQ4rcYCpX40Eg';
var topic = 'https://www.youtube.com/xml/feeds/videos.xml?channel_id=' + channelId;
var hub = 'https://pubsubhubbub.appspot.com/';

var lastId = '';
var isExiting = false;

var pubSubSubscriber = pubSubHubbub.createServer({
    callbackUrl: process.env.CALLBACK
});
pubSubSubscriber.listen(process.env.PORT || 8000);

pubSubSubscriber.on('denied', function () {
    console.error('DENIED', JSON.stringify(arguments));
    process.exit(2);
});

pubSubSubscriber.on('error', function () {
    console.error('ERROR', JSON.stringify(arguments));
    process.exit(3);
});

setInterval(function () {
    pubSubSubscriber.subscribe(topic, hub, function (err) { if (err) console.error(err); });
}, 86400000); // refresh subscription every 24 hours

pubSubSubscriber.on('listen', function () {
    // log successful subscriptions
    pubSubSubscriber.on('subscribe', function (data) {
        console.log(data.topic + ' subscribed until ' + (new Date(data.lease * 1000)).toLocaleString());
    });
    // resubscribe, if unsubscribed while running
    pubSubSubscriber.on('unsubscribe', function (data) {
        console.log(data.topic + ' unsubscribed');
        if (!isExiting) {
            pubSubSubscriber.subscribe(topic, hub, function (err) { if (err) console.error(err); });
        }
    });
    // Subscribe on start
    pubSubSubscriber.subscribe(topic, hub, function (err) {
        if (err) console.error(err);
    });
    // Parse responses
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
    console.log('Last', lastId, 'current', entry['yt:videoId'][0]);
    // Ensure it's a video upload and not a duplicate entry
    if (entry["published"] && entry["yt:channelId"] == channelId && lastId != entry['yt:videoId'][0]) {
        lastId = entry['yt:videoId'][0];
        console.log('newlast', lastId);
        request.post(process.env.HOOKURL, {
            form: {
                content: "New upload: " + entry["title"] + " - https://youtu.be/" + entry['yt:videoId'][0],
                embeds: [{
                    video: "https://youtu.be/" + entry['yt:videoId'][0]
                }]
            }
        });
    }
}


process.on('SIGINT', function () {
    isExiting = true;
    // Unsubscribe on exit
    pubSubSubscriber.unsubscribe(topic, hub, function (err) { if (err) console.log(err); process.exit(0); });
});
