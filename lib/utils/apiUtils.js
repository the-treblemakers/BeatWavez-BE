function formatVideos(videos) {
    return videos.map((video) => {
        return {
            vidId: video.id.videoId,
            title: video.snippet.title,
            thumbnail: video.snippet.thumbnails.default.url,
            channelName: song.snippet.channelTitle,
            channeId: song.snippet.channelId,
        };
    });
}

module.exports = formatVideos;
