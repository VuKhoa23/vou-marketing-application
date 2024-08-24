// Chakra imports
import { Box, Flex, Text, List, ListItem } from "@chakra-ui/react";
// Custom components
import Card from "./card/Card";
import LineChart from "./charts/LineChart";
import React from "react";
import {
  lineChartDataTotalSpent,
  lineChartOptionsTotalSpent,
} from "./variables/charts";

const formatNumber = (num) => {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`;
  } else if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  } else if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  } else {
    return num.toString();
  }
};

export default function TotalSpent(props) {
  const { ...rest } = props;

  const [selectedData, setSelectedData] = React.useState("daily");
  const [chartData, setChartData] = React.useState([]);
  const [chartOptions, setChartOptions] = React.useState(lineChartOptionsTotalSpent);
  const [totalProfit, setTotalProfit] = React.useState(0); 


  React.useEffect(() => {
    const revenue = lineChartDataTotalSpent.Revenue[selectedData].data;
    const profit = lineChartDataTotalSpent.Profit[selectedData].data;
    const labels = lineChartDataTotalSpent.Revenue[selectedData].labels;

    const calculatedTotalProfit = profit.reduce((acc, value) => acc + value, 0);
    setTotalProfit(calculatedTotalProfit);

    const formattedData = [
      {
        name: "Doanh thu",
        data: revenue,
      },
      {
        name: "Lợi nhuận",
        data: profit,
      },
    ]
    setChartData(formattedData);
    setChartOptions(prevOptions => ({
      ...prevOptions,
      xaxis: {
        ...prevOptions.xaxis,
        categories: labels
      }
    }));
  }, [selectedData]);

  const handleDataChange = (value) => {
    setSelectedData(value);
  };


  return (
    <Card p='10px' align='center' direction='column' w='100%' bg="white" borderRadius="xl" {...rest}>
      <Flex align='center' w='100%' px='15px' py='10px' mb='10px'>
        <Text
          me='auto'
          color='black'
          fontSize='xl'
          fontWeight='700'
          lineHeight='100%'
        >
          DOANH THU - LỢI NHUẬN
        </Text>

        <List display='flex' flexDirection='row' alignItems='center' fontWeight="500">
          <ListItem
            cursor='pointer'
            p={2}
            borderRadius='full'
            bg={selectedData === 'daily' ? 'blue.200' : 'transparent'}
            onClick={() => handleDataChange('daily')}
            ml={2}
          >
            Theo ngày
          </ListItem>
          <ListItem
            cursor='pointer'
            p={2}
            borderRadius='full'
            bg={selectedData === 'weekly' ? 'blue.200' : 'transparent'}
            onClick={() => handleDataChange('weekly')}
            ml={2}
          >
            Theo tuần
          </ListItem>
          <ListItem
            cursor='pointer'
            p={2}
            borderRadius='full'
            bg={selectedData === 'monthly' ? 'blue.200' : 'transparent'}
            onClick={() => handleDataChange('monthly')}
            ml={2}
          >
            Theo tháng
          </ListItem>
        </List>
      </Flex>
      <Flex w='100%' flexDirection={{ base: "column", lg: "row" }}>
        <Flex flexDirection='column' me='30px' px='15px' py='10px'>
          <Text
            color='black'
            fontSize='sm'
            fontWeight='500'
            mt='4px'
            me='12px'>
            Tổng lợi nhuận
          </Text>
          <Text
            color='green.500'
            fontSize='34px'
            textAlign='start'
            fontWeight='700'
            lineHeight='100%'>
            ${formatNumber(totalProfit).toLocaleString()}
          </Text>
        </Flex>
        <Box minH='260px' minW='75%' mt='auto'>
          <LineChart
            chartData={chartData}
            chartOptions={chartOptions}
          />
        </Box>

      </Flex>
    </Card>
  );
}
