# Media API for thebuffalorugby.club

File uploads based on

```
https://www.bezkoder.com/node-js-express-file-upload/
```

## Javascript server hosted at Dreamhost.com

Domain name - api.kamilpatelscholarship.org
Using Proxy Server

## Preparation

```
https://panel.dreamhost.com/
```

Start proxy server

More / Proxy
Set url/to/proxy to 'api'

Set web directory to 'public'

Websites/Manage Websites / Manage / Additional setting / Paths

## Development Cycle

Edit server code

```
cd /Users/rastridge/code/experiments-nuxt3/nuxt3-brc-media-api/ vscode kps-api
```

To Upload server code to api.kamilpatelscholarship.org

```
rsync -av --delete --exclude "/node_modules" --exclude "/logs" --exclude "/public" --exclude ".DS_Store" --exclude "_notes"  --exclude ".git"  --exclude ".gitignore" --exclude ".vscode" ~/Code/kamilpatelscholarship.org/kps-api/ rastridge@buffalorugby.org:/home/rastridge/api.kamilpatelscholarship.org/
```

To Restart server

Shell access to api.kamilpatelscholarship.org

```
ssh rastridge@vps30249.dreamhostps.com
```

change to directory api.kamilpatelscholarship.org

```
cd /home/rastridge/api.kamilpatelscholarship.org
```

```
pm2 restart ecosystem.config.js
```
