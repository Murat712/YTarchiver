import mongoose from 'mongoose';

import {
  requiredString,
  requiredUniqueString,
} from '../utils/schemaHelpers.js';

const videoSchema = new mongoose.Schema(
  {
    path: { ...requiredUniqueString },
    videoId: { ...requiredUniqueString },
    videoUrl: { ...requiredUniqueString },
    channel: { ...requiredString },
    title: { ...requiredString },
    duration: { ...requiredString },
    thumbnail: { ...requiredString },
    subtitles: { ...requiredString },
    mediaFormat: { ...requiredString, enum: ['video', 'mp3', 'opus'] },
    videoQuality: {
      ...requiredString,
      required: function () {
        return this.mediaFormat === 'video';
      },
    },
  },
  { timestamps: true },
);

const Video = mongoose.model('Video', videoSchema);

export default Video;
