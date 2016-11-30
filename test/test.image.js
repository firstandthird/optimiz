/* eslint-disable no-undef */
const chai = require('chai');
const optimiz = require('../index.js');
const fs = require('fs');
const path = require('path');
const testImageBase = 'snoopy.jpg';
const testImage = path.join(__dirname, testImageBase);
const testSVGBase = 'snoopy-pilot.svg';
const testSVG = path.join(__dirname, testSVGBase);
const os = require('os');
const useImageMagick = true; // can change this to false to use GraphicsMagick

let testImageSize = 0;
let testSVGSize = 0;

describe('can be used as a library', () => {
  before((done) => {
    testImageSize = fs.statSync(testImage).size;
    testSVGSize = fs.statSync(testSVG).size;
    done();
  });
  // copy an image to temp
  const makeTempFile = (originalFilePath, done) => {
    const tmpFilePath = path.join(os.tmpdir(), path.basename(originalFilePath));
    const writeStream = fs.createWriteStream(tmpFilePath);
    writeStream.on('finish', () => {
      done(tmpFilePath);
    });
    fs.createReadStream(originalFilePath).pipe(writeStream);
  };

  it('should be able to crop an image', (done) => {
    makeTempFile(testImage, (fileName) => {
      const options = {
        imagemagick: useImageMagick,
        position: [20, 20],
        size: [100, 100]
      };
      optimiz(fileName, options, (err, outputFile) => {
        chai.expect(err).to.equal(null);
        chai.expect(fs.statSync(outputFile).size).to.be.below(testImageSize);
        done();
      });
    });
  });
  it('should be able to compress an image', (done) => {
    makeTempFile(testImage, (fileName) => {
      const options = {
        imagemagick: useImageMagick,
        quality: 50
      };
      optimiz(fileName, options, (err, outputFile) => {
        chai.expect(err).to.equal(null);
        chai.expect(fs.statSync(outputFile).size).to.be.below(testImageSize);
        done();
      });
    });
  });
  it('should be able to optimize an svg image with svgo', (done) => {
    makeTempFile(testSVG, (fileName) => {
      const options = {
        imagemagick: useImageMagick,
        quality: 50
      };
      optimiz(fileName, options, (err, outputFile) => {
        chai.expect(err).to.equal(null);
        chai.expect(fs.statSync(outputFile).size).to.be.below(testSVGSize);
        done();
      });
    });
  });
  it('should be able to crop/compress an image without error', (done) => {
    makeTempFile(testImage, (fileName) => {
      const options = {
        imagemagick: useImageMagick,
        quality: 80,
        position: [10, 10],
        size: [120, 120]
      };
      optimiz(fileName, options, (err, outputFile) => {
        chai.expect(err).to.equal(null);
        chai.expect(fs.statSync(outputFile).size).to.be.below(testImageSize);
        done();
      });
    });
  });
  it('should be able to crop/compress an svg image without error', (done) => {
    makeTempFile(testSVG, (fileName) => {
      const options = {
        imagemagick: useImageMagick,
        quality: 80,
        position: [10, 10],
        size: [120, 120]
      };
      optimiz(fileName, options, (err, outputFile) => {
        chai.expect(err).to.equal(null);
        chai.expect(fs.statSync(outputFile).size).to.be.below(testSVGSize);
        done();
      });
    });
  });
});
