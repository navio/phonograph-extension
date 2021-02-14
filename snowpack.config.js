/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
    alias: {
        background: "./src/background",
        options: "./src/options",
        popup: "./src/popup",
        player: "./src/player",
        ui: "./src/ui"
    },
    mount: {
        "assets": {url: "/"},
        "src": "/src",
        
    },
    plugins: [
        // '@snowpack/plugin-webpack'
        /* ... */
    ],
    routes: [
        /* Enable an SPA Fallback in development: */
        // {"match": "routes", "src": ".*", "dest": "/index.html"},
    ],
    optimize: {
            bundle: true,
            minify: true,
            target: 'es2018',
    },
    packageOptions: {
        polyfillNode: true,
        source: 'local'
    },
    devOptions: {
        /* ... */
    },
    buildOptions: {
        /* ... */
        out: "dist",
        metaUrlPath: "phonograph_meta" 
    },
};