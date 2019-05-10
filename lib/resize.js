const Jimp = require('jimp');
const TinyColor = require('tinycolor2');

module.exports = async (options, buffer) => {
  const { width, height, background } = options;
  const jimpImage = await Jimp.read(buffer);
  jimpImage.resize(width, height);
  if (background) {
    const color = new TinyColor(background);
    jimpImage.background(parseInt(color.toHex8(), 16));
  }
  return jimpImage.getBufferAsync(Jimp.AUTO);
};
