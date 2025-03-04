import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Dog } from '../services/api';

interface FavoritesContextType {
  favorites: Dog[];
  favoriteIds: Set<string>;
  addFavorite: (dog: Dog) => void;
  removeFavorite: (dogId: string) => void;
  clearFavorites: () => void;
  isFavorite: (dogId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Dog[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  const addFavorite = (dog: Dog) => {
    if (!favoriteIds.has(dog.id)) {
      setFavorites([...favorites, dog]);
      setFavoriteIds(new Set(favoriteIds).add(dog.id));
    }
  };

  const removeFavorite = (dogId: string) => {
    setFavorites(favorites.filter(dog => dog.id !== dogId));
    const newFavoriteIds = new Set(favoriteIds);
    newFavoriteIds.delete(dogId);
    setFavoriteIds(newFavoriteIds);
  };

  const clearFavorites = () => {
    setFavorites([]);
    setFavoriteIds(new Set());
  };

  const isFavorite = (dogId: string) => favoriteIds.has(dogId);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoriteIds,
        addFavorite,
        removeFavorite,
        clearFavorites,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}; 