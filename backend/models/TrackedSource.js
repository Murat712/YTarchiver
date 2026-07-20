import mongoose from 'mongoose';

import {
  requiredString,
  requiredUniqueString,
} from '../utils/schemaHelpers.js';

const TrackedSourceSchema = new mongoose.Schema(
  {
    sourceType: {
      ...requiredString,
      enum: ['channel', 'playlist'],
    },
    sourceUrl: {
      ...requiredUniqueString,
    },
  },
  { timestamps: true },
);

const TrackedSource = mongoose.model('TrackedSource', TrackedSourceSchema);

export default TrackedSource;
