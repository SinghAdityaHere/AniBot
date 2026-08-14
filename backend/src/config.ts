import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jikanUrl: process.env.JIKAN_API_URL || 'https://api.jikan.moe/v4',
  kitsuUrl: process.env.KITSU_API_URL || 'https://kitsu.io/api/edge',
  animeChanUrl: process.env.ANIMECHAN_API_URL || 'https://animechan.io/api/v1',
  aniDbApiKey: process.env.ANIDB_API_KEY || '',
};
