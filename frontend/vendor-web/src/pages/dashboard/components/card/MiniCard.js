import React from 'react';
import { Box, Flex } from '@chakra-ui/react';

const MiniCard = ({ icon: Icon, content }) => {
  return (
    <Box
      className="w-full"
      p="4"
      border="1px"
      borderColor="gray.200"
      borderRadius="lg"
      shadow="sm"
      bg="white"
    >
      <Flex align="center">
        <Box
          mr="4"
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="14"
          h="14"
          borderRadius="full"
          bg="gray.200"
        >
          <Icon className="h-6 w-6 text-blue-500" />
        </Box>
        <Box>
          <Box fontSize="sm" color="gray.500">
            {content.title}
          </Box>
          <Box fontSize="2xl" fontWeight="bold">
            {content.data}
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default MiniCard;
