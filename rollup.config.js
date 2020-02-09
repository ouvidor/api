import commonjs from '@rollup/plugin-commonjs';
import progress from 'rollup-plugin-progress';
import analyze from 'rollup-plugin-analyzer';
import visualizer from 'rollup-plugin-visualizer';

export default {
  input: 'src/index.js',
  output: {
    file: 'build/bundle.js',
    format: 'cjs',
  },
  plugins: [
    progress(),
    commonjs(),
    analyze({ summaryOnly: true }),
    visualizer({ filename: 'build/stats.html', template: 'treemap' }), // gera uma página html
  ],
  external: [
    'express',
    'cors',
    'sequelize',
    'bcrypt',
    'dotenv',
    'jsonwebtoken',
    'node-geocoder',
    'nodemailer',
    'nodemailer-express-handlebars',
    'yup',
    'express-handlebars',
    'util',
    'path',
    'multer',
    'crypto',
  ],
};
