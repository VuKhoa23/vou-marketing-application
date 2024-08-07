import {
    Box,
    Heading,
    SimpleGrid
} from "@chakra-ui/react";
import MiniCard from "../components/card/MiniCard";
import React from "react";
import { FaCalendarAlt, FaUsers, FaDollarSign, FaTag, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import CheckTable from '../components/CheckTable';
import { columnsDataCheck } from "../components/variables/columnsData";
import tableDataCheck from "../components/variables/tableDataCheck.json";
import PieCard from "../components/PieCard";
import DailyTraffic from "../components/DailyTraffic";
import TotalSpent from "../components/TotalSpent";
import WeeklyRevenue from "../components/WeeklyRevenue";

export default function Dashboard() {
    const pageBg = "gray.100";

    return (
        <Box pt={{ base: "20px", md: "20px", xl: "20px" }} px={5} bg={pageBg}>
            <Heading as="h1" size="2xl" mb="6">
                Dữ liệu thống kê
            </Heading>
            <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3, "2xl": 3 }}
                spacing="20px"
                mb="20px"
                w="full"
            >
                <MiniCard
                    icon={FaCalendarAlt}
                    content={{
                        title: 'Tất cả sự kiện',
                        data: '25 Events'
                    }}
                />
                <MiniCard
                    icon={FaUsers}
                    content={{
                        title: 'Tổng số người chơi',
                        data: '3,450 Users'
                    }}
                />
                <MiniCard
                    icon={FaDollarSign}
                    content={{
                        title: 'Doanh thu',
                        data: '$15,000'
                    }}
                />
                <MiniCard
                    icon={FaTag}
                    content={{
                        title: 'Số lượng voucher',
                        data: '1,200 vouchers'
                    }}
                />
                <MiniCard
                    icon={FaClock}
                    content={{
                        title: 'Thời gian trung bình',
                        data: '45 Minutes'
                    }}
                />
                <MiniCard
                    icon={FaMoneyBillWave}
                    content={{
                        title: 'Chi phí',
                        data: '$3000'
                    }}
                />
            </SimpleGrid>
            <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap='20px' mb='20px'>
                <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} />
            </SimpleGrid>
            <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
                <WeeklyRevenue />
                <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
                    <PieCard />
                    <DailyTraffic />
                </SimpleGrid>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap='20px' mb='20px'>
                <TotalSpent />
            </SimpleGrid>
        </Box>

    );
}
