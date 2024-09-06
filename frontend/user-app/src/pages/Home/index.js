import { Suspense, useState } from 'react';
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

function Home() {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [keyWord, setKeyWord] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { events } = useLoaderData();

    const openModal = (event) => {
        setSelectedEvent(event);
        onOpen();
    };

    const searchEvent = () => {
        console.log(keyWord);
    }

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

    function getImageNameFromPath(fullPath) {
        // Sử dụng phương thức split để tách các phần của đường dẫn theo dấu '/'
        const pathParts = fullPath.split('/');

        // Phần tử cuối cùng trong mảng pathParts sẽ là tên tệp
        const imageName = pathParts[pathParts.length - 1];

        return imageName;
    }


    return (
        <>
            <div className='flex flex-col md:flex-row justify-center items-center m-10'>
                <h1 className='text-3xl font-bold flex-1 mt-10 md:mt-0'>Tất cả sự kiện</h1>
                <label className="order-first md:order-none border-b border-gray-300 flex items-center gap-2 pb-1 w-full md:w-auto">
                    <input
                        type="text"
                        className="grow focus:outline-none"
                        placeholder="Tìm kiếm sự kiện..."
                        value={keyWord}
                        onChange={(event) => setKeyWord(event.target.value)} />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70 cursor-pointer"
                        onClick={searchEvent}>
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
                                <li key={event.event.eventId} className='m-4 hover:shadow-lg' onClick={() => openModal(event)}>
                                    <Event
                                        id={event.event.eventId}
                                        image={`${process.env.PUBLIC_URL}/images/${getImageNameFromPath(event.event.eventImageURL)}`}
                                        name={event.event.eventName}
                                        startDate={formatDate(event.event.eventStartDate)}
                                        endDate={formatDate(event.event.eventEndDate)}
                                        brand={event.event.brand.username}
                                        voucher={event.voucher.voucherQuantities}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </Await>
            </Suspense>

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
                                        src={`${process.env.PUBLIC_URL}/images/${getImageNameFromPath(selectedEvent.event.eventImageURL)}`}
                                        //alt={selectedEvent.event.eventName}
                                        borderRadius="md"
                                        boxSize="100%"
                                        objectFit="cover"
                                    />
                                </Box>
                                <Box flex="1" p={4}>
                                    <Text fontSize="2xl" fontWeight="bold" mb={4}>{selectedEvent.event.eventName}</Text>
                                    <Text fontSize="md" mb={4}>{selectedEvent.voucher.voucherDescription}</Text>
                                    <Text fontSize="sm" mb={2}>Số lượng voucher: {selectedEvent.voucher.voucherQuantities}</Text>
                                    <Text fontSize="sm" mb={2}>Loại trò chơi: {getGameType(selectedEvent.event)}</Text>
                                    <Text fontSize="sm" mb={2}>Ngày bắt đầu: {formatDate(selectedEvent.event.eventStartDate)}</Text>
                                    <Text fontSize="sm" mb={2}>Ngày kết thúc: {formatDate(selectedEvent.event.eventEndDate)}</Text>
                                    <Text fontSize="sm">Thương hiệu: {selectedEvent.event.brand.username}</Text>
                                </Box>
                            </Flex>
                        </ModalBody>
                        <ModalFooter>
                            <Button className='mr-2'>
                                <NavLink to='/Game'>Chơi game</NavLink>
                            </Button>
                            <Button onClick={onClose}>Đóng</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </>
    );
}

export default Home;

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

async function loadEvents() {
    const response = await fetch('http://127.0.0.1/api/brand/event/events-and-vouchers?brandId=1');
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