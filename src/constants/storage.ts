export const STORAGE_KEYS = {
  IS_LOGGED_IN: "isLoggedIn",
};


export const getStorageItem = (storageKey: string, defaultValue: any) => {
  const saved = localStorage.getItem(storageKey);
  return saved ? JSON.parse(saved) : defaultValue;
}

export const setStorageItem = (storageKey: string, value: string) => {
  localStorage.setItem(storageKey, JSON.stringify(value));
}