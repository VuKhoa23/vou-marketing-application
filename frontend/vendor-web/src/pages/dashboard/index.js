import {
    Box,
    Heading,
    SimpleGrid
} from "@chakra-ui/react";
import MiniCard from "./components/card/MiniCard";
import React, { Suspense } from "react";
import { FaCalendarAlt, FaUsers, FaDollarSign, FaTag, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import { columnsDataCheck } from "./components/variables/columnsData";
import EventList from './components/EventList';
import { json, defer, useLoaderData, Await } from "react-router-dom";
import PieCard from "./components/Reachability";
import NumberOfParticipants from "./components/NumberOfParticipants";
import TotalSpent from "./components/RevenueNProfit";
import ParticipantsInfo from "./components/ParticipantsInfo";



export default function Dashboard() {
    const pageBg = "gray.100";
    const { events } = useLoaderData();
    console.log(events);

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
                <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
                    <Await resolve={events}>
                        {(resolvedEvents) => (
                            <EventList columnsData={columnsDataCheck} tableData={resolvedEvents} />
                        )}
                    </Await>
                </Suspense>


            </SimpleGrid>
            <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
                <ParticipantsInfo />
                <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
                    <PieCard />
                    <NumberOfParticipants />
                </SimpleGrid>
            </SimpleGrid>
            <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap='20px' mb='20px'>
                <TotalSpent />
            </SimpleGrid>
        </Box>
    );
}


function determineGameType(item) {
    const types = [];
    if (item.event.trivia) {
        types.push("Trivia");
    }
    if (item.event.shaking) {
        types.push("Lắc xu");
    }
    return types.length > 0 ? types.join(", ") : "Unknown"; // Kết hợp các loại game nếu có, hoặc trả về "Unknown"
}

function transformData(apiData) {
    return apiData.map(item => ({
        id: item.event.eventId,
        name: item.event.eventName,
        quantity: item.voucher.voucherQuantities,
        startDate: formatDate(item.event.eventStartDate),
        endDate: formatDate(item.event.eventEndDate),
        participants: item.participants || 0,
        gameType: determineGameType(item)
    }));
}




function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
}


async function loadEvents() {
    const response = await fetch('http://localhost:8080/api/brand/event/events-and-vouchers?brandId=1');
    if (!response.ok) {
        throw json(
            { message: 'Could not fetch events.' },
            { status: 500 },
        );
    } else {
        const apiData = await response.json();
        const transformedData = transformData(apiData);
        return transformedData;
    }
}


export function loader() {
    return defer({
        events: loadEvents(),
    });
}