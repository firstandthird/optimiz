const Jimp = require('jimp');
const TinyColor = require('tinycolor2');

module.exports = async (options, buffer) => {
  const { background } = options;
  let { width, height, type } = options;
  if (!type) {
    type = 'resize';
  }
  // if only one of width/height was provided, make it a square:
  if (width && !height) {
    height = width;
  }
  if (height && !width) {
    width = height;
  }
  const jimpImage = await Jimp.read(buffer);
  jimpImage[type](width, height);
  if (background) {
    const color = new TinyColor(background);
    jimpImage.background(parseInt(color.toHex8(), 16));
  }
  return jimpImage.getBufferAsync(Jimp.AUTO);
};
