import Video from '../models/Video.js';
import AppError from '../utils/AppError.js';
import { getMultipleVideoInfo } from '../utils/getMultipleVideosInfo.js';
import { getVideoInfo } from '../utils/getVideoInfo.js';
import { downloadVideo } from '../services/downloadVideo.js';

const getInfo = async (req, res, next) => {
  try {
    const mediaUrl = req.query.mediaUrl;
    const type = getType(mediaUrl);

    let info = '';
    if (type === 'video') info = await getVideoInfo(mediaUrl);
    if (type === 'channel' || type === 'playlist')
      info = await getMultipleVideoInfo(mediaUrl);
    if (type === undefined)
      return next(new AppError('incorrect URL', 400, 'Get Media Info'));

    res.status(200).json({ data: info });
  } catch (error) {
    error.operation = 'Get Media Info';
    next(error);
  }
};

const downloadMedia = async (req, res, next) => {
  try {
    let mediaUrl = req.body.mediaUrl;
    const mediaType = getType(mediaUrl);
    const multipleVideo = false;

    if (mediaType === 'videoInList') {
      const parsed = new URL(mediaUrl);
      parsed.searchParams.delete('list');
      mediaUrl = parsed.toString();
    } else if (mediaType === 'list' || mediaType === 'channel')
      multipleVideo = true;

    const args = { multipleVideo, videoUrl: mediaUrl, ...req.body };

    await downloadVideo(args);

    res.status(201).json({ message: 'Video Downloaded Successfully' });
  } catch (error) {
    console.log(error);
    error.operation = 'Download Media';
    next(error);
  }
};

const getType = (videoUrl) => {
  const parsed = new URL(videoUrl);
  const params = parsed.searchParams;

  if (params.has('list') && params.has('v')) return 'videoInList';
  if (params.has('v')) return 'video';
  if (params.has('list')) return 'playlist';

  const pathname = parsed.pathname;
  if (pathname.includes('@') || pathname.includes('/channel/'))
    return 'channel';
};

export { getInfo, downloadMedia };
