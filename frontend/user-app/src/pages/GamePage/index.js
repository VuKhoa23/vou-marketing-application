import '../GamePage/style/index.css';
import Regulations from './components/Regulation';
import React, { useState, useRef, useEffect } from 'react';
import { BiCoin } from 'react-icons/bi';
import { FaFacebook, FaUserFriends, FaTicketAlt, FaPlus } from 'react-icons/fa';
import { useDisclosure, Text, Alert, AlertIcon, AlertTitle, AlertDescription, Box, CloseButton } from '@chakra-ui/react';
import VoucherModal from './components/ExchangeVoucher';
import { useParams } from "react-router-dom";

const DUMMY_VOUCHER = {
    image: "/voucher1.png",
    description: "Voucher giảm giá nhân sự kiện khai trương chi nhánh mới",
    value: "30%",
    endDate: "30-10-2024"
}

function GamePage() {

    const { eventId } = useParams();

    const [isShaking, setIsShaking] = useState(false);
    const [countdown, setCountdown] = useState(10);
    const [videoPlayed, setVideoPlayed] = useState(false);
    const [isCounting, setIsCounting] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [attemp, setAttemp] = useState(2);
    const [coinReward, setCoinReward] = useState(0);
    const [userCoin, setUserCoin] = useState(0);
    const videoRef = useRef(null);
    const bonusSectionRef = useRef(null);
    const alertRef = useRef(null);

    const { isOpen, onOpen, onClose } = useDisclosure();

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

    const handleAlertClose = () => {
        setShowAlert(false);
    };

    const scrollToBonusSection = () => {
        if (bonusSectionRef.current) {
            bonusSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

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

                        <Box className="basis-2/5 px-4">
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
                                    <Text className='text-xl font-semibold mb-2'>
                                        Xin từ bạn bè
                                    </Text>
                                    <Text className='text-md'>
                                        Để có thêm lượt chơi, hãy yêu cầu bạn bè gửi cho bạn lượt chơi.
                                        Bạn có thể mời họ qua tin nhắn hoặc thông qua các ứng dụng mạng xã hội.
                                    </Text>
                                </Box>
                            </Box>

                            <Box className='flex items-center p-4 border-2 border-blue-500 bg-white shadow-md'>
                                <FaFacebook className='text-blue-600 text-4xl mr-4' />
                                <Box className='flex-1'>
                                    <Text className='text-xl font-semibold mb-2'>
                                        Chia sẻ sự kiện lên Facebook
                                    </Text>
                                    <Text className='text-md'>
                                        Chia sẻ sự kiện của trò chơi lên Facebook để nhận thêm lượt chơi.
                                        Đảm bảo rằng bạn đã đăng nhập vào tài khoản Facebook của mình và nhấn
                                        nút chia sẻ để hoàn tất.
                                    </Text>
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
                        voucher={DUMMY_VOUCHER}
                    />
                </Box>
            </div>
        </div>
    );
}

export default GamePage;
