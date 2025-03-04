import React from 'react';
import {
  Box,
  Image,
  Text,
  Badge,
  Button,
  VStack,
  HStack,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { Dog } from '../services/api';

interface DogCardProps {
  dog: Dog;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const DogCard: React.FC<DogCardProps> = ({ dog, isFavorite, onToggleFavorite }) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      transition="transform 0.2s"
      _hover={{ transform: 'scale(1.02)' }}
    >
      <Box position="relative">
        <Image
          src={dog.img}
          alt={dog.name}
          height="200px"
          width="100%"
          objectFit="cover"
        />
        <IconButton
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          icon={isFavorite ? <span>❤️</span> : <span>🤍</span>}
          position="absolute"
          top="2"
          right="2"
          onClick={onToggleFavorite}
          colorScheme={isFavorite ? "red" : "gray"}
          borderRadius="full"
          size="sm"
        />
      </Box>

      <VStack p={4} align="start" spacing={2}>
        <Text fontWeight="bold" fontSize="xl" noOfLines={1}>
          {dog.name}
        </Text>
        
        <HStack>
          <Badge colorScheme="blue">{dog.breed}</Badge>
          <Badge colorScheme="green">{dog.age} years</Badge>
        </HStack>
        
        <Tooltip label={`ZIP Code: ${dog.zip_code}`}>
          <Text fontSize="sm" color="gray.600">
            Location: {dog.zip_code}
          </Text>
        </Tooltip>
        
        <Button
          onClick={onToggleFavorite}
          colorScheme={isFavorite ? "red" : "blue"}
          variant={isFavorite ? "solid" : "outline"}
          size="sm"
          width="full"
          mt={2}
        >
          {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        </Button>
      </VStack>
    </Box>
  );
};

export default DogCard; 