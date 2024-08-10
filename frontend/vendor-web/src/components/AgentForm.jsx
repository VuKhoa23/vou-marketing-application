import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setStep } from '../store/stepSlice';
import {
    Box,
    FormControl,
    FormLabel,
    Input,
    Button,
    VStack,
    HStack,
    Text,
    FormErrorMessage
} from '@chakra-ui/react';

function AgentForm() {

    const dispatch = useDispatch();

    const [enteredValues, setEnteredValues] = useState({
        agentName: '',
        email: '',
        phone: ''
    });

    const [errors, setErrors] = useState({
        agentName: '',
        email: '',
        phone: ''
    });

    function handleInputChange(identifier, value) {
        setEnteredValues(prevValues => ({
            ...prevValues,
            [identifier]: value
        }));

        // Clear the error for this field when user starts typing
        setErrors(prevErrors => ({
            ...prevErrors,
            [identifier]: ''
        }));
    }

    function handleInputBlur(identifier) {
        validateField(identifier);
    }

    function validateField(identifier) {
        const value = enteredValues[identifier];
        let errorMessage = '';

        switch (identifier) {
            case 'agentName':
                if (!value.trim()) {
                    errorMessage = 'Họ tên không được bỏ trống.';
                }
                break;
            case 'phone':
                const phonePattern = /^[0-9]{10,11}$/;
                if (!value.trim()) {
                    errorMessage = 'Số điện thoại không được bỏ trống.';
                } else if (!phonePattern.test(value)) {
                    errorMessage = 'Số điện thoại phải là 10-11 chữ số.';
                }
                break;
            case 'email':
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value.trim()) {
                    errorMessage = 'Email không được bỏ trống.';
                } else if (!emailPattern.test(value)) {
                    errorMessage = 'Email không hợp lệ. Phải có ký tự "@" và ".", và có chữ giữa "@" và ".".';
                }
                break;
            default:
                break;
        }

        setErrors(prevErrors => ({
            ...prevErrors,
            [identifier]: errorMessage
        }));
    }

    function handlePrev() {
        dispatch(setStep(1));
    }

    function handleSubmit(event) {
        event.preventDefault();

        // Validate all fields before submitting
        const fieldsToValidate = ['agentName', 'phone', 'email'];
        fieldsToValidate.forEach(field => validateField(field));

        // Check if there are any errors
        if (Object.values(errors).some(error => error)) {
            return; // Do not submit if there are errors
        }

        dispatch(setStep(3));
    }

    return (
        <Box className="p-4 max-w-4xl mx-auto" bg="gray.50" borderRadius="md" boxShadow="md">
            <form onSubmit={handleSubmit}>
                <VStack spacing={4} align="stretch">
                    <FormControl isInvalid={!!errors.agentName}>
                        <FormLabel htmlFor="agentName">
                            Họ tên
                            <Text as="span" color="red.500" ml={1}>*</Text>
                        </FormLabel>
                        <Input
                            id="agentName"
                            type="text"
                            value={enteredValues.agentName}
                            onChange={(event) => handleInputChange('agentName', event.target.value)}
                            onBlur={() => handleInputBlur('agentName')}
                            placeholder='Nguyễn Văn A'
                        />
                        {errors.agentName && <FormErrorMessage>{errors.agentName}</FormErrorMessage>}
                    </FormControl>

                    <FormControl isInvalid={!!errors.phone}>
                        <FormLabel htmlFor="phone">
                            Số điện thoại
                            <Text as="span" color="red.500" ml={1}>*</Text>
                        </FormLabel>
                        <Input
                            id="phone"
                            type="tel"
                            value={enteredValues.phone}
                            onChange={(event) => handleInputChange('phone', event.target.value)}
                            onBlur={() => handleInputBlur('phone')}
                            placeholder='0999999999'
                        />
                        {errors.phone && <FormErrorMessage>{errors.phone}</FormErrorMessage>}
                    </FormControl>

                    <FormControl isInvalid={!!errors.email}>
                        <FormLabel htmlFor="email">
                            Email
                            <Text as="span" color="red.500" ml={1}>*</Text>
                        </FormLabel>
                        <Input
                            id="email"
                            type="email"
                            value={enteredValues.email}
                            onChange={(event) => handleInputChange('email', event.target.value)}
                            onBlur={() => handleInputBlur('email')}
                            placeholder='personalmail@email.com'
                        />
                        {errors.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
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
                            type='submit'
                        >
                            Tiếp theo
                        </Button>
                    </HStack>
                </VStack>
            </form>
        </Box>
    );
}

export default AgentForm;
