import Joi from 'joi';

const mediaUrlField = Joi.string()
  .uri()
  .pattern(
    /^https?:\/\/(www\.|m\.)?(youtube\.com\/(?:watch||playlist|channel|c\/|user\/|@)|youtu\.be\/).+$/,
  );

export const mediaUrlSchema = Joi.object({
  mediaUrl: mediaUrlField.required(),
});

export const downloadMediaSchema = Joi.object({
  mediaUrl: mediaUrlField.required(),
  onlyAudio: Joi.bool(),
  audioFormat: Joi.string().valid('opus', 'mp3'),
  formatId: Joi.string(),
  videoQuality: Joi.number(),
  subs: Joi.array().items(Joi.string()),
})
  .without('onlyAudio', ['formatId', 'videoQuality'])
  .with('audioFormat', 'onlyAudio')
  .with('onlyAudio', 'audioFormat')
  .or('onlyAudio', 'formatId', 'videoQuality')
  .xor('formatId', 'videoQuality');
