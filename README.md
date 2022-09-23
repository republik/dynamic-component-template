## Setup New Component

Replace REPOSLUG with your repo slug.

### Develop

```bash
cp test/.env.example test/.env
npm i
npm run dev
open http://localhost:3000/
```

#### Remote Styleguide

The styleguide from the `plattform` is available on S3 as a tar ball.

The pattern is:
```
https://republik-assets-dev.s3.amazonaws.com/packages/project-r-styleguide-$BRANCH.tgz
https://republik-assets-dev.s3.amazonaws.com/packages/project-r-styleguide-$BRANCH-$COMMIT.tgz
```

Make sure to run the install with legacy peer deps: `npm i --legacy-peer-deps`. If you want to update to the latest version of a branch without a commit id make sure to first clean your cache. For example installing the latest main commit:

```bash
npm cache clean -f
npm i --legacy-peer-deps https://republik-assets-dev.s3.amazonaws.com/packages/project-r-styleguide-main.tgz
```

Commits need to pass styleguide tests to be uploaded. The upload is performed through a github action on push and can be inspected in case of issues, usually takes 3 minutes from pushing to beeing available on S3.

#### Local Styleguide

You may also use a local styleguide, just use a realative path instead of the S3 url, e.g. like this:

```
npm i ../plattform/packages/styleguide
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
