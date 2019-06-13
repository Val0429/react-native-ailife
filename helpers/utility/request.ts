enum EEnvironment {
    ReactNative,
    NodeJS,
    Browser
}

function getRunningEnvironment(): EEnvironment {
    /// test react native
    if (navigator && navigator.product === 'ReactNative') return EEnvironment.ReactNative;

    /// test browser
    if (window && document) return EEnvironment.Browser;

    /// test nodejs
    // Establish the root object, `window` in the browser, or `global` on the server.
    var root = this; 
    // Create a reference to this
    var _ = new Object();
    var isNode = false;
    // Export the Underscore object for **CommonJS**, with backwards-compatibility
    // for the old `require()` API. If we're not in CommonJS, add `_` to the
    // global object.
    if (typeof module !== 'undefined' && module.exports) isNode = true;
    if (isNode) return EEnvironment.NodeJS;

    throw "Detect running environment failed.";
}

interface CoreOptions {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';
    json?: boolean;
    body?: any;
    headers?: any;
}

interface RequestResult {
    statusCode: number;
}

interface RequestCallback {
    (err: any, res?: RequestResult, body?: any): void;
}

let runningEnvironment = getRunningEnvironment();
export function request(options: CoreOptions, callback?: RequestCallback) {
    switch (runningEnvironment) {
        case EEnvironment.Browser:
        case EEnvironment.ReactNative:
            let { url, json } = options;
            options.body = JSON.stringify(options.body);
            fetch(url, options)
                .then(async (resp) => {
                    let statusCode = resp.status;
                    let data = json ? await resp.json() : await resp.text();
                    callback && callback(null, { statusCode }, data);
                })
                .catch(err => {
                    callback && callback(err);
                })

            break;

        case EEnvironment.NodeJS:
            //let request = require('request');
            let request;
            request(options, callback);
            break;
    }
}