# Builder.io Learnosity Plugin

This is entirely cribbed from https://github.com/BuilderIO/builder/tree/main/plugins/cloudinary and probably not fit for purpose, let alone production use.

## Run locally

    npm run start

In builder, add `http://localhost:1268/plugin-learnosity.system.js` as a plugin.

## Deploy

I haven't (yet) set up a proper deployment process, so the dist directory needs to be generated manually.

To deploy a new version

    npm run build
    git add .
    git commit -m "<message>"
    git push

In builder, add a cdn URL for the `plugin-learnosity.system.js` file, e.g. `https://raw.githubusercontent.com/timbarclay/builder-learnosity-plugin/refs/heads/main/dist/plugin-learnosity.system.js`.