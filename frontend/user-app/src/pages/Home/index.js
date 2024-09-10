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
import { version } from 'react';
import { useSelector } from 'react-redux';

function Home() {

    const token = useSelector((state) => state.auth.accessToken);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [triviaGameId, setTriviaGameId] = useState('');
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
                        resolvedEvents.length === 0 ? (
                            <p style={{ textAlign: 'center', marginTop: '20px' }}>Không có sự kiện nào</p>
                        ) : (
                            <ul className='flex flex-wrap justify-center space-x-4 md:space-x-6 lg:space-x-8 mb-10'>
                                {resolvedEvents.map((event) => (
                                    <li key={event.event.id} className='m-4 hover:shadow-lg' onClick={() => openModal(event)}>
                                        <Event
                                            id={event.event.id}
                                            image={event.event.imageURL}
                                            name={event.event.name}
                                            startDate={formatDate(event.event.startDate)}
                                            endDate={formatDate(event.event.endDate)}
                                            brand={event.event.brand.username}
                                            voucher={event.voucher.voucherQuantities}
                                            gameType={getGameType(event.event)}
                                        />
                                    </li>
                                ))}
                            </ul>
                        )

                    )}
                </Await>
            </Suspense>


            {selectedEvent && (
                <Modal isCentered isOpen={isOpen} onClose={onClose} size="3xl">
                    <ModalOverlay
                        bg="blackAlpha.300"
                        backdropFilter="blur(10px) hue-rotate(90deg)"
                    />
                    <ModalContent>
                        <ModalBody>
                            <Flex>
                                <Box flex="1" p={4}>
                                    <Image
                                        src={selectedEvent.voucher.voucherImageURL}
                                        borderRadius="md"
                                        boxSize="100%"
                                        objectFit="cover"
                                    />
                                </Box>
                                <Box flex="1" p={4}>
                                    <Text fontSize="2xl" mb={4} fontWeight="bold" whiteSpace="normal" overflowWrap="break-word" wordBreak="break-word">{selectedEvent.event.name}</Text>
                                    <Text fontSize="md" mb={4}>{selectedEvent.voucher.voucherDescription}</Text>
                                    <Text fontSize="sm" mb={2}>Số lượng voucher: {selectedEvent.voucher.voucherQuantities}</Text>
                                    <Text fontSize="sm" mb={2}>Loại trò chơi: {getGameType(selectedEvent.event)}</Text>
                                    <Text fontSize="sm" mb={2}>Ngày bắt đầu: {formatDate(selectedEvent.event.startDate)}</Text>
                                    <Text fontSize="sm" mb={2}>Ngày kết thúc: {formatDate(selectedEvent.event.endDate)}</Text>
                                    <Text fontSize="sm">Thương hiệu: {selectedEvent.event.brand.username}</Text>
                                </Box>
                            </Flex>
                        </ModalBody>
                        <ModalFooter>
                            {
                                token === null ?
                                    <Button className='mr-2'>
                                        <NavLink to='/login'>Đăng nhập</NavLink>
                                    </Button>
                                    :
                                    <Button className='mr-2'>
                                        {
                                            selectedEvent.event.trivia === true ?
                                                <NavLink to={`/trivia/${selectedEvent.event.id}`}>Chơi game</NavLink>
                                                :
                                                <NavLink to={`/game/${selectedEvent.event.id}`}>Chơi game</NavLink>
                                        }
                                    </Button>
                            }

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
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/brand/event/find-all`);
        if (!response.ok) {
            // Log the detailed error information to the console
            console.error('Failed to fetch events:', response.status, response.statusText);

            // Clone the response to be able to read it twice
            const responseClone = response.clone();

            // Attempt to parse the JSON error response from the backend
            try {
                const errorData = await response.json();
                console.error('Backend error message:', errorData.message);

                // Optionally, you can throw a custom error with the backend message for further handling
                throw new Error(`Backend responded with ${response.status}: ${errorData.message}`);
            } catch (jsonError) {
                // If parsing the JSON fails, log the raw response text from the cloned response
                console.error('Failed to parse error JSON:', jsonError);
                const errorText = await responseClone.text();
                console.error('Raw error response:', errorText);

                // Throw a generic error for non-JSON responses
                throw new Error(`Backend responded with ${response.status}: ${response.statusText}`);
            }
        } else {
            const resData = await response.json();
            return resData;
        }
    } catch (error) {
        // Log any unexpected network errors or other exceptions
        console.error('An error occurred while fetching events:', error);

        // Optionally, you can re-throw the error or handle it gracefully here, 
        // e.g., by displaying a user-friendly error message in your UI
        throw error; // Re-throw to let the React Router handle the error
    }
}

export function loader() {
    return defer({
        events: loadEvents(),
    });
}