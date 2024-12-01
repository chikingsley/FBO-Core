import glsl from 'vite-plugin-glsl';
import topLevelAwait from "vite-plugin-top-level-await";
import path from 'path';

const isCodeSandbox = 'SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env;

export default {
    root: 'src/',
    publicDir: '../static/',
    base: './',
    server: {
        host: true,
        open: !isCodeSandbox
    },
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        sourcemap: true
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@shaders': path.resolve(__dirname, './src/Experience/Shaders'),
            '@utils': path.resolve(__dirname, './src/Experience/Utils'),
            '@experience': path.resolve(__dirname, './src/Experience')
        }
    },
    plugins: [
        glsl({
            include: [
                '**/*.glsl',
                '**/*.vert',
                '**/*.frag',
            ],
            exclude: null,
            warnDuplicatedImports: true,
            defaultExtension: 'glsl',
            compress: false,
            watch: true
        }),
        topLevelAwait({
            promiseExportName: "__tla",
            promiseImportName: i => `__tla_${i}`
        })
    ]
}
