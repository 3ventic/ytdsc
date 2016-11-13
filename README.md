# ytdsc

Youtube to Discord webhooks

## Usage

### Environment variables

#### Required

`CALLBACK` - the URL your HTTP server is listening on
`HOOKURL` - the URL to the Discord webhook ([what's this?](https://i.3v.fi/1479042763_ME6x.png))

#### Optional

`PORT` - change the port of the HTTP listener, 8000 by default
`CHID` - Youtube ID of the channel you want to subscribe to, UC1CSCMwaDubQ4rcYCpX40Eg by default
`UA` - the user-agent string used when making the POST request to Discord, ytdsc by default; you probably shouldn't change this

### Example

`CALLBACK=http://example.com:8000/ HOOKURL=https://discordapp.com/api/webhooks/... CHID=UCS1mJfvqhIuv0-MREnvTZIA node hook.js`
