import test from 'node:test';
import assert from 'node:assert';
import { ProviderRegistry } from '../providers/ProviderRegistry';

test('ProviderRegistry supplies primary and secondary providers', () => {
  const primaryAnime = ProviderRegistry.getPrimaryAnimeProvider();
  const secondaryAnime = ProviderRegistry.getSecondaryAnimeProvider();
  const quoteProvider = ProviderRegistry.getPrimaryQuoteProvider();

  assert.strictEqual(primaryAnime.name, 'jikan');
  assert.strictEqual(secondaryAnime.name, 'anidb');
  assert.strictEqual(quoteProvider.name, 'animechan');
});

test('JikanProvider falls back gracefully on search query', async () => {
  const jikan = ProviderRegistry.getPrimaryAnimeProvider();
  const results = await jikan.search('Demon Slayer');

  assert.ok(Array.isArray(results));
  assert.ok(results.length > 0);
  assert.ok(results[0].title.length > 0);
});

test('AnimeChanProvider returns quote fallback if external API is unreachable', async () => {
  const quoteProvider = ProviderRegistry.getPrimaryQuoteProvider();
  const quote = await quoteProvider.getRandomQuote();

  assert.ok(quote.quote.length > 0);
  assert.ok(quote.character && quote.character.length > 0);
});
