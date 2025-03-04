import React, { useState } from 'react';
import dog from '../assets/dog.png';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Container,
  Image,
  keyframes,
  ScaleFade,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { FaUser, FaEnvelope } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

// Define animation keyframes
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const LoginPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter both name and email',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid email address',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      await login(name, email);
      toast({
        title: 'Success',
        description: 'You have successfully logged in',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: unknown) {
      console.error('Login error:', error);
      toast({
        title: 'Error',
        description: 'Failed to log in. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      w="100vw"
      bgGradient="linear(to-b,rgb(248, 249, 251), #edf2f7, #e2e8f0)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
      position="relative"
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient="radial(circle at top, rgba(255,255,255,0.8) 0%, rgba(237,242,247,0.5) 100%)"
        pointerEvents="none"
      />
      <Container maxW="100%" p={0} m={0} position="relative">
        <ScaleFade initialScale={0.9} in={true}>
          <VStack spacing={8} align="center" w="100%" px={4}>
            <Image 
              src={dog} 
              alt="Dog Adoption Logo" 
              width="auto"
              height="300px"
              objectFit="contain"
              animation={`${float} 3s ease-in-out infinite`}
              filter="drop-shadow(0px 8px 12px rgba(0, 0, 0, 0.15))"
              sx={{
                mixBlendMode: 'multiply',
                backgroundColor: 'transparent'
              }}
              borderRadius="xl"
              p={4}
            />
            <VStack spacing={3} w="100%" maxW="800px">
              <Heading 
                as="h1" 
                size="2xl"
                bgGradient="linear(to-r, gray.700, gray.900)"
                bgClip="text"
                letterSpacing="tight"
                textAlign="center"
              >
                Find Your Perfect Furry Friend
              </Heading>
              <Text 
                fontSize="xl" 
                textAlign="center" 
                color="gray.700"
                maxW="2xl"
                px={4}
              >
                Welcome to our dog adoption platform! Sign in to browse available dogs and find your perfect match.
              </Text>
            </VStack>
            
            <Box 
              w="100%" 
              maxW="500px" 
              p={10} 
              borderRadius="xl" 
              boxShadow="2xl"
              bg="white"
              border="1px"
              borderColor="gray.100"
              mx={4}
              backdropFilter="blur(10px)"
              backgroundColor="rgba(255, 255, 255, 0.9)"
            >
              <form onSubmit={handleSubmit}>
                <VStack spacing={5}>
                  <FormControl id="name" isRequired>
                    <FormLabel color="gray.700">Name</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FaUser color="white.500" />
                      </InputLeftElement>
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        bg="white"
                        borderColor="gray.300"
                        _hover={{
                          borderColor: 'gray.400',
                        }}
                        _focus={{
                          borderColor: 'gray.500',
                          boxShadow: '0 0 0 1px gray.500',
                        }}
                      />
                    </InputGroup>
                  </FormControl>
                  
                  <FormControl id="email" isRequired>
                    <FormLabel color="gray.700">Email</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FaEnvelope color="#4A5568" />
                      </InputLeftElement>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        bg="white"
                        borderColor="gray.300"
                        _hover={{
                          borderColor: 'gray.400',
                        }}
                        _focus={{
                          borderColor: 'gray.500',
                          boxShadow: '0 0 0 1px gray.500',
                        }}
                      />
                    </InputGroup>
                  </FormControl>
                  
                  <Button
                    type="submit"
                    colorScheme="whiteAlpha"
                    width="full"
                    size="lg"
                    fontSize="md"
                    isLoading={isLoading}
                    loadingText="Signing in..."
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg',
                      bg: 'white',
                      color: 'gray.800'
                    }}
                    transition="all 0.2s"
                    bg="white"
                    color="gray.800"
                    border="1px"
                    borderColor="gray.200"
                  >
                    Sign In
                  </Button>
                </VStack>
              </form>
            </Box>
          </VStack>
        </ScaleFade>
      </Container>
    </Box>
  );
};

export default LoginPage; 