import axios from 'axios';
import { AnimeFact } from '@anibot/shared';

const POPULAR_FACT_ANIMES = ['fma', 'naruto', 'bleach', 'one_piece', 'attack_on_titan', 'dragon_ball', 'demon_slayer'];

export class AnimeFactsProvider {
  public name = 'anime_facts';

  public async getRandomFact(): Promise<AnimeFact> {
    const randomAnime = POPULAR_FACT_ANIMES[Math.floor(Math.random() * POPULAR_FACT_ANIMES.length)];

    // Primary endpoint: Anime Facts REST API repo endpoint
    try {
      const res = await axios.get(`https://anime-facts-rest-api.herokuapp.com/api/v1/${randomAnime}`, {
        timeout: 5000,
      });

      const facts = res.data?.data || [];
      if (Array.isArray(facts) && facts.length > 0) {
        const item = facts[Math.floor(Math.random() * facts.length)];
        return {
          id: item.id || `fact_${Date.now()}`,
          fact: item.fact,
          animeTitle: randomAnime.replace(/_/g, ' ').toUpperCase(),
        };
      }
    } catch (err: any) {
      console.warn(`[AnimeFactsProvider] Primary facts API unreachable (${err?.message}), trying secondary facts API...`);
    }

    // Secondary live endpoint: Usagikochits/Facts API
    try {
      const res = await axios.get(`https://api.jikan.moe/v4/random/anime`, {
        timeout: 5000,
      });

      const anime = res.data?.data;
      if (anime && anime.background) {
        return {
          id: `mal_bg_${anime.mal_id}`,
          fact: anime.background,
          animeTitle: anime.title,
        };
      }
    } catch (err: any) {
      console.warn(`[AnimeFactsProvider] Secondary facts API failed: ${err?.message}`);
    }

    return {
      id: `fact_default`,
      fact: 'Akira Toriyama, creator of Dragon Ball, drew inspiration from the 16th-century Chinese novel Journey to the West.',
      animeTitle: 'Dragon Ball',
    };
  }
}
