import AppError from '../utils/AppError.js';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const downloadPath = path.join(__dirname, '../../downloads');
const downloadSpeed = '3M'; // daha sonra kullanıcı ayarlarından çekilecek

export const downloadVideo = async (args) => {
  const {
    multipleVideo,
    audioFormat,
    videoQuality,
    formatId,
    subs,
    videoUrl,
    onlyAudio,
  } = args;

  let downloadQualityArgs = multipleVideo
    ? ['-S', `vcodec:h264,res:${videoQuality},acodec:aac`]
    : ['-f', `${formatId}+bestaudio`, '-S', 'acodec:aac'];

  const formatArgs = onlyAudio
    ? ['-x', '-f', 'bestaudio', '--audio-format', audioFormat]
    : [...downloadQualityArgs, '--merge-output-format', 'mp4'];

  const subsArgs = subs ? ['--write-subs', '--sub-langs', `${subs}`] : [];

  const argsList = [
    ...formatArgs,
    ...subsArgs,
    '-r',
    downloadSpeed,
    '-P',
    downloadPath,
    videoUrl,
  ];

  try {
    const ytdlp = spawn('yt-dlp', argsList);

    ytdlp.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    ytdlp.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    const [code] = await once(ytdlp, 'close');

    if (code !== 0) {
      throw new AppError(
        'Error during the download process',
        500,
        'Video Downloading',
      );
      console.error(`Error Code ${code}`);
    }

    console.log(
      `Video Downloaded Successfully (${videoUrl}), Exited With Code ${code}`,
    );
  } catch (error) {
    console.error(error);
    throw new AppError(
      'Error during the download process',
      500,
      'Video Downloading',
    );
  }
};
