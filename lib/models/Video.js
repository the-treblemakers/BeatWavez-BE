/* eslint-disable quotes */
const fetch = require('node-fetch');

module.exports = class Video {
  static async getAllFromChannel() {
    const { items } = await fetch(
      `https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&channelId=${channelId}&key=${process.env.YOUTUBE_KEY}`
    );
  }
};
