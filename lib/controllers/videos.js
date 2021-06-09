/* eslint-disable keyword-spacing */
/* eslint-disable indent */
const { Router } = require('express');
const VideoService = require('../services/VideoService');

module.exports = Router().get('/', async (req, res, next) => {
  try {
    const songs = await VideoService.mungeVidIds(req.body);
    res.send(songs);
  } catch (err) {
    next(err);
  }
});
