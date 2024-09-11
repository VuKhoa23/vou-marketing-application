import '../GamePage/style/index.css';
import Regulations from './components/Regulation';
import ProtectedRoute from '../../components/ProtectedRoute';
import React, { useState, useRef, useEffect } from 'react';
import { BiCoin } from 'react-icons/bi';
import { FaFacebook, FaUserFriends, FaTicketAlt, FaPlus, FaVideo } from 'react-icons/fa';
import {
    useDisclosure, Text, Alert, AlertIcon, AlertTitle, AlertDescription, Box, CloseButton, Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalFooter,
    Button,
    Flex,
    Input,
    useToast
} from '@chakra-ui/react';
import VoucherModal from './components/ExchangeVoucher';
import { useParams } from "react-router-dom";
import { useSelector } from 'react-redux';

function GamePage() {

    const token = useSelector((state) => state.auth.accessToken);
    const toast = useToast();
    const { eventId } = useParams();
    const [voucherInfo, setVoucherInfo] = useState({
        id: null,
        imageURL: '',
        description: '',
        value: null,
        endDate: ''
    })

    const [isShaking, setIsShaking] = useState(false);
    const [countdown, setCountdown] = useState(10);
    const [videoPlayed, setVideoPlayed] = useState(false);
    const [adsPlayed, setAdsPlayed] = useState(false);
    const [isCounting, setIsCounting] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [attemp, setAttemp] = useState(0);
    const [adsTurn, setAdsTurn] = useState(3);
    const [coinReward, setCoinReward] = useState(0);
    const [userCoin, setUserCoin] = useState(0);
    const [userVoucher, setUserVoucher] = useState(10);
    const adsRef = useRef(null);
    const videoRef = useRef(null);
    const bonusSectionRef = useRef(null);
    const alertRef = useRef(null);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [friendId, setFriendId] = useState('');
    const { isOpen: isFriendModalOpen, onOpen: onFriendModalOpen, onClose: onFriendModalClose } = useDisclosure();


    const handleSendFriendId = () => {
        if (friendId.trim() !== "" && Number(friendId) >= 0) {
            toast({
                title: "Thành công",
                description: `Xin lượt chơi từ bạn có ID: ${friendId} thành công. Hãy chờ xác nhận`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            // Gọi API để gửi request ở đây
            onFriendModalClose();
        } else {
            toast({
                title: "Lỗi",
                description: "ID không hợp lệ. Vui lòng nhập một số lớn hơn hoặc bằng 0.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleShake = () => {
        if (attemp > 0) {

            setIsShaking(true);


            // Bắt đầu đếm ngược khi nút được bấm
            if (!isCounting) {
                setIsCounting(true);
            }

            // Kiểm tra nếu video chưa được phát
            if (!videoPlayed && videoRef.current) {
                videoRef.current.play();
                setVideoPlayed(true);
            }

            setTimeout(() => setIsShaking(false), 1000);
        }
    };

    const handleWatchAds = () => {
        if (!adsPlayed && adsRef.current) {
            adsRef.current.play();
            setAdsPlayed(true);
        }
    };

    const handleVideoEnded = () => {
        setAdsPlayed(false);
        setAdsTurn(prevTurn => prevTurn - 1);
        setAttemp(prevAttemp => prevAttemp + 1);
        toast({
            title: "Chúc mừng!",
            description: "Bạn đã nhận được thêm một lượt chơi.",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
        addTurn(token, eventId, 1);
    };


    const handleAlertClose = () => {
        setShowAlert(false);
    };

    const scrollToBonusSection = () => {
        if (bonusSectionRef.current) {
            bonusSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Lấy voucherInfo
    useEffect(() => {
        async function fetchVoucherInfo() {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/brand/event/find?id=${eventId}`);
                if (response.ok) {
                    const data = await response.json();
                    setVoucherInfo({
                        id: data.voucher.voucherId,
                        imageURL: data.voucher.voucherImageURL,
                        description: data.voucher.voucherDescription,
                        value: data.voucher.voucherValue,
                        endDate: formatDate(data.voucher.voucherEndDate)
                    });
                } else {
                    console.error("Error fetching event:", response.status, response.statusText);
                }
            } catch (error) {
                console.error("Error fetching game ID:", error);
            }
        }
        fetchVoucherInfo();
    }, [])

    // Lấy lượt chơi
    useEffect(() => {
        async function fetchTurn(token) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/get-turns?eventId=${eventId}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setAttemp(data.turn);
                } else {
                    console.error("Error fetching turn:", response.status, response.statusText);
                }
            } catch (error) {
                console.error("Error fetching game ID:", error);
            }
        }
        fetchTurn(token);
    }, [])

    // Lấy xu
    useEffect(() => {
        async function fetchCoin() {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/get-coins?eventId=${eventId}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserCoin(data.coin);
                } else {
                    console.error("Error fetching coin:", response.status, response.statusText);
                }
            } catch (error) {
                console.error("Error fetching game ID:", error);
            }
        }
        fetchCoin();
    }, [])

    //Lấy voucher người chơi trúng
    useEffect(() => {
        async function fetchTurn() {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/get-vouchers?voucherId=${voucherInfo.id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserVoucher(data["voucher quantities"]);
                } else {
                    console.error("Error fetching coin:", response.status, response.statusText);
                }
            } catch (error) {
                console.error("Error fetching game ID:", error);
            }
        }
        if (voucherInfo.id !== null) {
            fetchTurn();
        }
    }, [voucherInfo])

    useEffect(() => {
        if (showAlert && alertRef.current) {
            alertRef.current.focus();
        }
    }, [showAlert]);

    useEffect(() => {
        // Bộ đếm ngược
        let timer;
        if (isCounting && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
        } else if (countdown === 0) {
            setVideoPlayed(false);
            setCountdown(10);
            setIsCounting(false);

            setAttemp(prevAttemp => prevAttemp - 1);
            const reward = getRandomCoinReward();
            setCoinReward(reward);
            setUserCoin(prevCoin => prevCoin + reward);
            addCoin(token, parseInt(eventId, 10), reward);
            subtractTurn(token, parseInt(eventId, 10), 1);
            setShowAlert(true);
        }

        return () => clearInterval(timer);
    }, [countdown, isCounting]);

    const getRandomCoinReward = () => {
        return Math.floor(Math.random() * (100 - 10 + 1)) + 10;
    };

    return (
        <div className="flex">
            <div className="w-1/2">
                <Regulations />
            </div>

            <div className="w-1/2">
                <Box className="flex flex-col">
                    <h1
                        className="bru-font border-4 border-black bru-shadow text-3xl text-center p-2 m-5 font-bold bg-blue-300 " >
                        KHU VỰC "RUNG LẮC"
                    </h1>
                    <Box className='flex flex-row'>
                        <Box className="basis-3/5 px-5 mb-4">
                            <Box className='flex flex-row space-x-4 border-black border-4 p-5'>
                                <Box className={`rounded-lg border-4 border-black bg-blue-200 w-[320px] h-[240px] p-5 video-container ${isShaking ? 'shake' : ''}`}>
                                    <video
                                        ref={videoRef}
                                        width="320"
                                        height="240"
                                        className="border-4 border-black"
                                    >
                                        <source src="/CoinDropping.mp4" type="video/mp4" />
                                    </video>
                                </Box>
                                <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content items-center h-fit">
                                    <span className="countdown font-mono text-5xl">
                                        <span style={{ "--value": countdown }}></span>
                                    </span>
                                    giây
                                </div>
                            </Box>
                            <button
                                onClick={handleShake}
                                disabled={attemp <= 0}
                                className={`${attemp <= 0 ? 'bg-gray-400 text-gray-700 cursor-not-allowed ' : 'game-btn bg-teal-200 '} mt-4 w-full h-[50px] text-xl rounded-lg bru-shadow`}
                            >
                                Lắc nào!
                            </button>
                        </Box>

                        <Box className="basis-2/5 px-1">
                            <Box className='flex justify-end items-center rounded-full border-4 border-black px-4 py-2 bg-blue-200'>
                                <strong className="mr-auto">Lượt chơi: {attemp}</strong>
                                <button
                                    onClick={scrollToBonusSection}
                                    className='rounded-full w-10 h-10 flex items-center justify-center bru-shadow game-btn bg-yellow-200'>
                                    <FaPlus />
                                </button>
                            </Box>
                            <Box className='flex justify-end items-center rounded-full border-4 border-black px-4 py-2 mt-3 bg-blue-200'>
                                <strong className="mr-auto">Số xu hiện có: {userCoin}</strong>
                                <BiCoin className="text-yellow-500" size={39} />
                            </Box>
                            <Box className='flex justify-end items-center rounded-full border-4 border-black px-4 py-2 mt-3 bg-blue-200'>
                                <strong className="mr-auto">Quy đổi voucher</strong>
                                <button
                                    className='rounded-full w-10 h-10 flex items-center justify-center bru-shadow game-btn bg-teal-200'
                                    onClick={onOpen}
                                >
                                    <FaTicketAlt />
                                </button>
                            </Box>
                            <Box className='flex justify-end items-center rounded-full border-4 border-black px-4 py-2 mt-3 bg-blue-200'>
                                <strong className="mr-auto">Số voucher hiện có: {userVoucher}</strong>
                                <FaTicketAlt size={39} />
                            </Box>
                        </Box>
                    </Box>

                    <Box
                        ref={bonusSectionRef}
                        className='rounded-lg border-4 border-black bg-yellow-200 bru-shadow mx-5 mb-5'>
                        <h1 className='text-5xl font-bold p-2 mb-5 bru-font text-center'>Thêm lượt chơi</h1>
                        <Box className='space-y-4 mb-5'>
                            <Box className='flex items-center p-4 border-2 border-blue-500 bg-white shadow-md'>
                                <FaUserFriends className='text-blue-500 text-4xl mr-4' />
                                <Box className='flex-1'>
                                    <button
                                        onClick={onFriendModalOpen}
                                        className='flex-1 game-btn bg-blue-200 px-2 h-[40px] text-lg rounded-lg bru-shadow mb-2'
                                    >
                                        Xin từ bạn bè
                                    </button>
                                    <Text className='text-md'>
                                        Để có thêm lượt chơi, hãy yêu cầu bạn bè gửi cho bạn lượt chơi.
                                        Bạn có thể xin thêm lượt chơi bằng cách nhập id của bạn bè và chờ họ xác nhận.
                                    </Text>
                                </Box>
                            </Box>

                            <Box className='flex items-center p-4 border-2 border-blue-500 bg-white shadow-md'>
                                <FaVideo className='text-blue-600 text-4xl mr-4' />
                                <Box className='flex-1'>
                                    <button
                                        onClick={handleWatchAds}
                                        className={`${adsTurn <= 0 ? 'bg-gray-400 text-gray-700 cursor-not-allowed ' : 'game-btn bg-blue-200 '} flex-1 px-2 h-[40px] text-lg rounded-lg bru-shadow mb-2`}
                                    >
                                        Xem video quảng cáo ({adsTurn}/3 lượt)
                                    </button>
                                    <Text className='text-md'>
                                        Xem 1 video quảng cáo ngắn để nhận thêm 1 lượt chơi
                                    </Text>
                                    <video
                                        ref={adsRef}
                                        width="320"
                                        height="240"
                                        onEnded={handleVideoEnded}
                                        className="border-4 border-black"
                                    >
                                        <source src="/CoinDropping.mp4" type="video/mp4" />
                                    </video>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    {showAlert && (
                        <Box p={4}
                            tabIndex={-1}
                            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg">
                            <Alert status="success" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" height="200px" width="300px">
                                <AlertIcon />
                                <AlertTitle mt={4} mb={1} fontSize="lg">
                                    Chúc mừng!
                                </AlertTitle>
                                <AlertDescription maxWidth="lg" className='flex flex-row'>
                                    <Box display="flex" alignItems="center">
                                        Bạn đã trúng thưởng {coinReward}
                                        <BiCoin className='text-yellow-500' />
                                    </Box>
                                </AlertDescription>
                                <CloseButton position="absolute" right="8px" top="8px" onClick={handleAlertClose} />
                            </Alert>
                        </Box>
                    )}

                    <VoucherModal
                        isOpen={isOpen}
                        onClose={onClose}
                        voucher={voucherInfo}
                        userCoin={userCoin}
                        setUserCoin={setUserCoin}
                        setUserVoucher={setUserVoucher}
                        token={token}
                        eventId={eventId}
                    />

                    {/* Modal for requesting turns from friends */}
                    <Modal isOpen={isFriendModalOpen} onClose={onFriendModalClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalBody>
                                <Text className='text-center text-2xl font-bold mb-4'>XIN LƯỢT CHƠI TỪ BẠN BÈ</Text>
                                <Flex direction="row" justify="center" align="center">
                                    {/* <Text mr={4}>Nhập ID bạn bè: </Text> */}
                                    <Input
                                        type="number"
                                        min={0}
                                        placeholder="Nhập ID bạn bè"
                                        value={friendId}
                                        onChange={(e) => setFriendId(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-' || e.key === '.') {
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                </Flex>
                            </ModalBody>

                            <ModalFooter>
                                <Button colorScheme="blue" mr={3} onClick={handleSendFriendId}>
                                    Gửi
                                </Button>
                                <Button variant="ghost" onClick={onFriendModalClose}>Đóng</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </Box>
            </div>
        </div>
    );
}

export default GamePage;

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

async function subtractTurn(token, eventId, turn) {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/subtract-turn`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                eventId: eventId,
                turn: turn
            }),
        });
        if (response.ok) {
            //const data = await response.json();
            //console.log(data)
        } else {
            const errorData = await response.json();
            console.error("Error subtract turn:", response.status, response.statusText, errorData);
        }
    } catch (error) {
        console.error("Error fetching game ID:", error);
    }
}

async function addCoin(token, eventId, coin) {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/add-coin`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                eventId: eventId,
                coin: coin
            }),
        });
        if (response.ok) {
            //const data = await response.json();
            //console.log(data)
        } else {
            const errorData = await response.json();
            console.error("Error add coin:", response.status, response.statusText, errorData);
        }
    } catch (error) {
        console.error("Error fetching game ID:", error);
    }
}

async function addTurn(token, eventId, turn) {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/add-turn`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                eventId: eventId,
                turn: turn
            }),
        });
        if (response.ok) {
            console.log("Lượt chơi đã được cộng thành công");
        } else {
            const errorData = await response.json();
            console.error("Error adding turn:", response.status, response.statusText, errorData);
        }
    } catch (error) {
        console.error("Error adding turn:", error);
    }
}


