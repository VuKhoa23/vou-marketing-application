import React, { useState, useEffect } from "react";
import { Box, Flex, Text, Icon, Select, Button } from "@chakra-ui/react";
import BarChart from "./charts/BarChart";
import { RiArrowUpSFill, RiArrowDownSFill } from "react-icons/ri";
import { barChartDataNumberOfParticipants, barChartOptionsNumberOfParticipants } from "./variables/charts";
import Card from "./card/Card";

export default function DailyTraffic(props) {
  const { ...rest } = props;

  const [selectedEvent, setSelectedEvent] = useState(barChartDataNumberOfParticipants[0].name);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [previousWeekData, setPreviousWeekData] = useState(0);

  // Function to get the data for the selected event and week
  const getSelectedData = () => {
    const event = barChartDataNumberOfParticipants.find(e => e.name === selectedEvent);
    const weekData = event?.data[`Tuần ${selectedWeek + 1}`] || [];
    return event ? [{
      name: selectedEvent,
      data: weekData
    }] : [];
  };

  const handleChangeEvent = (event) => {
    setSelectedEvent(event.target.value);
    setSelectedWeek(0); 
  };

  const handleNextWeek = () => {
    setSelectedWeek(prevWeek => {
      const maxWeeks = 3;
      if (maxWeeks !== undefined) {
        return Math.min(prevWeek + 1, maxWeeks);
      }
      return prevWeek; 
    });
  };

  const handlePreviousWeek = () => {
    setSelectedWeek(prevWeek => Math.max(prevWeek - 1, 0));
  };

  // Get the data for the selected week and event
  const selectedData = getSelectedData();
  const totalParticipants = selectedData[0]?.data.reduce((sum, value) => sum + value, 0) || 0;

  // Use effect to update previous week data
  useEffect(() => {
    if (selectedWeek > 0) {
      const event = barChartDataNumberOfParticipants.find(e => e.name === selectedEvent);
      const previousWeekData = event?.data[`Tuần ${selectedWeek}`] || [];
      const totalPreviousWeek = previousWeekData.reduce((sum, value) => sum + value, 0);
      setPreviousWeekData(totalPreviousWeek);
    } else {
      setPreviousWeekData(0);
    }
  }, [selectedWeek, selectedEvent]);

  // Calculate percentage change
  const calculatePercentageChange = () => {
    if (previousWeekData > 0) {
      const change = totalParticipants - previousWeekData;
      const percentageChange = (change / previousWeekData) * 100;
      return percentageChange.toFixed(2);
    }
    return 0;
  };

  const percentageChange = calculatePercentageChange();
  const textColor = "black";
  const iconColor = percentageChange >= 0 ? 'green.500' : 'red.500';
  const icon = percentageChange >= 0 ? <RiArrowUpSFill /> : <RiArrowDownSFill/>;

  return (
    <Card p='10px' align='center' direction='column' w='100%' bg="white" borderRadius="xl" {...rest}>
      <Flex px={{ base: "0px", "2xl": "10px" }} direction='column' alignItems='start' w='100%'>
        <Text color={textColor} fontSize='xl' fontWeight='700' mb='4px'>
          SỐ LƯỢNG NGƯỜI THAM GIA
        </Text>
      </Flex>
      
      <Flex justify='space-between' align='start' px='10px' pt='5px'>
        <Flex flexDirection='column' align='start' me='20px'>
          <Flex w='100%'>
            <Text me='auto' color='secondaryGray.600' fontSize='sm' fontWeight='500'>
              Theo tuần
            </Text>
          </Flex>
          <Flex align='end'>
            <Text color={textColor} fontSize='34px' fontWeight='700' lineHeight='100%'>
              {totalParticipants}
            </Text>
            <Text ms='6px' color='secondaryGray.600' fontSize='sm' fontWeight='500'>
              người chơi
            </Text>
          </Flex>
        </Flex>
        <Flex align='center' mt="4px" color={iconColor}>
          {icon}
          <Text fontSize='sm' fontWeight='700'>
            {percentageChange >= 0 ? `+${percentageChange}%` : `${percentageChange}%`}
          </Text>
        </Flex>
      </Flex>

      <Box h='340px' mt='auto'>
        <BarChart
          chartData={selectedData}
          chartOptions={barChartOptionsNumberOfParticipants}
        />
      </Box>

      <Box width='full' height='50px'> 
        <Select
          fontSize='sm'
          variant='subtle'
          width='full' 
          fontWeight='700'
          value={selectedEvent}
          onChange={handleChangeEvent}
          textAlign='center' 
          whiteSpace='normal'
        >
          {barChartDataNumberOfParticipants.map((event) => (
            <option key={event.name} value={event.name}>
              {event.name}
            </option>
          ))}
        </Select>
      </Box>

      <Flex className='pagination' justifyContent="center" align="center">
        <Button onClick={handlePreviousWeek} isDisabled={selectedWeek === 0}>
          Tuần trước
        </Button>
        <Text mx="4">
          Tuần {selectedWeek + 1}/4
        </Text>
        <Button onClick={handleNextWeek} isDisabled={selectedWeek >= 3}>
          Tuần sau
        </Button>
      </Flex>
    </Card>
  );
}
