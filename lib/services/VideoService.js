const Video = require("../models/Video");
const { default: formatVideos } = require("../utils/apiUtils");

module.exports = class VideoService {
    static async mungeVidIds(channelId) {
        const data = await Video.getAllFromChannel(channelId);

        const shapedData = formatVideos(data);
        return shapedData;
    }

    static async loadYouTubeResults(searchQuery) {
        const data = await Video.searchYouTube(searchQuery);
        const shapedData = formatVideos(data);
        return shapedData;
    }
};
