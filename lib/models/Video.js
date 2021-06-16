const fetch = require("node-fetch");

module.exports = class Video {
    // this only pulls the 50 most recent videos from the channel
    static async getAllFromChannel(channelId) {
        const { items } = await fetch(
            `https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&channelId=${channelId}&key=${process.env.YOUTUBE_KEY}`
        );
        return items;
    }

    static async searchYouTube(searchQuery) {
        const { items } = await fetch(
            `https://youtube.googleapis.com/youtube/v3/search?part=snippet&order=viewCount&maxResults=5&q=karaoke%20${searchQuery}&type=video&key=${process.env.YOUTUBE_KEY}`
        );
        return items;
    }
};
