import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalFooter,
    Button,
    Text,
    Box,
    Flex,
    Image,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    useToast
} from '@chakra-ui/react';

import { FaTicketAlt } from 'react-icons/fa';
import { BiCoin } from 'react-icons/bi';

const VoucherModal = ({ isOpen, onClose, voucher, userCoin, setUserCoin, setUserVoucher, eventId, token }) => {

    const [voucherCount, setVoucherCount] = useState(0);
    const [coinNeeded, setCoinNeeded] = useState(0);
    const toast = useToast();

    useEffect(() => {
        setCoinNeeded(voucherCount * 50);
    }, [voucherCount]);

    const handleRedeem = () => {
        if (coinNeeded > userCoin) {
            toast({
                title: "Lỗi",
                description: "Bạn không có đủ xu để quy đổi voucher.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } else if (voucherCount === 0) {
            toast({
                title: "Lỗi",
                description: "Hãy chọn số lượng voucher cần đổi",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } else {
            setUserCoin(prevCoin => prevCoin - coinNeeded);
            setUserVoucher(prevVoucher => prevVoucher + voucherCount);
            exchageVoucher(token, voucher.id, voucherCount, parseInt(eventId, 10), coinNeeded);
            toast({
                title: "Thành công",
                description: `Bạn đã đổi thành công ${voucherCount} voucher.`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            setVoucherCount(0);
        }
    };

    const handleVoucherCountChange = (value) => {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue)) {
            setVoucherCount(Math.min(numValue, 99));
        } else {
            setVoucherCount(0);
        }
    };

    return (
        <Modal isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
            <ModalContent borderRadius="20px" background="#bfdbfe">
                <ModalBody className='bg-blue-200 rounded-xl mb-6'>
                    <Text className='text-center text-2xl font-bold mb-4'>QUY ĐỔI VOUCHER</Text>

                    <Flex direction="column" align="center">
                        <Image
                            src={voucher.imageURL}
                            alt='Voucher Image'
                            objectFit="cover"
                            mb={4}
                            background="transparent"
                        />
                        <Box textAlign="center" mb={4}>
                            <Text fontSize="lg" fontWeight="semibold">{voucher.description}</Text>
                            <Text fontSize="md">Giá trị: <b>giảm giá {voucher.value}% cho tổng hóa đơn</b></Text>
                            <Text fontSize="md">Hạn sử dụng: <b>{voucher.endDate}</b></Text>
                        </Box>
                    </Flex>
                    <Box mt={2}>
                        <Flex justify="center" align="center" direction="row" >
                            <Text fontSize="lg" fontWeight="bold" mx={2}>1</Text>
                            <FaTicketAlt className="text-black-500" size={24} />
                            <Text fontSize="lg" fontWeight="bold" ml={6} mr={6}>=</Text>
                            <Box mr={2}>
                                <Text fontSize="lg" fontWeight="bold">50</Text>
                            </Box>
                            <BiCoin className="text-yellow-500" size={24} />
                        </Flex>
                        <Flex justify="center" align="center">
                            <Flex direction="column" align="center" mr={4}>
                                <NumberInput
                                    size='lg'
                                    maxW={32}
                                    value={voucherCount}
                                    background="white"
                                    borderRadius={20}
                                    min={0}
                                    max={99}
                                    onChange={(value) => handleVoucherCountChange(value)}
                                >
                                    <NumberInputField height="53px" />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </Flex>
                            <FaTicketAlt className='text-black-500 ml-3' size={50} />
                            <Text className='text-5xl mb-2 mx-4'>=</Text>
                            <Flex direction="column" align="flex-start" position="relative">
                                <Flex direction="row">
                                    <Box
                                        borderRadius="md"
                                        p={2}
                                        width="100px"
                                        textAlign="center"
                                        fontSize="2xl"
                                        background="white"
                                        zIndex={1}
                                        mr={2}
                                    >
                                        {coinNeeded}
                                    </Box>
                                    <BiCoin className='text-yellow-500' size={50} />
                                </Flex>
                                <Text
                                    fontSize="xs"
                                    fontWeight="bold"
                                    position="absolute"
                                    bottom="-20px"
                                >
                                    (Số xu hiện có: {userCoin})
                                </Text>
                            </Flex>
                        </Flex>
                    </Box>
                </ModalBody>
                <ModalFooter className='bg-blue-200 rounded-xl'>
                    <Button colorScheme="blue" mr={4} onClick={handleRedeem}>Quy đổi ngay</Button>
                    <Button colorScheme="gray" onClick={onClose}>Hủy</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default VoucherModal;

async function exchageVoucher(token, voucherId, voucherCount, eventId, coin) {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/exchange-voucher`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                voucherId: voucherId,
                voucherQuantities: voucherCount,
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