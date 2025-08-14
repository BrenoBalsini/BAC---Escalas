import { useState, useEffect, type Dispatch, type SetStateAction } from 'react';

// Definindo o tipo do valor de retorno para maior clareza e reuso.
// É uma tupla: [valor, funçãoParaAtualizarOValor]
type UseLocalStorageReturnType<T> = [T, Dispatch<SetStateAction<T>>];

export function useLocalStorage<T>(key: string, initialValue: T): UseLocalStorageReturnType<T> {
  
  // A função dentro do useState só é executada na primeira renderização,
  // evitando a leitura do localStorage a cada re-renderização.
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Verificamos se 'window' está definido. Isso previne erros durante
    // a renderização no servidor (Server-Side Rendering - SSR) onde 'window' não existe.
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      // Tenta obter o item do localStorage pela chave.
      const item = window.localStorage.getItem(key);
      // Se o item existir, faz o parse do JSON. Se não, retorna o valor inicial.
      // Usamos "as T" para dizer ao TypeScript que confiamos que o dado salvo é do tipo T.
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      // Se ocorrer um erro no parse (ex: JSON malformado), loga o erro e retorna o valor inicial.
      console.error(`Error parsing localStorage key “${key}”:`, error);
      return initialValue;
    }
  });

  // useEffect para atualizar o localStorage sempre que o estado 'storedValue' mudar.
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      // Salva o estado atual no localStorage, convertendo-o para uma string JSON.
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error saving to localStorage key “${key}”:`, error);
    }
  }, [key, storedValue]); // A dependência garante que o efeito só rode quando a chave ou o valor mudarem.

  return [storedValue, setStoredValue];
}