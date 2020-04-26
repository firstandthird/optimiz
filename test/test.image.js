const tap = require('tap');
const optimiz = require('../index.js');
const fs = require('fs');
const path = require('path');
const testImageBase = 'snoopy.jpg';
const testImage = path.join(__dirname, testImageBase);
const testSVGBase = 'snoopy-pilot.svg';
const testSVG = path.join(__dirname, testSVGBase);
const os = require('os');

let testImageSize = 0;
let testSVGSize = 0;

testImageSize = fs.statSync(testImage).size;
testSVGSize = fs.statSync(testSVG).size;

// copy an image to temp
const makeTempFile = (originalFilePath) => {
  return new Promise(success => {
    const tmpFilePath = path.join(os.tmpdir(), path.basename(originalFilePath));
    const writeStream = fs.createWriteStream(tmpFilePath);
    writeStream.on('finish', () => {
      success(tmpFilePath);
    });
    fs.createReadStream(originalFilePath).pipe(writeStream);
  });
};

tap.test('should be able to resize an image', async t => {
  const fileBuffer = await makeTempFile(testImage);
  const options = {
    width: 50,
    background: 'green'
  };
  const outputFile = await optimiz.resize(options, fs.readFileSync(fileBuffer));
  // fs.writeFileSync('theoutput.jpg', outputFile);
  t.ok(outputFile.length < testImageSize);
  t.end();
});

tap.test('it should be able to compress an image', async t => {
  const fileBuffer = await makeTempFile(testImage);
  const options = {
    quality: 50
  };
  const outputFile = await optimiz.optimize(options, fs.readFileSync(fileBuffer));
  fs.writeFileSync('theoutput2.jpg', outputFile);
  t.ok(outputFile.length < testImageSize);
  t.end();
});

tap.test('it should be able to compress an svg image', async t => {
  const fileBuffer = await makeTempFile(testSVG);
  const options = {
    quality: 50
  };
  const outputFile = await optimiz.optimize(options, fs.readFileSync(fileBuffer));
  // fs.writeFileSync('theoutput2.svg', outputFile);
  t.ok(outputFile.length < testSVGSize);
  t.end();
});

tap.test('it should be able to thumbnail an image', async t => {
  const fileBuffer = await makeTempFile(testImage);
  const options = {
    height: 10
  };
  const outputFile = await optimiz.resize(options, fs.readFileSync(fileBuffer));
  // fs.writeFileSync('theoutput3.jpg', outputFile);
  t.ok(outputFile.length < testImageSize);
  t.end();
});

tap.test('it should be able to "cover" an image (verify the output image manually)', async t => {
  const fileBuffer = await makeTempFile(testImage);
  const options = {
    width: 50,
    type: 'cover'
  };
  const outputFile = await optimiz.resize(options, fs.readFileSync(fileBuffer));
  // look at this file and confirm if it appears correct:
  fs.writeFileSync('theoutput3_cover.jpg', outputFile);
  t.end();
});

tap.test('it should be able to "contain" an image (verify the output image manually)', async t => {
  const fileBuffer = await makeTempFile(testImage);
  const options = {
    height: 10,
    type: 'contain'
  };
  const outputFile = await optimiz.resize(options, fs.readFileSync(fileBuffer));
  // look at this file and confirm if it appears correct:
  fs.writeFileSync('theoutput3_contain.jpg', outputFile);
  t.end();
});
