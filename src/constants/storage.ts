export const STORAGE_KEYS = {
  LAST_LOBBY_CODE: "lastLobbyCode",
  LAST_MATCH_UUID: "lastMatchUUID",
};


export const getStorageItem = (storageKey: string, defaultValue: any) => {
  const saved = localStorage.getItem(storageKey);
  return saved ? JSON.parse(saved) : defaultValue;
}

export const setStorageItem = (storageKey: string, value: any) => {
  localStorage.setItem(storageKey, JSON.stringify(value));
}