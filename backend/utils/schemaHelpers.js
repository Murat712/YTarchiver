export const requiredString = {
  type: String,
  required: true,
  trim: true,
};

export const requiredUniqueString = {
  ...requiredString,
  unique: true,
};

export const uniqueString = {
  type: String,
  trim: true,
  unique: true,
};
