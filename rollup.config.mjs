import { nodeResolve } from '@rollup/plugin-node-resolve';
import { input } from '@testing-library/user-event/dist/cjs/event/input.js';
export default {
    input: 'js/vertexAI.js',
    output: {
        file: './output/bundle.js',
        format: 'es'
    },
    plugins: [nodeResolve()],
};