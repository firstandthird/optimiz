'use strict';
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const Svgo = require('svgo');
const fs = require('fs');
const os = require('os');
const async = require('async');
const path = require('path');

const compress = (file, level, callback) => {
  const handleResult = result => {
    if (result.length === 0) {
      return callback('Unable to compress image');
    }
    callback(null, result[0].path);
  };
  const options = {
    plugins: [imageminMozjpeg({ quality: level }), imageminPngquant({ quality: level })]
  };
  imagemin([file], os.tmpdir(), options).then(handleResult);
};

const svgOptimize = (file, callback) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      return callback(err);
    }
    new Svgo().optimize(data, (result) => {
      fs.writeFile(file, result.data, callback);
    });
  });
};

const crop = (im, pathToFile, origin, dims, gravity, callback) => {
  const gm = require('gm').subClass({ imageMagick: im });
  const pathToOutput = pathToFile;
  gm(pathToFile)
  .gravity(gravity)
  .crop(dims[0], dims[1], origin[0], origin[1])
  .write(pathToOutput, (err) => {
    callback(err, pathToOutput);
  });
};

module.exports.process = (imageFilePath, options, callback) => {
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

module.exports.compress = compress;
module.exports.svgOptimize = svgOptimize;
module.exports.crop = crop;
