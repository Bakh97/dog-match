import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Text,
  useToast,
  Spinner,
  HStack,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Image,
  VStack,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { getBreeds, searchDogs, getDogs, matchDog, Dog } from '../services/api';
import DogCard from '../components/DogCard';
import FilterPanel from '../components/FilterPanel';

const DOGS_PER_PAGE = 20;

const SearchPage: React.FC = () => {
  const { isAuthenticated, userName, logout } = useAuth();
  const { favorites, favoriteIds, addFavorite, removeFavorite } = useFavorites();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [ageMin, setAgeMin] = useState<number | undefined>(undefined);
  const [ageMax, setAgeMax] = useState<number | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(false);
  const [allDogs, setAllDogs] = useState<Dog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [isGeneratingMatch, setIsGeneratingMatch] = useState(false);

  // Calculate pagination values
  const totalPages = Math.ceil(allDogs.length / DOGS_PER_PAGE);
  const startIndex = (currentPage - 1) * DOGS_PER_PAGE;
  const endIndex = startIndex + DOGS_PER_PAGE;
  const currentPageDogs = allDogs.slice(startIndex, endIndex);

  // Fetch breeds on component mount
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const breedsData = await getBreeds();
        setBreeds(breedsData);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch dog breeds',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchBreeds();
  }, [toast]);

  // Search dogs with current filters
  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const searchParams = {
        sort: `breed:${sortOrder}`,
        ...(selectedBreeds.length > 0 && { breeds: selectedBreeds }),
        ...(ageMin !== undefined && { ageMin }),
        ...(ageMax !== undefined && { ageMax })
      };

      const result = await searchDogs(searchParams);
      
      // Fetch all dogs at once
      if (result.resultIds.length > 0) {
        const dogsData = await getDogs(result.resultIds);
        setAllDogs(dogsData);
        setCurrentPage(1); // Reset to first page when new search is performed
      } else {
        setAllDogs([]);
      }
    } catch (error) {
      console.error('Error searching dogs:', error);
      toast({
        title: 'Error',
        description: 'Failed to search dogs. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial search on component mount
  useEffect(() => {
    if (isAuthenticated) {
      handleSearch();
    }
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle pagination
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Handle filter changes
  const handleFilterChange = () => {
    setCurrentPage(1);
    handleSearch();
  };

  // Generate a match
  const handleGenerateMatch = async () => {
    if (favoriteIds.size === 0) {
      toast({
        title: 'No favorites',
        description: 'Please add at least one dog to your favorites',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsGeneratingMatch(true);
    try {
      const match = await matchDog(Array.from(favoriteIds));
      
      // Fetch the matched dog details
      if (match.match) {
        const matchedDogData = await getDogs([match.match]);
        if (matchedDogData.length > 0) {
          setMatchedDog(matchedDogData[0]);
          onOpen(); // Open the modal
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate a match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsGeneratingMatch(false);
    }
  };

  return (
    <Container maxW="container.xl" py={6}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading as="h1" size="xl">
          Find Your Perfect Dog
        </Heading>
        <HStack>
          <Text>Welcome, {userName}</Text>
          <Button onClick={logout} colorScheme="red" variant="outline">
            Logout
          </Button>
        </HStack>
      </Flex>

      <Flex gap={6} direction={{ base: 'column', md: 'row' }}>
        {/* Filter Panel */}
        <Box w={{ base: '100%', md: '300px' }} flexShrink={0}>
          <FilterPanel
            breeds={breeds}
            selectedBreeds={selectedBreeds}
            setSelectedBreeds={setSelectedBreeds}
            ageMin={ageMin}
            setAgeMin={setAgeMin}
            ageMax={ageMax}
            setAgeMax={setAgeMax}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            onApplyFilters={handleFilterChange}
          />

          {/* Favorites Section */}
          <Box mt={6} p={4} borderWidth={1} borderRadius="lg">
            <Heading as="h3" size="md" mb={3}>
              Your Favorites ({favoriteIds.size})
            </Heading>
            {favoriteIds.size > 0 ? (
              <VStack align="stretch" spacing={2}>
                {favorites.slice(0, 5).map(dog => (
                  <HStack key={dog.id} justify="space-between">
                    <Text noOfLines={1}>{dog.name} ({dog.breed})</Text>
                    <Button 
                      size="xs" 
                      colorScheme="red" 
                      onClick={() => removeFavorite(dog.id)}
                    >
                      Remove
                    </Button>
                  </HStack>
                ))}
                {favoriteIds.size > 5 && (
                  <Text fontSize="sm">And {favoriteIds.size - 5} more...</Text>
                )}
                <Button 
                  mt={2} 
                  colorScheme="green" 
                  onClick={handleGenerateMatch}
                  isLoading={isGeneratingMatch}
                >
                  Find My Match!
                </Button>
              </VStack>
            ) : (
              <Text>Add dogs to your favorites to find a match!</Text>
            )}
          </Box>
        </Box>

        {/* Search Results */}
        <Box flex={1}>
          {isLoading ? (
            <Flex justify="center" align="center" h="300px">
              <Spinner size="xl" />
            </Flex>
          ) : currentPageDogs.length > 0 ? (
            <>
              <Grid 
                templateColumns={{ 
                  base: 'repeat(1, 1fr)', 
                  sm: 'repeat(2, 1fr)', 
                  md: 'repeat(2, 1fr)', 
                  lg: 'repeat(3, 1fr)', 
                  xl: 'repeat(4, 1fr)' 
                }}
                gap={4}
              >
                {currentPageDogs.map(dog => (
                  <DogCard 
                    key={dog.id} 
                    dog={dog} 
                    isFavorite={favoriteIds.has(dog.id)}
                    onToggleFavorite={() => 
                      favoriteIds.has(dog.id) 
                        ? removeFavorite(dog.id) 
                        : addFavorite(dog)
                    }
                  />
                ))}
              </Grid>
              
              {/* Pagination */}
              <Flex justify="center" mt={6}>
                <HStack>
                  <Button 
                    onClick={handlePrevPage} 
                    isDisabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Text>
                    Page {currentPage} of {totalPages}
                  </Text>
                  <Button 
                    onClick={handleNextPage} 
                    isDisabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </HStack>
              </Flex>
            </>
          ) : (
            <Box textAlign="center" p={10}>
              <Heading as="h3" size="md">
                No dogs found
              </Heading>
              <Text mt={2}>
                Try adjusting your filters to see more results.
              </Text>
            </Box>
          )}
        </Box>
      </Flex>

      {/* Match Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Your Perfect Match!</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {matchedDog && (
              <VStack spacing={4} align="center">
                <Image 
                  src={matchedDog.img} 
                  alt={matchedDog.name}
                  borderRadius="lg"
                  maxH="300px"
                  objectFit="cover"
                />
                <Heading as="h2" size="lg">
                  {matchedDog.name}
                </Heading>
                <HStack>
                  <Badge colorScheme="blue">{matchedDog.breed}</Badge>
                  <Badge colorScheme="green">{matchedDog.age} years old</Badge>
                  <Badge colorScheme="purple">ZIP: {matchedDog.zip_code}</Badge>
                </HStack>
                <Text textAlign="center" fontSize="lg">
                  Congratulations! You've been matched with {matchedDog.name}. 
                  This {matchedDog.age}-year-old {matchedDog.breed} is waiting for you!
                </Text>
                <Button colorScheme="blue" onClick={onClose} size="lg">
                  Close
                </Button>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default SearchPage;