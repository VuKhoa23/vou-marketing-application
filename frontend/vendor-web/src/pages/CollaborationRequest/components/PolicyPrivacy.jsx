import React, { useState } from 'react';
import { Box, Checkbox, Button, Text, VStack, HStack, FormControl, FormErrorMessage } from '@chakra-ui/react';
import { setStep } from '../../../store/stepSlice';
import { useDispatch, useSelector } from 'react-redux';
import { submitAllForms } from '../../../store/actions';

const PolicyPrivacy = () => {

    const dispatch = useDispatch();
    const {
        eventImage,
        eventDTO: { name, startDate, endDate, isShaking, isTrivia }
    } = useSelector(state => state.forms.eventForm);
    
    const {
        voucherImage,
        voucherDTO: { description, endDate: voucherEndDate, voucherQuantities, value }
    } = useSelector(state => state.forms.voucherForm);

    const [termsAccepted, setTermsAccepted] = useState(false);
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (termsAccepted && privacyAccepted) {
            const formData = new FormData();
            
            formData.append('eventImage', eventImage);
            formData.append('eventDTO', JSON.stringify({
                name,
                startDate,
                endDate,
                "trivia": isTrivia,
                "shaking": isShaking
            }));
            formData.append('voucherImage', voucherImage);
            formData.append('voucherDTO', JSON.stringify({
                id: "1",
                description,
                endDate: voucherEndDate,
                voucherQuantities,
                value
            }));
    
            setError('');  
            try {
                await dispatch(submitAllForms(formData)).unwrap();
                console.log('Form submitted successfully');
            } catch (error) {
                console.error('Form submission error:', error);
            }
        } else {
            setError('Vui lòng đồng ý với các điều khoản và chính sách bảo mật trước khi đăng ký.');
        }
    };
    
    

    const handleTermsChange = (e) => {
        setTermsAccepted(e.target.checked);
        if (e.target.checked && privacyAccepted) {
            setError('');
        }
    };

    const handlePrivacyChange = (e) => {
        setPrivacyAccepted(e.target.checked);
        if (e.target.checked && termsAccepted) {
            setError('');
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
                    Để hoàn tất quá trình đăng ký hợp tác và thực hiện chiến dịch quảng cáo, vui lòng đọc kỹ các điều khoản và điều kiện cũng như chính sách bảo mật của chúng tôi.
                </Text>

                <Text fontWeight="bold" mt={4}>
                    1. Điều Khoản và Điều Kiện
                </Text>
                <Text>
                    Chúng tôi yêu cầu bạn đồng ý với các điều khoản và điều kiện của nền tảng. Các điều khoản này bao gồm nhưng không giới hạn ở:
                </Text>
                <Text>• Quyền và Trách Nhiệm: Quyền lợi và trách nhiệm của các bên liên quan trong quá trình thực hiện chiến dịch quảng cáo.</Text>
                <Text>• Quy Định Về Nội Dung: Các quy định liên quan đến nội dung quảng cáo, bao gồm các yêu cầu về chất lượng và các hạn chế liên quan đến nội dung không phù hợp.</Text>
                <Text>• Thanh Toán và Chi Phí: Chính sách thanh toán, bao gồm các chi phí liên quan đến dịch vụ và quy trình thanh toán.</Text>
                <Text>• Chấm Dứt Hợp Tác: Quy trình và điều kiện để chấm dứt hợp tác trước khi hoàn tất chiến dịch.</Text>

                <Text fontWeight="bold" mt={4}>
                    2. Chính Sách Bảo Mật
                </Text>
                <Text>
                    Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn và xử lý dữ liệu theo chính sách bảo mật của chúng tôi. Chính sách này bao gồm:
                </Text>
                <Text>• Thu Thập Dữ Liệu: Các loại dữ liệu cá nhân mà chúng tôi thu thập và mục đích thu thập.</Text>
                <Text>• Sử Dụng Dữ Liệu: Cách chúng tôi sử dụng dữ liệu cá nhân của bạn trong quá trình hợp tác.</Text>
                <Text>• Bảo Mật Dữ Liệu: Các biện pháp bảo mật mà chúng tôi áp dụng để bảo vệ dữ liệu cá nhân của bạn.</Text>
                <Text>• Chia Sẻ Dữ Liệu: Các trường hợp mà chúng tôi có thể chia sẻ dữ liệu cá nhân của bạn với bên thứ ba.</Text>

                <FormControl isInvalid={!!error} mb={4}>
                    <Checkbox
                        isChecked={termsAccepted}
                        onChange={handleTermsChange}
                        
                    >
                        Tôi đồng ý với các điều khoản và điều kiện của nền tảng.
                    </Checkbox>
                    <Checkbox
                        isChecked={privacyAccepted}
                        onChange={handlePrivacyChange}
                    >
                        Tôi đồng ý với chính sách bảo mật và cách thức xử lý dữ liệu cá nhân.
                    </Checkbox>
                    <FormErrorMessage>{error}</FormErrorMessage>
                </FormControl>

                <HStack w="full" spacing={4} mt={4} justify="space-between">
                    <Button
                        variant="outline"
                        bg="white"
                        onClick={handlePrev}
                    >
                        Quay Lại
                    </Button>

                    <Button
                        colorScheme="teal"
                        onClick={handleSubmit}
                    >
                        Đăng ký
                    </Button>
                </HStack>

            </VStack>
        </Box>
    );
};

export default PolicyPrivacy;
