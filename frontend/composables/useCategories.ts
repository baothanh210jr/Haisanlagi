type Category = { id: number | string; name: string; slug: string; image: string };

export function useCategories(limit = 8, ttlMs = 300_000) {
  const categories = useState<Category[]>('categories', () => []);
  const loaded = useState<boolean>('categories_loaded', () => false);
  const lastTs = useState<number>('categories_ts', () => 0);

  async function ensureCategories(force = false) {
    const fresh = Date.now() - (lastTs.value || 0) < ttlMs;
    if (!force && loaded.value && fresh) return;
    loaded.value = true;
    try {
      const qs = new URLSearchParams();
      qs.set('limit', String(limit));
      const res = await fetch(`/api/directus/items/categories?${qs.toString()}`);
      const data = await res.json();
      categories.value = ((data.data || []) as any).sort(
        (a: any, b: any) => (a.sort ?? 0) - (b.sort ?? 0)
      );
      lastTs.value = Date.now();
    } catch {
      categories.value = [];
      lastTs.value = Date.now();
    }
  }

  return { categories, ensureCategories };
}
