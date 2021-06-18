const formatVideos = require('../lib/utils/apiUtils');
const searchMockData = require('./searchMockData.json');
// const pool = require('../lib/utils/pool');
// const setup = require('../data/setup');
// const request = require('supertest');
// const app = require('../lib/app');
// require('dotenv').config();
// const getAllMockData = require('./getAllMockData.json');

describe('formatVideos', () => {
    // beforeEach(() => {
    //     return setup(pool);
    // });

    it('formats search results from YouTube API fetch', () => {
        const actual = formatVideos(searchMockData);
        const expected = [
            {
                vidId: 'minVseI19c4',
                title: 'Mock Material Girl - Madonna | Karaoke Version | KaraFun',
                thumbnail: 'https://i.ytimg.com/vi/minVseI19c4/default.jpg',
                channelName: 'KaraFun Karaoke',
                channelId: 'UCbqcG1rdt9LMwOJN4PyGTKg',
            },
            {
                vidId: 'ofe3HTe_myI',
                title: 'Borderline - Madonna | Karaoke Version | KaraFun',
                thumbnail: 'https://i.ytimg.com/vi/ofe3HTe_myI/default.jpg',
                channelName: 'KaraFun Karaoke',
                channelId: 'UCbqcG1rdt9LMwOJN4PyGTKg',
            },
            {
                vidId: 'Kyoxf5ivN54',
                title: 'Crazy For You - Madonna | Karaoke Version | KaraFun',
                thumbnail: 'https://i.ytimg.com/vi/Kyoxf5ivN54/default.jpg',
                channelName: 'KaraFun Karaoke',
                channelId: 'UCbqcG1rdt9LMwOJN4PyGTKg',
            },
            {
                vidId: 'hUgoIVt00HU',
                title: 'Like A Prayer - Madonna (Karaoke Version)',
                thumbnail: 'https://i.ytimg.com/vi/hUgoIVt00HU/default.jpg',
                channelName: 'EasyKaraoke',
                channelId: 'UC-tDkOgdiO7FPav2sF5nkUg',
            },
            {
                vidId: '6Uepuv3IF6c',
                title: "Like a Virgin - Madonna | Karaoke Version | KaraFun",
                thumbnail: 'https://i.ytimg.com/vi/6Uepuv3IF6c/default.jpg',
                channelName: 'KaraFun Karaoke',
                channelId: 'UCbqcG1rdt9LMwOJN4PyGTKg',
            },
        ]

        expect(actual).toEqual(expected);
    })







    // jest.mock('../lib/models/Video', () => ({
    //   getAllFromChannel: () => [
    //         {
    //             "kind": "youtube#searchResult",
    //             "etag": "J4LLTS1gDmTHwnz0ssKN-W8zTZk",
    //             "id": {
    //                 "kind": "youtube#video",
    //                 "videoId": "cn3e6KWtQU8"
    //             },
    //             "snippet": {
    //                 "publishedAt": "2016-08-03T02:28:12Z",
    //                 "channelId": "UCy8dBiuCv7608bij7iUH_jQ",
    //                 "title": "Nothing Left  to lose - Mat Kearney (Lyrics Karaoke) [ goodkaraokesongs.com ]",
    //                 "description": "I was only 19, you were 29 It's just 10 years, but its such a long time In a heartbeat, I would do it all again Late night sex, smokin' cigarettes I try real hard but I ...",
    //                 "thumbnails": {
    //                     "default": {
    //                         "url": "https://i.ytimg.com/vi/cn3e6KWtQU8/default.jpg",
    //                         "width": 120,
    //                         "height": 90
    //                     },
    //                     "medium": {
    //                         "url": "https://i.ytimg.com/vi/cn3e6KWtQU8/mqdefault.jpg",
    //                         "width": 320,
    //                         "height": 180
    //                     },
    //                     "high": {
    //                         "url": "https://i.ytimg.com/vi/cn3e6KWtQU8/hqdefault.jpg",
    //                         "width": 480,
    //                         "height": 360
    //                     }
    //                 },
    //                 "channelTitle": "Good Karaoke Songs",
    //                 "liveBroadcastContent": "none",
    //                 "publishTime": "2016-08-03T02:28:12Z"
    //             }
    //         },
    //       ],
    //   searchYouTube: () => [
    //         {
    //             "kind": "youtube#searchResult",
    //             "etag": "TtnvmE5MUhjttUOct2J0GugSuTA",
    //             "id": {
    //                 "kind": "youtube#video",
    //                 "videoId": "minVseI19c4"
    //             },
    //             "snippet": {
    //                 "publishedAt": "2013-11-25T12:29:55Z",
    //                 "channelId": "UCbqcG1rdt9LMwOJN4PyGTKg",
    //                 "title": "Mockterial Girl - Madonna | Karaoke Version | KaraFun",
    //                 "description": "* This version contains a low volume vocal guide to help you learn the song. The karaoke version without the vocal guide is available on www.karafun.com.",
    //                 "thumbnails": {
    //                     "default": {
    //                         "url": "https://i.ytimg.com/vi/minVseI19c4/default.jpg",
    //                         "width": 120,
    //                         "height": 90
    //                     },
    //                     "medium": {
    //                         "url": "https://i.ytimg.com/vi/minVseI19c4/mqdefault.jpg",
    //                         "width": 320,
    //                         "height": 180
    //                     },
    //                     "high": {
    //                         "url": "https://i.ytimg.com/vi/minVseI19c4/hqdefault.jpg",
    //                         "width": 480,
    //                         "height": 360
    //                     }
    //                 },
    //                 "channelTitle": "KaraFun Karaoke",
    //                 "liveBroadcastContent": "none",
    //                 "publishTime": "2013-11-25T12:29:55Z"
    //             }
    //         }
    //     ]
    // }));

    // describe('results routes', () => {
    //     beforeEach(() => {
    //         return setup(pool);
    //     });

    //   it('searches youtube for karaoke videos from query', () => {
    //     return request(app)
    //       .get('/api/v1/results/search')
    //       .send('Madonna')
    //       .then((res) => {
    //         expect(res.body).toEqual([
    //           {
    //             vidId: 'minVseI19c4',
    //             title: 'Mockterial Girl - Madonna | Karaoke Version | KaraFun',
    //             thumbnail: 'https://i.ytimg.com/vi/minVseI19c4/default.jpg',
    //           }
    //         ])
    //       })
    //   })


});
