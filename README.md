# ytdsc

Youtube to Discord webhooks

## Usage

### Environment variables

#### Required

-   `CALLBACK` - the URL your HTTP server is listening on
-   `HOOKURL` - the URL to the Discord webhook ([what's this?](https://i.3v.fi/1479042763_ME6x.png))

#### Optional

-   `PORT` - change the port of the HTTP listener, 8000 by default
-   `CHID` - Youtube ID of the channel you want to subscribe to, UC1CSCMwaDubQ4rcYCpX40Eg by default
-   `UA` - the user-agent string used when making the POST request to Discord, ytdsc by default; you probably shouldn't change this

### System requirements

Requires either

1. docker 19.03 (and optionally docker-compose 1.13.0+), or
2. node 12+ and npm 6+

May work on older versions in some cases.

### Docker Setup

#### Via docker

```
docker pull docker.pkg.github.com/3ventic/ytdsc/ytdsc:latest
docker run -e 'CALLBACK=http://example.com:8000/' -e 'HOOKURL=https://discord.com/api/webhooks/...' -e 'CHID=youtube-channel-id-here' -e 'PORT=8000' -p '8000:8000/tcp' --restart=always docker.pkg.github.com/3ventic/ytdsc/ytdsc:latest
```

#### Via docker-compose

1. Copy `docker-compose.override.example.yml` into `docker-compose.override.yml`
2. Edit the environment variables in the override.yml as documented above.
3. Start the service using `docker-compose up -d`

### Bare Setup

Recommended to run with `screen` or `tmux` or similar. Syntax below assumes bash or compatible shell. On Windows use Powershell and `$env:VARIABLE = 'value'` syntax.

```
$ npm install
$ CALLBACK=http://example.com:8000/ HOOKURL=https://discordapp.com/api/webhooks/... CHID=UCS1mJfvqhIuv0-MREnvTZIA node hook.js
```

### Systemd Setup

1. Copy `ytdsc.service` into `/etc/systemd/system/ytdsc.service`
2. Edit the enrivonment variables in the file.
3. (Optional) Edit other unit configuration to match your needs.
4. Run `systemctl daemon-reload` to pick up the new service.
5. Run `systemctl start ytdsc.service`
6. (Recommended) Run `systemctl enable ytdsc.service` to automatically start the service on reboot.
