'use strict';
const async = require('async');
const path = require('path');
const compress = require('./lib/compress.js');
const svgOptimize = require('./lib/svg.js');
const crop = require('./lib/crop.js');

module.exports = (imageFilePath, options, callback) => {
  async.auto({
    optimizeSvg: (done) => {
      if (path.extname(imageFilePath).toLowerCase() === '.svg') {
        return svgOptimize(imageFilePath, done);
      }
      done(null, imageFilePath);
    },
    compress: ['optimizeSvg', (results, done) => {
      if (options.quality && options.quality !== 100) {
        return compress(imageFilePath, options.quality, (err, result) => {
          done(err, result);
        });
      }
      done(null, imageFilePath);
    }],
    crop: ['compress', (results, done) => {
      if (options.size) {
        return crop(options.imagemagick, results.compress, options.position, options.size, options.gravity, (err, result) => {
          done(err, result);
        });
      }
      done(null, results.compress);
    }],
  }, (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results.crop);
  });
};
