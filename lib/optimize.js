const sharp = require('sharp');

module.exports = async(options, buffer) => {
  try {
    const result = await sharp(buffer);
    if (options.png) {
      return result.png(options).toBuffer();
    }
    if (options.webp) {
      return result.webp(options).toBuffer();
    }
    // default is jpeg:
    return result.jpeg(options).toBuffer();
  } catch (err) {
    return buffer;
  }
};
