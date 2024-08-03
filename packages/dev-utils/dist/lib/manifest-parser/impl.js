"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManifestParserImpl = void 0;
exports.ManifestParserImpl = {
    convertManifestToString: (manifest, env) => {
        if (env === 'firefox') {
            manifest = convertToFirefoxCompatibleManifest(manifest);
        }
        return JSON.stringify(manifest, null, 2);
    },
};
function convertToFirefoxCompatibleManifest(manifest) {
    var _a;
    const manifestCopy = Object.assign({}, manifest);
    manifestCopy.background = {
        scripts: [(_a = manifest.background) === null || _a === void 0 ? void 0 : _a.service_worker],
        type: 'module',
    };
    manifestCopy.options_ui = {
        page: manifest.options_page,
        browser_style: false,
    };
    manifestCopy.content_security_policy = {
        extension_pages: "script-src 'self'; object-src 'self'",
    };
    delete manifestCopy.options_page;
    return manifestCopy;
}
