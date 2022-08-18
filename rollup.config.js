// see https://github.com/rozek/build-configuration-study

import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser'

export default {
  input: './src/aframe-billboard-component.ts',
  output: [
    {
      file:     './dist/aframe-billboard-component.js',
      format:    'iife', // module is loaded for side-effects only
      noConflict:true,
      sourcemap: true,
      plugins: [terser({ format:{ comments:false, safari10:true } })],
    },{
      file:     './dist/aframe-billboard-component.esm.js',
      format:   'esm',
      sourcemap:true,
    }
  ],
  external: [
    'aframe','three'
  ],
  plugins: [
    typescript(),
  ],
};