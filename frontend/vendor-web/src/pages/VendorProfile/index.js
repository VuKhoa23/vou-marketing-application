import { Flex, Box, Avatar, Grid, GridItem, Text } from '@chakra-ui/react';
import Stat from './components/Stat';
import EditableForm from './components/ContactInfo';
import Cooperation from './components/Cooperation';
import { useSelector, useDispatch } from 'react-redux';

function VendorProfile() {

    const brandInfo = useSelector((state) => state.brand);

    return (
        <Box bg="gray.100" pb={4}>
            <Grid
                h='auto'
                templateRows='repeat(3, auto)'
                templateColumns='repeat(4, 1fr)'
                gap={4}
            >
                <GridItem rowSpan={1} colSpan={4} bg='white' px={100}>
                    <Flex>
                        <Avatar padding="3px" size='2xl' name='Segun Adebayo' src='https://th.bing.com/th/id/R.65f99c0fc75e15cb680e152e384b629b?rik=d5kPFD1MEy6ZDA&pid=ImgRaw&r=0' />
                        <Box bg="white" p={2} borderRadius="md" mb={4}>
                            <Text fontWeight='bold' fontSize='4xl'>{brandInfo.username}</Text>
                            <Text fontSize='sm'>Lĩnh vực: <b>{brandInfo.category}</b></Text>
                        </Box>
                    </Flex>
                </GridItem>
                <GridItem rowSpan={2} colSpan={1} ml={100}>
                    <GridItem rowSpan={1} colSpan={1} mb={4}>
                        <Stat />
                    </GridItem>
                    <GridItem colSpan={1} rowSpan={1} bg='white' borderRadius="1rem" >
                        <EditableForm />
                    </GridItem>
                </GridItem>

                <GridItem colSpan={3} rowSpan={2} bg='white' mr={100} borderRadius="1rem"  >
                    <Cooperation />
                </GridItem>

            </Grid>
        </Box>
    );
}

export default VendorProfile;
