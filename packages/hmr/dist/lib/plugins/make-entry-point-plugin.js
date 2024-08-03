"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeEntryPointPlugin = makeEntryPointPlugin;
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * make entry point file for content script cache busting
 */
function makeEntryPointPlugin() {
    const cleanupTargets = new Set();
    const isFirefox = process.env.__FIREFOX__ === 'true';
    return {
        name: 'make-entry-point-plugin',
        generateBundle(options, bundle) {
            const outputDir = options.dir;
            if (!outputDir) {
                throw new Error('Output directory not found');
            }
            for (const module of Object.values(bundle)) {
                const fileName = path_1.default.basename(module.fileName);
                const newFileName = fileName.replace('.js', '_dev.js');
                switch (module.type) {
                    case 'asset':
                        // map file
                        if (fileName.endsWith('.map')) {
                            cleanupTargets.add(path_1.default.resolve(outputDir, fileName));
                            const originalFileName = fileName.replace('.map', '');
                            const replacedSource = String(module.source).replaceAll(originalFileName, newFileName);
                            module.source = '';
                            fs.writeFileSync(path_1.default.resolve(outputDir, newFileName), replacedSource);
                            break;
                        }
                        break;
                    case 'chunk': {
                        fs.writeFileSync(path_1.default.resolve(outputDir, newFileName), module.code);
                        if (isFirefox) {
                            const contentDirectory = extractContentDir(outputDir);
                            module.code = `import(browser.runtime.getURL("${contentDirectory}/${newFileName}"));`;
                        }
                        else {
                            module.code = `import('./${newFileName}');`;
                        }
                        break;
                    }
                }
            }
        },
        closeBundle() {
            cleanupTargets.forEach(target => {
                fs.unlinkSync(target);
            });
        },
    };
}
/**
 * Extract content directory from output directory for Firefox
 * @param outputDir
 */
function extractContentDir(outputDir) {
    const parts = outputDir.split(path_1.default.sep);
    const distIndex = parts.indexOf('dist');
    if (distIndex !== -1 && distIndex < parts.length - 1) {
        return parts.slice(distIndex + 1);
    }
    throw new Error('Output directory does not contain "dist"');
}
