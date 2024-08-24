import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  List,
  ListItem,
  Select,
  SimpleGrid
} from "@chakra-ui/react";
import Card from "./card/Card";
import ColumnChart1 from "./charts/BarChart1";
import { userParticipationData, barChartOptionsConsumption, eventNames } from "./variables/charts";

export default function ParticipantsInfo(props) {
  const [selectedData, setSelectedData] = useState("gender");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const data = userParticipationData[selectedData];
    const formattedData = Object.keys(data).map((key) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      data: data[key],
    }));

    setChartData(formattedData);
  }, [selectedData]);

  const handleDataChange = (value) => {
    setSelectedData(value);
  };

  // Calculate columns for event names
  const columns = [];
  const columnCount = 3;
  for (let i = 0; i < eventNames.length; i += columnCount) {
    columns.push(eventNames.slice(i, i + columnCount));
  }

  return (
    <Card align='center' direction='column' w='100%' bg="white" borderRadius="xl" {...props}>
      <Flex align='center' w='100%' px='15px' py='10px' mb='10px'>
        <Text
          me='auto'
          color='black'
          fontSize='xl'
          fontWeight='700'
          lineHeight='100%'
        >
          THÔNG TIN NGƯỜI THAM GIA
        </Text>
        <List display='flex' flexDirection='row' alignItems='center' fontWeight="500">
          <ListItem
            cursor='pointer'
            p={2}
            borderRadius='full'
            bg={selectedData === 'gender' ? 'blue.200' : 'transparent'}
            onClick={() => handleDataChange('gender')}
            ml={2}
          >
            Giới tính
          </ListItem>
          <ListItem
            cursor='pointer'
            p={2}
            borderRadius='full'
            bg={selectedData === 'ageGroups' ? 'blue.200' : 'transparent'}
            onClick={() => handleDataChange('ageGroups')}
            ml={2}
          >
            Độ tuổi
          </ListItem>
          <ListItem
            cursor='pointer'
            p={2}
            borderRadius='full'
            bg={selectedData === 'regions' ? 'blue.200' : 'transparent'}
            onClick={() => handleDataChange('regions')}
            ml={2}
          >
            Khu vực
          </ListItem>
        </List>
      </Flex>

      <Box h='340px' mt='auto'>
        <ColumnChart1
          chartData={chartData}
          chartOptions={barChartOptionsConsumption}
        />
      </Box>

      <Box width='full' height='50px' mt='10px'>
        <Select
          fontSize='sm'
          variant='subtle'
          width='full'
          fontWeight='700'
          textAlign='center'
          whiteSpace='normal'
        >
          <option></option>
          <option>Hallo</option>
          <option>Hallo</option>
        </Select>
      </Box>

      {/* <Box width='full' overflowX='auto'>
        <SimpleGrid columns={columns.length} spacing={4} minChildWidth='120px'>
          {columns.map((col, index) => (
            <Box key={index} p='10px'>
              {col.map((event, i) => (
                <Text key={i} mb='10px' fontSize="14px">
                  {index * columnCount + i + 1}. {event}
                </Text>
              ))}
            </Box>
          ))}
        </SimpleGrid>
      </Box> */}
    </Card>
  );
}
