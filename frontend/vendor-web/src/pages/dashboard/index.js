import {
    Box,
    Heading,
    SimpleGrid
} from "@chakra-ui/react";
import MiniCard from "./components/card/MiniCard";
import React from "react";
import { FaCalendarAlt, FaUsers, FaDollarSign, FaTag, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import EventList from './components/EventList';
import PieCard from "./components/Reachability";
import NumberOfParticipants from "./components/NumberOfParticipants";
import TotalSpent from "./components/RevenueNProfit";
import ParticipantsInfo from "./components/ParticipantsInfo";
import { useSelector, useDispatch } from "react-redux";
import { setEvents } from "../../store/slices/eventsSlice";
import { useEffect } from "react";



export default function Dashboard() {
    const pageBg = "gray.100";

    const dispatch = useDispatch();
    // const events = useSelector(state => state.events);
    // const brandId = useSelector((state) => state.brand.id);
    const { events, brandId } = useSelector((state) => ({
        events: state.events,
        brandId: state.brand.id,
    }));


    useEffect(() => {
        async function fetchEvents() {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/brand/event/events-and-vouchers?brandId=${brandId}`);
            if (response.ok) {
                const apiData = await response.json();
                const transformedData = transformData(apiData);
                dispatch(setEvents(transformedData));
            }
        }

        if (events.length <= 0) {
            fetchEvents();
        }
    }, [dispatch, events]);

    //const totalParticipants = events.reduce((total, event) => total + event.participants, 0);
    const totalParticipants = 4;
    const totalVouchers = events.reduce((total, event) => total + event.quantity, 0);

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
                        data: `${events.length} sự kiện`
                    }}
                />
                <MiniCard
                    icon={FaUsers}
                    content={{
                        title: 'Tổng số người chơi',
                        data: `${totalParticipants} người chơi`
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
                        data: `${totalVouchers} vouchers`
                    }}
                />
                <MiniCard
                    icon={FaClock}
                    content={{
                        title: 'Thời gian trung bình',
                        data: '45 phút'
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
                <EventList />
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
    return types.length > 0 ? types.join(", ") : "Unknown";
}

function transformData(apiData) {
    return apiData.map(item => ({
        id: item.event.id,
        name: item.event.name,
        quantity: item.voucher.voucherQuantities,
        startDate: formatDate(item.event.startDate),
        endDate: formatDate(item.event.endDate),
        participants: item.participants || 0,
        gameType: determineGameType(item)
    }));
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
}