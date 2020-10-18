const sharp = require('sharp');

module.exports = async ({ background, type = 'resize', width, height }, buffer) => {
  type = type === 'resize' ? 'cover' : type;
  const resizeOptions = { fit: type };
  if (width) {
    resizeOptions.width = width;
  }
  if (height) {
    resizeOptions.height = height;
  }
  if (background) {
    resizeOptions.background = background;
  }
  try {
    return sharp(buffer)
      .resize(resizeOptions)
      .toBuffer();
  } catch (e) {
    console.log(e);
  }
};
