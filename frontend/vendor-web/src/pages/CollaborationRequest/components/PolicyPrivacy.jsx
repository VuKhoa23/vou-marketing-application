import React, { useState } from "react";
import AWS from 'aws-sdk';
import {
    Box,
    Checkbox,
    Button,
    Text,
    VStack,
    HStack,
    FormControl,
    FormErrorMessage,
    useToast,
} from "@chakra-ui/react";
import { setStep } from "../../../store/slices/stepSlice";
import { useDispatch, useSelector } from "react-redux";
import { submitAllForms } from "../../../store/actions";
import { useNavigate } from "react-router-dom";
import { resetForms } from "../../../store/slices/formsSlice";
import { setEvents } from "../../../store/slices/eventsSlice";

const PolicyPrivacy = () => {
    const toast = useToast();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const brandId = useSelector((state) => state.brand.id);
    const {
        eventImage,
        eventDTO: { name, startDate, endDate, isShaking, isTrivia },
    } = useSelector((state) => state.forms.eventForm);

    const {
        voucherImage,
        voucherDTO: { description, endDate: voucherEndDate, voucherQuantities, value },
    } = useSelector((state) => state.forms.voucherForm);

    const triviaTime = useSelector((state) => state.forms.triviaTime);

    const [termsAccepted, setTermsAccepted] = useState(false);
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const [error, setError] = useState("");

    async function fetchEvents() {
        //const response = await fetch("http://localhost/api/brand/event/events-and-vouchers?brandId=1");
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/brand/event/events-and-vouchers?brandId=${brandId}`);
        if (response.ok) {
            const apiData = await response.json();
            const transformedData = transformData(apiData);
            dispatch(setEvents(transformedData));
        }
    }

    // Function to handle S3 upload
    async function uploadToS3(file, bucketName) {
        // Configure AWS SDK
        AWS.config.update({
            accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID, // Your IAM user's access key
            secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY, // Your IAM user's secret key
            region: 'ap-southeast-2', // Example: 'us-east-1'
        });
        const s3 = new AWS.S3({
            apiVersion: '2012-10-17',
            params: { Bucket: bucketName },
        });

        const params = {
            Bucket: bucketName,
            Key: `${file.name}`, // Folder (if required) + file name
            Body: file,
            ContentType: file.type,
        };

        try {
            // Upload file to S3
            const data = await s3.upload(params).promise();
            return data.Location; // Return the uploaded file URL
        } catch (error) {
            console.error('Error uploading to S3:', error);
            throw error;
        }
    }

    const handleSubmit = async () => {
        if (termsAccepted && privacyAccepted) {
            const bucketName = 'first-time-using-s3-bucket'; // Your S3 bucket name
            try {

                const eventImageS3Url = await uploadToS3(eventImage, bucketName);
                console.log('Event Image uploaded to:', eventImageS3Url);

                const voucherImageS3Url = await uploadToS3(voucherImage, bucketName);
                console.log('Voucher Image uploaded to:', voucherImageS3Url);

                const formData = new FormData();
                formData.append("eventImage", eventImageS3Url);
                formData.append(
                    "eventDTO",
                    JSON.stringify({
                        name,
                        startDate,
                        endDate,
                        trivia: isTrivia,
                        shaking: isShaking,
                    })
                );
                formData.append("voucherImage", voucherImageS3Url);
                formData.append(
                    "voucherDTO",
                    JSON.stringify({
                        description,
                        endDate: voucherEndDate,
                        voucherQuantities,
                        value,
                    })
                );

                setError("");
                await dispatch(submitAllForms({ formData, brandId, triviaTime })).unwrap();
                fetchEvents();

                toast({
                    title: "Đăng ký thành công",
                    description: "Sự kiện của bạn đã được đăng ký.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });

                dispatch(resetForms());
                dispatch(setStep(1));
                navigate("/events", { replace: true });
            } catch (error) {
                console.error("Form submission error:", error);
                setError("Đã xảy ra lỗi khi tải lên hình ảnh hoặc gửi form.");
            }
        } else {
            setError("Vui lòng đồng ý với các điều khoản và chính sách bảo mật trước khi đăng ký.");
        }
    };



    const handleTermsChange = (e) => {
        setTermsAccepted(e.target.checked);
        if (e.target.checked && privacyAccepted) {
            setError("");
        }
    };

    const handlePrivacyChange = (e) => {
        setPrivacyAccepted(e.target.checked);
        if (e.target.checked && termsAccepted) {
            setError("");
        }
    };

    function handlePrev() {
        dispatch(setStep(2));
    }

    return (
        <Box p={4} maxW="4xl" mx="auto" bg="gray.50" borderRadius="md" boxShadow="md">
            <VStack spacing={4} align="start">
                <Text fontSize="lg" fontWeight="bold">
                    Xác Nhận và Chấp Nhận
                </Text>
                <Text>
                    Để hoàn tất quá trình đăng ký hợp tác và thực hiện chiến dịch quảng cáo, vui
                    lòng đọc kỹ các điều khoản và điều kiện cũng như chính sách bảo mật của chúng
                    tôi.
                </Text>

                <Text fontWeight="bold" mt={4}>
                    1. Điều Khoản và Điều Kiện
                </Text>
                <Text>
                    Chúng tôi yêu cầu bạn đồng ý với các điều khoản và điều kiện của nền tảng. Các
                    điều khoản này bao gồm nhưng không giới hạn ở:
                </Text>
                <Text>
                    • Quyền và Trách Nhiệm: Quyền lợi và trách nhiệm của các bên liên quan trong quá
                    trình thực hiện chiến dịch quảng cáo.
                </Text>
                <Text>
                    • Quy Định Về Nội Dung: Các quy định liên quan đến nội dung quảng cáo, bao gồm
                    các yêu cầu về chất lượng và các hạn chế liên quan đến nội dung không phù hợp.
                </Text>
                <Text>
                    • Thanh Toán và Chi Phí: Chính sách thanh toán, bao gồm các chi phí liên quan
                    đến dịch vụ và quy trình thanh toán.
                </Text>
                <Text>
                    • Chấm Dứt Hợp Tác: Quy trình và điều kiện để chấm dứt hợp tác trước khi hoàn
                    tất chiến dịch.
                </Text>

                <Text fontWeight="bold" mt={4}>
                    2. Chính Sách Bảo Mật
                </Text>
                <Text>
                    Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn và xử lý dữ liệu theo chính
                    sách bảo mật của chúng tôi. Chính sách này bao gồm:
                </Text>
                <Text>
                    • Thu Thập Dữ Liệu: Các loại dữ liệu cá nhân mà chúng tôi thu thập và mục đích
                    thu thập.
                </Text>
                <Text>
                    • Sử Dụng Dữ Liệu: Cách chúng tôi sử dụng dữ liệu cá nhân của bạn trong quá
                    trình hợp tác.
                </Text>
                <Text>
                    • Bảo Mật Dữ Liệu: Các biện pháp bảo mật mà chúng tôi áp dụng để bảo vệ dữ liệu
                    cá nhân của bạn.
                </Text>
                <Text>
                    • Chia Sẻ Dữ Liệu: Các trường hợp mà chúng tôi có thể chia sẻ dữ liệu cá nhân
                    của bạn với bên thứ ba.
                </Text>

                <FormControl isInvalid={!!error} mb={4}>
                    <Checkbox isChecked={termsAccepted} onChange={handleTermsChange}>
                        Tôi đồng ý với các điều khoản và điều kiện của nền tảng.
                    </Checkbox>
                    <Checkbox isChecked={privacyAccepted} onChange={handlePrivacyChange}>
                        Tôi đồng ý với chính sách bảo mật và cách thức xử lý dữ liệu cá nhân.
                    </Checkbox>
                    <FormErrorMessage>{error}</FormErrorMessage>
                </FormControl>

                <HStack w="full" spacing={4} mt={4} justify="space-between">
                    <Button variant="outline" bg="white" onClick={handlePrev}>
                        Quay Lại
                    </Button>

                    <Button colorScheme="teal" onClick={handleSubmit}>
                        Đăng ký
                    </Button>
                </HStack>
            </VStack>
        </Box>
    );
};

export default PolicyPrivacy;

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

function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getFullYear()}`;
}
