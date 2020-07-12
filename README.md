# ytdsc

Youtube to Discord webhooks

![BOT, Upload Feed: New upload: SKYRIM - Special Edition: Museum Tour - https://youtu.be/f2Q-EB8N1H0](https://i.3v.fi/1594560690-1788.png)

---

## Configuration

Configuration is done using environment variables:

#### Required

-   `CALLBACK` - the URL your HTTP server is listening on
-   `HOOKURL` - the URL to the Discord webhook ([what's this?](https://i.3v.fi/1479042763_ME6x.png))

#### Optional

-   `PORT` - change the port of the HTTP listener, 8000 by default
-   `CHID` - Youtube ID of the channel you want to subscribe to, UC1CSCMwaDubQ4rcYCpX40Eg by default
-   `UA` - the user-agent string used when making the POST request to Discord, ytdsc by default; you probably shouldn't change this
-   `UPLOAD_MESSAGE` - override the "New upload:" in the example above with your own custom message, so you can @everyone to your hearts content.

---

## Usage

Running the application is supported via Docker or directly using node. System requirements marked with a star (\*) may work using older versions, but older versions are not supported.

### Docker Setup

Requires Docker daemon 19.03\* or newer.

#### Via docker

```
docker pull docker.pkg.github.com/3ventic/ytdsc/ytdsc:latest
docker run -e 'CALLBACK=http://example.com:8000/' -e 'HOOKURL=https://discord.com/api/webhooks/...' -e 'CHID=youtube-channel-id-here' -e 'PORT=8000' -p '8000:8000/tcp' --restart=always docker.pkg.github.com/3ventic/ytdsc/ytdsc:latest
```

#### Via docker-compose

Requires docker-compose 1.13.0 or above.

1. Copy `docker-compose.override.example.yml` into `docker-compose.override.yml`
1. Edit the environment variables in the override.yml as documented above.
1. Start the service using `docker-compose up -d`

---

### Bare Setup

Requires node 12* or above, and npm 6* or above.

Recommended to run with `screen` or `tmux` or similar. Syntax below assumes bash or compatible shell. On Windows use Powershell and `$env:VARIABLE = 'value'` syntax.

```
$ npm install
$ CALLBACK=http://example.com:8000/ HOOKURL=https://discordapp.com/api/webhooks/... CHID=UCS1mJfvqhIuv0-MREnvTZIA node hook.js
```

### Systemd Setup

Requires node 12* or above, and npm 6* or above.

1. Copy `ytdsc.service` into `/etc/systemd/system/ytdsc.service`
1. Edit the enrivonment variables in the file.
1.
1. (Optional) Edit other unit configuration to match your needs.
1. Run `systemctl daemon-reload` to pick up the new service.
1. Run `systemctl start ytdsc.service`
1. (Recommended) Run `systemctl enable ytdsc.service` to automatically start the service on reboot.
