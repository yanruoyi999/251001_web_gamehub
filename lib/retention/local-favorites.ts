export const LOCAL_FAVORITES_STORAGE_KEY = 'gamehub:favorites';
export const LOCAL_FAVORITES_CHANGE_EVENT = 'gamehub:favorites-change';

export function readLocalFavorites(): Set<string> {
  if (typeof window === 'undefined') {
    return new Set();
  }

  try {
    const raw = window.localStorage.getItem(LOCAL_FAVORITES_STORAGE_KEY);
    if (!raw) return new Set();

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? new Set(
          parsed.filter((item): item is string => typeof item === 'string')
        )
      : new Set();
  } catch (error) {
    console.error('解析本地收藏数据失败', error);
    return new Set();
  }
}

export function writeLocalFavorites(values: Set<string>) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(
      LOCAL_FAVORITES_STORAGE_KEY,
      JSON.stringify(Array.from(values))
    );
    window.dispatchEvent(new Event(LOCAL_FAVORITES_CHANGE_EVENT));
  } catch (error) {
    console.error('写入本地收藏数据失败', error);
  }
}

export function updateLocalFavorite(key: string, nextState: boolean) {
  if (typeof window === 'undefined') {
    return;
  }

  const favorites = readLocalFavorites();
  if (nextState) {
    favorites.add(key);
  } else {
    favorites.delete(key);
  }
  writeLocalFavorites(favorites);
}

export function readLocalFavoriteSlugs() {
  return Array.from(readLocalFavorites())
    .filter(key => key.startsWith('slug:'))
    .map(key => key.slice('slug:'.length).trim().toLowerCase())
    .filter(Boolean);
}
