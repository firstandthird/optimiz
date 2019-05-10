const Jimp = require('jimp');

module.exports = async (options, buffer) => {
  const { width, height, resizeMethodName } = options;
  const thumbJimp = await Jimp.read(buffer);

  if (resizeMethodName) {
    thumbJimp[resizeMethodName](width, height);
  } else {
    thumbJimp.resize(width, height);
  }
  // getBuffer requires a callback and doesn't work with util.promisify so return this Promise:
  return thumbJimp.getBufferAsync(Jimp.AUTO);
};
