import { Suspense, useState } from 'react';
import { DUMMY_EVENTS } from '../../dummy-events'
import Event from './components/Event';
import { NavLink, json, useLoaderData, defer, Await } from 'react-router-dom';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalFooter,
    Button,
    Image,
    Text,
    Box,
    Flex,
    useDisclosure,
} from '@chakra-ui/react';
import CollabImg from '../../assets/collab.jpg';

function EventsPage() {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { events } = useLoaderData();

    const openModal = (event) => {
        setSelectedEvent(event);
        onOpen();
    };

    function getGameType(event) {
        let gameType = "";
        if (event.shaking) {
            gameType += "Lắc xu";
        }
        if (event.trivia) {
            if (gameType !== "") {
                gameType += ", ";
            }
            gameType += "Trivia (câu hỏi trắc nghiệm)";
        }
        return gameType;
    }
    

    return (
        <>
            <div className='flex flex-col md:flex-row justify-center items-center m-10'>
                <h1 className='text-3xl font-bold flex-1 mt-10 md:mt-0'>Tất cả sự kiện</h1>
                <label className="order-first md:order-none border-b border-gray-300 flex items-center gap-2 pb-1 w-full md:w-auto">
                    <input type="text" className="grow" placeholder="Tìm kiếm sự kiện..." />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                            fillRule="evenodd"
                            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                            clipRule="evenodd" />
                    </svg>
                </label>
            </div>
            <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
                <Await resolve={events}>
                    {(resolvedEvents) => (
                        <ul className='flex flex-wrap justify-center space-x-4 md:space-x-6 lg:space-x-8 mb-10'>
                            {resolvedEvents.map((event) => (
                                <li key={event.id} className='m-4 hover:shadow-lg' onClick={() => openModal(event)}>
                                    <Event
                                        id={event.id}
                                        name={event.name}
                                        startDate={formatDate(event.startDate)}
                                        endDate={formatDate(event.endDate)}
                                        brand={event.brand.name}/>
                                </li>
                            ))}
                        </ul>
                    )}
                </Await>
            </Suspense>


            <div className="hero bg-base-200 p-20">
                <div className="hero-content flex-col lg:flex-row">
                    <img
                        src={CollabImg}
                        alt='abc'
                        className="max-w-sm rounded-lg" />
                    <div>
                        <h1 className="text-5xl font-bold">Đăng ký sự kiện!</h1>
                        <p className="py-6">
                            Chúng tôi cung cấp dịch vụ tạo sự kiện trò chơi sáng tạo giúp bạn thu hút sự chú ý và kết nối sâu sắc với khách hàng. Đừng bỏ lỡ cơ hội để làm nổi bật thương hiệu và sản phẩm của bạn thông qua các trải nghiệm tương tác đầy ấn tượng. Hãy hợp tác với chúng tôi và biến mỗi sự kiện thành một chiến lược quảng cáo hiệu quả!
                        </p>
                        <NavLink to='form' className="btn btn-primary">Đăng ký ngay</NavLink>
                    </div>
                </div>
            </div>

            {selectedEvent && (
                <Modal isCentered isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay
                        bg="blackAlpha.300"
                        backdropFilter="blur(10px) hue-rotate(90deg)"
                    />
                    <ModalContent>
                        <ModalBody>
                            <Flex>
                                <Box flex="1" p={4}>
                                    <Image
                                        src={selectedEvent.image}
                                        alt={selectedEvent.name}
                                        borderRadius="md"
                                        boxSize="100%"
                                        objectFit="cover"
                                    />
                                </Box>
                                <Box flex="1" p={4}>
                                    <Text fontSize="2xl" fontWeight="bold" mb={4}>{selectedEvent.name}</Text>
                                    {/* <Text fontSize="md" mb={4}>{selectedEvent.description}</Text> */}
                                    {/* <Text fontSize="sm" mb={2}>Số lượng voucher: {selectedEvent.voucherQuantities}</Text> */}
                                    <Text fontSize="sm" mb={2}>Loại trò chơi: {getGameType(selectedEvent)}</Text>
                                    <Text fontSize="sm" mb={2}>Ngày bắt đầu: {formatDate(selectedEvent.startDate)}</Text>
                                    <Text fontSize="sm" mb={2}>Ngày kết thúc: {formatDate(selectedEvent.endDate)}</Text>
                                    <Text fontSize="sm">Thương hiệu: {selectedEvent.brand.name}</Text>
                                </Box>
                            </Flex>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={onClose}>Đóng</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </>
    );
}

export default EventsPage;

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

async function loadEvents() {
    const response = await fetch('http://localhost:8080/api/brand/event/find-all');
    if (!response.ok) {
        throw json(
            { message: 'Could not fetch events.' },
            { status: 500 },
        );
    }
    else {
        const resData = await response.json();
        return resData;
    }
}

export function loader() {
    return defer({
        events: loadEvents(),
    });
}