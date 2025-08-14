import { useState, useEffect, type Dispatch, type SetStateAction } from 'react';


type UseLocalStorageReturnType<T> = [T, Dispatch<SetStateAction<T>>];

export function useLocalStorage<T>(key: string, initialValue: T): UseLocalStorageReturnType<T> {
  
  
  const [storedValue, setStoredValue] = useState<T>(() => {
    
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      
      const item = window.localStorage.getItem(key);
      
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      
      console.error(`Error parsing localStorage key “${key}”:`, error);
      return initialValue;
    }
  });

  
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error saving to localStorage key “${key}”:`, error);
    }
  }, [key, storedValue]

  return [storedValue, setStoredValue];
}