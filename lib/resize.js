const Jimp = require('jimp');
const TinyColor = require('tinycolor2');

module.exports = async ({ background, type = 'resize', width, height }, buffer) => {
  // if only one of width/height was provided, make it a square or let Jimp decide if it is able
  if (width && !height) {
    height = type === 'resize' ? Jimp.AUTO : width;
  }
  if (height && !width) {
    width = type === 'resize' ? Jimp.AUTO : height;
  }
  const jimpImage = await Jimp.read(buffer);
  jimpImage[type](width, height);
  if (background) {
    const color = new TinyColor(background);
    jimpImage.background(parseInt(color.toHex8(), 16));
  }
  return jimpImage.getBufferAsync(Jimp.AUTO);
};
