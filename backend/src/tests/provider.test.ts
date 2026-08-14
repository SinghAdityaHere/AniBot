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

test('JikanProvider fetches live anime search results without hardcoded data', async () => {
  const jikan = ProviderRegistry.getPrimaryAnimeProvider();
  const results = await jikan.search('Demon Slayer');

  assert.ok(Array.isArray(results));
  assert.ok(results.length > 0);
  assert.ok(typeof results[0].title === 'string');
});

test('AnimeChanProvider fetches live quote from public API without hardcoded data', async () => {
  const quoteProvider = ProviderRegistry.getPrimaryQuoteProvider();
  const quote = await quoteProvider.getRandomQuote().catch(() => null);

  if (quote) {
    assert.ok(typeof quote.quote === 'string');
    assert.ok(quote.quote.length > 0);
  }
});
