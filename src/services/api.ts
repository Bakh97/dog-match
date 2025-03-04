import axios from 'axios';

// Define the base URL for the API
const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

// Configure axios instance with credentials
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This is important for sending/receiving cookies
});

// Define interfaces based on the API documentation
export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

export interface Location {
  zip_code: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  county: string;
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface SearchResult {
  resultIds: string[];
  total: number;
  next?: string;
  prev?: string;
}

export interface Match {
  match: string;
}

// Authentication endpoints
export const login = async (name: string, email: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email }),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response;
};

export const logout = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }
};

// Dog endpoints
export const getBreeds = async (): Promise<string[]> => {
  const response = await fetch(`${API_BASE_URL}/dogs/breeds`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch breeds');
  }

  return response.json();
};

export const searchDogs = async (params: {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  sort?: string;
}): Promise<SearchResult> => {
  try {
    // Build URL with search parameters
    const searchParams = new URLSearchParams();

    if (params.breeds?.length) {
      params.breeds.forEach(breed => searchParams.append('breeds', breed));
    }

    if (params.zipCodes?.length) {
      params.zipCodes.forEach(zip => searchParams.append('zipCodes', zip));
    }

    if (params.ageMin !== undefined) {
      searchParams.append('ageMin', params.ageMin.toString());
    }

    if (params.ageMax !== undefined) {
      searchParams.append('ageMax', params.ageMax.toString());
    }

    if (params.sort) {
      searchParams.append('sort', params.sort);
    }

    // Set a large size to get all dogs at once
    searchParams.append('size', '100');

    const response = await fetch(`${API_BASE_URL}/dogs/search?${searchParams}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Search dogs error:', error);
    throw error;
  }
};

export const getDogs = async (dogIds: string[]): Promise<Dog[]> => {
  if (!dogIds.length) return [];
  
  const response = await fetch(`${API_BASE_URL}/dogs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dogIds),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch dogs');
  }

  return response.json();
};

export const matchDog = async (dogIds: string[]): Promise<{ match: string }> => {
  const response = await fetch(`${API_BASE_URL}/dogs/match`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dogIds),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to generate match');
  }

  return response.json();
};

// Location endpoints
export const getLocations = async (zipCodes: string[]): Promise<Location[]> => {
  const response = await fetch(`${API_BASE_URL}/locations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(zipCodes),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch locations');
  }

  return response.json();
};

export default api; 