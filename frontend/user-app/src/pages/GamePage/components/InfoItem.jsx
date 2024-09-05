import React from 'react';
import { Box, Text } from '@chakra-ui/react';

function InfoItem({ icon: Icon, title, info, iconColor }) {

    const shades = {
        blue: '#3b82f6',
        green: '#10b981',
        red: '#ef4444',
        yellow: '#f59e0b',
        purple: '#8b5cf6',
        teal: '#14b8a6',

    };
    return (
        <Box className='flex items-center space-x-2 p-2 border border-blue-500 shadow-md'>
            <Icon style={{ color: shades[iconColor] }} className='text-4xl mr-4' />
            <Box className='flex-1'>
                <Text className='text-xl font-semibold mb-1'>
                    {title}
                </Text>
                <Text className='text-md'>
                    {info}
                </Text>
            </Box>
        </Box>
    );
}

export default InfoItem;
