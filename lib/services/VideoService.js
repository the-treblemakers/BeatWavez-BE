/* eslint-disable indent */
const Video = require('../models/Video');

module.exports = class VideoService {
  static async mungeVidIds(channelId) {
    const data = await Video.getAllFromChannel(channelId);

    return data.map((video) => {
      return {
        vidId: video.id.videoId,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.default.url,
      };
    });
  }
};
