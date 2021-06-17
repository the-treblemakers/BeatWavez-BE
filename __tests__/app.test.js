const formatVideos = require("../lib/utils/apiUtils");
const searchMockData = require("./searchMockData.json");

describe("formatVideos", () => {
    it("formats search results from YouTube API fetch", () => {
        const actual = formatVideos(searchMockData);
        const expected = [
            {
                vidId: "minVseI19c4",
                title: "Mock Material Girl - Madonna | Karaoke Version | KaraFun",
                thumbnail: "https://i.ytimg.com/vi/minVseI19c4/default.jpg",
                channelName: "KaraFun Karaoke",
                channelId: "UCbqcG1rdt9LMwOJN4PyGTKg",
            },
            {
                vidId: "ofe3HTe_myI",
                title: "Borderline - Madonna | Karaoke Version | KaraFun",
                thumbnail: "https://i.ytimg.com/vi/ofe3HTe_myI/default.jpg",
                channelName: "KaraFun Karaoke",
                channelId: "UCbqcG1rdt9LMwOJN4PyGTKg",
            },
            {
                vidId: "Kyoxf5ivN54",
                title: "Crazy For You - Madonna | Karaoke Version | KaraFun",
                thumbnail: "https://i.ytimg.com/vi/Kyoxf5ivN54/default.jpg",
                channelName: "KaraFun Karaoke",
                channelId: "UCbqcG1rdt9LMwOJN4PyGTKg",
            },
            {
                vidId: "hUgoIVt00HU",
                title: "Like A Prayer - Madonna (Karaoke Version)",
                thumbnail: "https://i.ytimg.com/vi/hUgoIVt00HU/default.jpg",
                channelName: "EasyKaraoke",
                channelId: "UC-tDkOgdiO7FPav2sF5nkUg",
            },
            {
                vidId: "6Uepuv3IF6c",
                title: "Like a Virgin - Madonna | Karaoke Version | KaraFun",
                thumbnail: "https://i.ytimg.com/vi/6Uepuv3IF6c/default.jpg",
                channelName: "KaraFun Karaoke",
                channelId: "UCbqcG1rdt9LMwOJN4PyGTKg",
            },
        ];

        expect(actual).toEqual(expected);
    });
});
