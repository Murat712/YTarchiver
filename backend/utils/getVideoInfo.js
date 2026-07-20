import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import AppError from './AppError.js';

const execFileAsync = promisify(execFile);

export const getVideoInfo = async (videoUrl) => {
  try {
    const { stdout } = await execFileAsync('yt-dlp', [
      '--dump-single-json',
      videoUrl,
    ]);

    const data = JSON.parse(stdout);
    const { channel, fulltitle, duration, subtitles, thumbnail } = data;

    const bestFormats = {};

    for (const f of data.formats) {
      if (f.vcodec === 'none' || !f.height) continue;

      const current = bestFormats[f.height];

      if (
        !current ||
        (f.quality ?? 0) > (current.quality ?? 0) ||
        ((f.quality ?? 0) === (current.quality ?? 0) &&
          (f.tbr ?? 0) > (current.tbr ?? 0))
      ) {
        bestFormats[f.height] = f;
      }
    }

    const videoFormats = Object.values(bestFormats)
      .sort((a, b) => a.height - b.height)
      .map((f) => ({
        formatId: f.format_id,
        resolution: `${f.height}p`,
        size: f.filesize ?? f.filesize_approx ?? null,
      }));

    const subtitleKeys = Object.keys(subtitles).filter(
      (key) => key !== 'live_chat',
    );

    const videoInfo = {
      channel,
      fulltitle,
      duration,
      thumbnail,
      subtitleKeys,
      videoFormats,
    };

    return videoInfo;
  } catch (error) {
    console.error(error);
    throw new AppError('Error getting video info', 500, 'Get Video Info');
  }
};
