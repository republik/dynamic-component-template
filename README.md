## Setup New Component

Replace REPOSLUG with your repo slug.

### Develop

```bash
cp test/.env.example test/.env
npm i
npm run dev:code
# run in seperate tab/window
npm run dev:server
open http://localhost:3000/
```

### Deploy

```bash
npm run build
npm run deploy
```

### Clear CDN

Goto https://app.keycdn.com/zones/purgeurl/$id and enter:

```
/s3/republik-assets/dynamic-components/REPOSLUG/index.js
```

If you change asset files be sure to purge those too.

