import {
    Step,
    StepIcon,
    StepIndicator,
    StepSeparator,
    Stepper,
    Box,
    Text,
    VStack,
    createIcon,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { setEvents } from "../../../store/slices/eventsSlice";
import { useEffect } from "react";

// Tạo component biểu tượng SVG tùy chỉnh
const CustomHornIcon = createIcon({
    displayName: "CustomHornIcon",
    path: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                d="M5.5713 14.5L9.46583 18.4141M18.9996 3.60975C17.4044 3.59505 16.6658 4.33233 16.4236 5.07743C16.2103 5.73354 16.4052 7.07735 15.896 8.0727C15.4091 9.02443 14.1204 9.5617 12.6571 9.60697M20 7.6104L20.01 7.61049M19 15.96L19.01 15.9601M7.00001 3.94926L7.01001 3.94936M19 11.1094C17.5 11.1094 16.5 11.6094 15.5949 12.5447M10.2377 7.18796C11 6.10991 11.5 5.10991 11.0082 3.52734M3.53577 20.4645L7.0713 9.85791L14.1424 16.929L3.53577 20.4645Z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    pathProps: {
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
    },
});

const milestones = [
    {
        title: "Dookki mở chi nhánh mới tại Hà Nội",
        description:
            "Dookki mở rộng hệ thống với một chi nhánh mới tại Hà Nội, mang đến cơ hội trải nghiệm ẩm thực Hàn Quốc cho khách hàng miền Bắc.",
        date: "Từ 15-01-2023 đến 30-06-2023",
        voucherCount: 60,
    },
    {
        title: "Dookki tổ chức sự kiện giảm giá lớn",
        description:
            "Nhân dịp ra mắt menu mới, Dookki tổ chức sự kiện giảm giá lớn với nhiều ưu đãi hấp dẫn cho khách hàng. Sự kiện thu hút sự tham gia đông đảo của người dân.",
        date: "Từ 01-07-2023 đến 31-08-2023",
        voucherCount: 80,
    },
    {
        title: "Dookki hợp tác với nhà cung cấp mới",
        description:
            "Dookki ký kết hợp tác với một nhà cung cấp mới, nâng cao chất lượng nguyên liệu và mở rộng danh mục sản phẩm. Đây là bước quan trọng trong việc nâng cao trải nghiệm của khách hàng.",
        date: "Từ 15-09-2023 đến 31-12-2023",
        voucherCount: 100,
    },
    {
        title: "Dookki ra mắt menu mới",
        description:
            "Dookki giới thiệu menu mới với các món ăn độc quyền và sáng tạo. Sự kiện ra mắt menu mới nhận được sự hưởng ứng nhiệt tình từ khách hàng và giới truyền thông.",
        date: "Từ 10-01-2024 đến 30-04-2024",
        voucherCount: 70,
    },
    {
        title: "Dookki kỷ niệm 5 năm thành lập",
        description:
            "Dookki tổ chức lễ kỷ niệm 5 năm thành lập với nhiều hoạt động vui chơi và các chương trình khuyến mãi đặc biệt. Sự kiện này là dịp để tri ân khách hàng và đối tác đã đồng hành cùng thương hiệu.",
        date: "Từ 01-05-2024 đến 30-06-2024",
        voucherCount: 90,
    },
    {
        title: "Dookki kỷ niệm 5 năm thành lập",
        description:
            "Dookki tổ chức lễ kỷ niệm 5 năm thành lập với nhiều hoạt động vui chơi và các chương trình khuyến mãi đặc biệt. Sự kiện này là dịp để tri ân khách hàng và đối tác đã đồng hành cùng thương hiệu.",
        date: "Từ 01-05-2024 đến 30-06-2024",
        voucherCount: 90,
    },
    {
        title: "Dookki kỷ niệm 5 năm thành lập",
        description:
            "Dookki tổ chức lễ kỷ niệm 5 năm thành lập với nhiều hoạt động vui chơi và các chương trình khuyến mãi đặc biệt. Sự kiện này là dịp để tri ân khách hàng và đối tác đã đồng hành cùng thương hiệu.",
        date: "Từ 01-05-2024 đến 30-06-2024",
        voucherCount: 90,
    },
    {
        title: "Dookki kỷ niệm 5 năm thành lập",
        description:
            "Dookki tổ chức lễ kỷ niệm 5 năm thành lập với nhiều hoạt động vui chơi và các chương trình khuyến mãi đặc biệt. Sự kiện này là dịp để tri ân khách hàng và đối tác đã đồng hành cùng thương hiệu.",
        date: "Từ 01-05-2024 đến 30-06-2024",
        voucherCount: 90,
    },
    {
        title: "Dookki kỷ niệm 5 năm thành lập",
        description:
            "Dookki tổ chức lễ kỷ niệm 5 năm thành lập với nhiều hoạt động vui chơi và các chương trình khuyến mãi đặc biệt. Sự kiện này là dịp để tri ân khách hàng và đối tác đã đồng hành cùng thương hiệu.",
        date: "Từ 01-05-2024 đến 30-06-2024",
        voucherCount: 90,
    },
    {
        title: "Dookki kỷ niệm 5 năm thành lập",
        description:
            "Dookki tổ chức lễ kỷ niệm 5 năm thành lập với nhiều hoạt động vui chơi và các chương trình khuyến mãi đặc biệt. Sự kiện này là dịp để tri ân khách hàng và đối tác đã đồng hành cùng thương hiệu.",
        date: "Từ 01-05-2024 đến 30-06-2024",
        voucherCount: 90,
    },
    {
        title: "Dookki kỷ niệm 5 năm thành lập",
        description:
            "Dookki tổ chức lễ kỷ niệm 5 năm thành lập với nhiều hoạt động vui chơi và các chương trình khuyến mãi đặc biệt. Sự kiện này là dịp để tri ân khách hàng và đối tác đã đồng hành cùng thương hiệu.",
        date: "Từ 01-05-2024 đến 30-06-2024",
        voucherCount: 90,
    },
];

function Cooperation() {
    const dispatch = useDispatch();
    const events = useSelector((state) => state.events);
    const brandId = useSelector((state) => state.brand.id);
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

    const sortedEvents = [...events].sort((a, b) => {
        const dateA = new Date(a.startDate.split("-").reverse().join("-"));
        const dateB = new Date(b.startDate.split("-").reverse().join("-"));
        return dateB - dateA;
    });

    return (
        <Stepper index={-1} orientation="vertical" height="auto" spacing={6} m={4}>
            {sortedEvents.map((event, index) => (
                <Step key={index}>
                    <StepIndicator borderColor="blue.500">
                        <StepIcon as={CustomHornIcon} boxSize={6} color="blue.500" />
                    </StepIndicator>
                    <StepSeparator />
                    <VStack align="start" spacing={4} ml={6}>
                        <Box mt={2}>
                            <Text fontSize="sm" fontWeight="bold" color="blue.800">
                                Từ {event.startDate} đến {event.endDate}
                            </Text>
                        </Box>
                        <Box
                            p={4}
                            borderWidth={1}
                            borderRadius="md"
                            boxShadow="md"
                            bg="white"
                            borderColor="blue.200"
                        >
                            <Text
                                fontSize="lg"
                                fontWeight="bold"
                                color="blue.600"
                                whiteSpace="normal"
                                overflowWrap="break-word"
                                wordBreak="break-word"
                            >
                                {event.name}
                            </Text>
                            <Text fontSize="md" color="gray.600">
                                {milestones[index].description}
                            </Text>
                            <Text fontSize="md" fontWeight="bold" color="teal.600">
                                Số lượng voucher: {event.quantity}
                            </Text>
                        </Box>
                    </VStack>
                </Step>
            ))}
        </Stepper>
    );
}

export default Cooperation;

function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getFullYear()}`;
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
    return apiData.map((item) => ({
        id: item.event.id,
        name: item.event.name,
        quantity: item.voucher.voucherQuantities,
        startDate: formatDate(item.event.startDate),
        endDate: formatDate(item.event.endDate),
        participants: item.participants || 0,
        gameType: determineGameType(item),
    }));
}
