import { Box, Flex, Text, Select } from "@chakra-ui/react";
import Card from "./card/Card";
import PieChart from "./charts/PieChart";
import { pieChartData, pieChartOptions } from "./variables/charts";
import React, { useState, useEffect } from "react";

export default function Conversion(props) {
  const { ...rest } = props;

  const textColor = "black";
  const cardColor = "white";
  const cardShadow = "0px 18px 40px rgba(112, 144, 176, 0.12)";

  const [selectedEvent, setSelectedEvent] = useState(pieChartData.events[0]);
  const [selectedData, setSelectedData] = useState(pieChartData.data[0]);

  useEffect(() => {
    const index = pieChartData.events.indexOf(selectedEvent);
    setSelectedData(pieChartData.data[index]);
  }, [selectedEvent]);

  const handleChange = (event) => {
    setSelectedEvent(event.target.value);
  };



  return (
    <Card p='10px' align='center' direction='column' w='100%' bg={cardColor} borderRadius="xl" {...rest}>
      <Flex
        px={{ base: "0px", "2xl": "10px" }}
        direction='column'
        alignItems='start'
        w='100%'
        mb='8px'>
        <Text color={textColor} fontSize='xl' fontWeight='700' mb='4px'>
          ĐỘ TIẾP CẬN
        </Text>
        <Box width='full' height='50px' mt='5px'>
          <Select
            fontSize='sm'
            variant='subtle'
            width='full'
            fontWeight='700'
            value={selectedEvent}
            onChange={handleChange}
            textAlign='center'
            whiteSpace='normal'
          >
            {pieChartData.events.map((event) => (
              <option key={event} value={event}>
                {event}
              </option>
            ))}
          </Select>
        </Box>
      </Flex>

      <Box h='380px' mt='20px'>
        <PieChart
          chartData={selectedData}
          chartOptions={pieChartOptions}
        />
      </Box>


    </Card>
  );
}
