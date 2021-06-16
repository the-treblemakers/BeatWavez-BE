function formatVideos(videos) {
    return videos.map((video) => {
        return {
            vidId: video.id.videoId,
            title: video.snippet.title,
            thumbnail: video.snippet.thumbnails.default.url,
            channelName: video.snippet.channelTitle,
            channeId: video.snippet.channelId,
        };
    });
}

module.exports = formatVideos;
