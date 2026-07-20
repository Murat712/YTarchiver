import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import AppError from './AppError.js';

const execFileAsync = promisify(execFile);

export const getMultipleVideoInfo = async (videoUrl) => {
  try {
    const { stdout } = await execFileAsync('yt-dlp', [
      '--flat-playlist',
      '--dump-single-json',
      videoUrl,
    ]);

    const data = JSON.parse(stdout);

    const videosInfo = {
      creator:
        data.uploader ??
        data.channel ??
        data.entries?.[0]?.uploader ??
        data.entries?.[0]?.channel ??
        null,

      title: data.title,

      totalDuration: data.entries.reduce(
        (sum, video) => sum + (video.duration ?? 0),
        0,
      ),

      videos: data.entries.map((video) => ({
        title: video.title,
        thumbnail: video.thumbnails.at(-1)?.url ?? null,
      })),
    };

    return videosInfo;
  } catch (error) {
    console.error(error);
    throw new AppError('Error getting video info', 500, 'Get Video Info');
  }
};
