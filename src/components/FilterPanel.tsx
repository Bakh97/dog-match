import React, { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Checkbox,
  CheckboxGroup,
  Stack,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from '@chakra-ui/react';

interface FilterPanelProps {
  breeds: string[];
  selectedBreeds: string[];
  setSelectedBreeds: React.Dispatch<React.SetStateAction<string[]>>;
  ageMin?: number;
  setAgeMin: React.Dispatch<React.SetStateAction<number | undefined>>;
  ageMax?: number;
  setAgeMax: React.Dispatch<React.SetStateAction<number | undefined>>;
  sortOrder: 'asc' | 'desc';
  setSortOrder: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>;
  onApplyFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  breeds,
  selectedBreeds,
  setSelectedBreeds,
  ageMin,
  setAgeMin,
  ageMax,
  setAgeMax,
  sortOrder,
  setSortOrder,
  onApplyFilters,
}) => {
  const [breedSearch, setBreedSearch] = useState('');
  const [showAllBreeds, setShowAllBreeds] = useState(false);
  
  // Filter breeds based on search
  const filteredBreeds = breeds.filter(breed => 
    breed.toLowerCase().includes(breedSearch.toLowerCase())
  );
  
  // Limit displayed breeds unless "show all" is clicked
  const displayedBreeds = showAllBreeds 
    ? filteredBreeds 
    : filteredBreeds.slice(0, 10);
  
  const handleBreedToggle = (breed: string) => {
    if (selectedBreeds.includes(breed)) {
      setSelectedBreeds(selectedBreeds.filter(b => b !== breed));
    } else {
      setSelectedBreeds([...selectedBreeds, breed]);
    }
  };
  
  const handleClearFilters = () => {
    setSelectedBreeds([]);
    setAgeMin(undefined);
    setAgeMax(undefined);
    setSortOrder('asc');
    setBreedSearch('');
  };

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" bg="white">
      <VStack spacing={4} align="stretch">
        <Heading as="h3" size="md">
          Filter Dogs
        </Heading>
        
        {/* Sort Order */}
        <FormControl>
          <FormLabel>Sort by Breed</FormLabel>
          <Select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          >
            <option value="asc">A to Z</option>
            <option value="desc">Z to A</option>
          </Select>
        </FormControl>
        
        {/* Age Range */}
        <FormControl>
          <FormLabel>Age Range (years)</FormLabel>
          <Stack direction="row">
            <NumberInput 
              min={0} 
              max={20} 
              value={ageMin ?? ''} 
              onChange={(_, value) => setAgeMin(value || undefined)}
            >
              <NumberInputField placeholder="Min" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            
            <Text alignSelf="center">to</Text>
            
            <NumberInput 
              min={ageMin || 0} 
              max={20} 
              value={ageMax ?? ''} 
              onChange={(_, value) => setAgeMax(value || undefined)}
            >
              <NumberInputField placeholder="Max" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Stack>
        </FormControl>
        
        {/* Breed Filter */}
        <FormControl>
          <FormLabel>Breeds</FormLabel>
          <InputGroup mb={2}>
            <Input
              placeholder="Search breeds..."
              value={breedSearch}
              onChange={(e) => setBreedSearch(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button 
                h="1.75rem" 
                size="sm" 
                onClick={() => setBreedSearch('')}
              >
                Clear
              </Button>
            </InputRightElement>
          </InputGroup>
          
          <Box maxH="200px" overflowY="auto" p={2}>
            <CheckboxGroup>
              <VStack align="start" spacing={1}>
                {displayedBreeds.map(breed => (
                  <Checkbox
                    key={breed}
                    isChecked={selectedBreeds.includes(breed)}
                    onChange={() => handleBreedToggle(breed)}
                  >
                    {breed}
                  </Checkbox>
                ))}
              </VStack>
            </CheckboxGroup>
          </Box>
          
          {filteredBreeds.length > 10 && !showAllBreeds && (
            <Button 
              variant="link" 
              size="sm" 
              onClick={() => setShowAllBreeds(true)}
              mt={1}
            >
              Show all {filteredBreeds.length} breeds
            </Button>
          )}
          
          {showAllBreeds && (
            <Button 
              variant="link" 
              size="sm" 
              onClick={() => setShowAllBreeds(false)}
              mt={1}
            >
              Show less
            </Button>
          )}
        </FormControl>
        
        {/* Action Buttons */}
        <Stack direction="row" spacing={4} mt={2}>
          <Button 
            colorScheme="blue" 
            onClick={onApplyFilters}
            flex={1}
          >
            Apply Filters
          </Button>
          <Button 
            variant="outline" 
            onClick={handleClearFilters}
          >
            Clear
          </Button>
        </Stack>
      </VStack>
    </Box>
  );
};

export default FilterPanel; 