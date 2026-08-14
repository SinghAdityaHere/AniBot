import test from 'node:test';
import assert from 'node:assert';
import { JikanNormalizer } from '../providers/jikan/JikanNormalizer';
import { AniDBNormalizer } from '../providers/anidb/AniDBNormalizer';

test('JikanNormalizer transforms raw MAL payload to canonical Anime', () => {
  const sampleMal = {
    mal_id: 20,
    title: 'Naruto',
    title_english: 'Naruto',
    synopsis: 'Ninja journey of Naruto Uzumaki',
    images: { jpg: { large_image_url: 'https://example.com/naruto.jpg' } },
    year: 2002,
    status: 'Finished Airing',
    type: 'TV',
    episodes: 220,
    score: 7.9,
    genres: [{ mal_id: 1, name: 'Action' }],
    studios: [{ mal_id: 1, name: 'Pierrot' }],
  };

  const normalized = JikanNormalizer.normalize(sampleMal);

  assert.strictEqual(normalized.id, 'mal_20');
  assert.strictEqual(normalized.title, 'Naruto');
  assert.strictEqual(normalized.year, 2002);
  assert.strictEqual(normalized.episodes, 220);
  assert.strictEqual(normalized.score, 7.9);
  assert.strictEqual(normalized.genres[0].name, 'Action');
  assert.strictEqual(normalized.studios[0].name, 'Pierrot');
});

test('AniDBNormalizer enriches primary Anime cleanly', () => {
  const primary = {
    id: 'mal_20',
    title: 'Naruto',
    alternativeTitles: ['Naruto'],
    genres: [{ id: 1, name: 'Action' }],
    studios: [],
    externalIds: { jikan: '20' },
  };

  const aniDbData = {
    alternativeTitles: ['NARUTO -ナルト-'],
    externalIds: { aniDb: '239' },
  };

  const enriched = AniDBNormalizer.enrich(primary, aniDbData);

  assert.deepStrictEqual(enriched.alternativeTitles, ['Naruto', 'NARUTO -ナルト-']);
  assert.strictEqual(enriched.externalIds.jikan, '20');
  assert.strictEqual(enriched.externalIds.aniDb, '239');
});
