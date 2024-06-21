import { defineConfig } from 'vite';
import path from 'path';
// import obfuscator from 'rollup-plugin-obfuscator';

export default defineConfig({
    server: {
        port: 8080,
    },
    build: {
        outDir: path.resolve(__dirname, 'dist'),
        rollupOptions: {
            output: {
                entryFileNames: 'assets/transcendence-[hash].js',
                assetFileNames: 'assets/transcendence-[hash].[ext]',
            },
            // plugins: [
            //     obfuscator({
            //         compact: true,
            //         controlFlowFlattening: false,
            //         deadCodeInjection: false,
            //         deadCodeInjectionThreshold: 1,
            //         debugProtection: false,
            //         debugProtectionInterval: false,
            //         disableConsoleOutput: true,
            //         identifierNamesGenerator: 'hexadecimal',
            //         log: false,
            //         renameGlobals: false,
            //         rotateStringArray: true,
            //         selfDefending: true,
            //         stringArray: true,
            //         stringArrayEncoding: 'base64',
            //         stringArrayThreshold: 0.75,
            //         transformObjectKeys: true,
            //         unicodeEscapeSequence: false,
            //     }),
            // ]
        },
    },
    resolve: {
        alias: {
            '@styles': path.resolve(__dirname, 'src/styles/'),
            '@src': path.resolve(__dirname, 'src/'),
            '@utils': path.resolve(__dirname, 'src/utils/'),
            '@security': path.resolve(__dirname, 'src/security/'),
            '@services': path.resolve(__dirname, 'src/services/'),
            '@router': path.resolve(__dirname, 'src/router/'),
            '@components': path.resolve(__dirname, 'src/components/'),
            '@helpers': path.resolve(__dirname, 'src/helpers/'),
            '@views': path.resolve(__dirname, 'src/views/'),
        },
    },
});
