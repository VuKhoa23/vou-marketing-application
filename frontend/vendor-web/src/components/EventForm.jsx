import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { stepAction } from '../store';
import {
    Box,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Button,
    Grid,
    VStack,
    Image,
    Select,
    InputGroup,
    InputRightElement,
    Icon,
    Checkbox,
    NumberInput,
    NumberInputField,
    FormErrorMessage,
    HStack,
    Text
} from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './custom-datepicker.css';
import { CalendarIcon } from '@chakra-ui/icons';

function EventForm() {

    const dispatch = useDispatch();

    const [formValues, setFormValues] = useState({
        images: [],
        eventName: '',
        slogan: '',
        info: '',
        startDate: null,
        endDate: null,
        gameType: '',
        vouchers: {}, // Chứa thông tin voucher và số lượng
    });

    const [errors, setErrors] = useState({
        eventName: '',
        startDate: '',
        endDate: '',
        gameType: '',
        vouchers: '',
    });


    function handleInputChange(identifier, value) {
        setFormValues(prevValues => {
            const updatedValues = { ...prevValues, [identifier]: value };

            // Kiểm tra ngày kết thúc phải lớn hơn ngày bắt đầu
            if (identifier === 'startDate' && updatedValues.endDate && new Date(value) > new Date(updatedValues.endDate)) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    startDate: 'Ngày bắt đầu không thể sau ngày kết thúc.'
                }));
                return prevValues;
            }
            if (identifier === 'endDate' && updatedValues.startDate && new Date(value) < new Date(updatedValues.startDate)) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    endDate: 'Ngày kết thúc không thể trước ngày bắt đầu.'
                }));
                return prevValues;
            }

            setErrors(prevErrors => ({
                ...prevErrors,
                [identifier]: ''
            }));

            return updatedValues;
        });
    }

    function handleVoucherChange(voucherType) {
        setFormValues(prev => {
            const newVouchers = {
                ...prev.vouchers,
                [voucherType]: {
                    ...prev.vouchers[voucherType],
                    selected: !prev.vouchers[voucherType]?.selected,
                    quantity: !prev.vouchers[voucherType]?.selected ? 0 : prev.vouchers[voucherType]?.quantity // Reset quantity if deselected
                }
            };

            // Clear voucher errors if voucher is selected or deselected
            setErrors(prevErrors => ({
                ...prevErrors,
                vouchers: Object.values(newVouchers).some(voucher => voucher.selected) ? '' : 'Bạn phải chọn ít nhất một loại voucher.'
            }));

            return {
                ...prev,
                vouchers: newVouchers
            };
        });
    }

    function handleQuantityChange(voucherType, value) {
        setFormValues(prev => {
            const newVouchers = {
                ...prev.vouchers,
                [voucherType]: {
                    ...prev.vouchers[voucherType],
                    quantity: value
                }
            };

            // Clear voucher quantity errors if quantity is entered
            setErrors(prevErrors => ({
                ...prevErrors,
                vouchers: Object.values(newVouchers).some(voucher => voucher.selected && voucher.quantity) ? '' : 'Số lượng voucher không hợp lệ.'
            }));

            return {
                ...prev,
                vouchers: newVouchers
            };
        });
    }

    function validateField(identifier) {
        const value = formValues[identifier];
        let errorMessage = '';

        switch (identifier) {
            case 'eventName':
                if (!value) {
                    errorMessage = 'Tên sự kiện không được bỏ trống.';
                }
                break;
            case 'startDate':
                if (!value) {
                    errorMessage = 'Ngày bắt đầu không được bỏ trống.';
                } else if (formValues.endDate && new Date(value) > new Date(formValues.endDate)) {
                    errorMessage = 'Ngày bắt đầu không thể sau ngày kết thúc.';
                }
                break;
            case 'endDate':
                if (!value) {
                    errorMessage = 'Ngày kết thúc không được bỏ trống.';
                } else if (formValues.startDate && new Date(value) < new Date(formValues.startDate)) {
                    errorMessage = 'Ngày kết thúc không thể trước ngày bắt đầu.';
                }
                break;
            case 'gameType':
                if (!value) {
                    errorMessage = 'Bạn phải chọn loại trò chơi.';
                }
                break;
            case 'vouchers':
                const selectedVouchers = Object.values(formValues.vouchers).some(voucher => voucher.selected);
                if (!selectedVouchers) {
                    errorMessage = 'Bạn phải chọn ít nhất một loại voucher.';
                } else {
                    const invalidQuantities = Object.values(formValues.vouchers).some(voucher => voucher.selected && !voucher.quantity);
                    if (invalidQuantities) {
                        errorMessage = 'Số lượng voucher không hợp lệ.';
                    }
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

    const handleNavigate = (event) => {
        event.preventDefault();
        const fields = ['eventName', 'startDate', 'endDate', 'gameType'];
        let formIsValid = true;

        fields.forEach(field => {
            if (!formValues[field]) {
                validateField(field);
                formIsValid = false;
            }
        });

        validateField('vouchers');
        if (errors.vouchers) {
            formIsValid = false;
        }

        if (formValues.vouchers) {
            const invalidQuantities = Object.values(formValues.vouchers).some(voucher => voucher.selected && !voucher.quantity);
            if (invalidQuantities) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    vouchers: 'Số lượng voucher không hợp lệ.'
                }));
                formIsValid = false;
            }
        }

        if (formIsValid) {
            dispatch(stepAction.setStep(4));
        }

        console.log(formValues);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: 'image/*',
        multiple: true,
        onDrop: (acceptedFiles) => {
            const files = acceptedFiles.map(file => URL.createObjectURL(file));
            setFormValues(prevValues => ({
                ...prevValues,
                images: [...prevValues.images, ...files]
            }));
        }
    });

    function handlePrev () {
        dispatch(stepAction.setStep(2));
    }

    const CustomInput = React.forwardRef(({ value, onClick, onBlur }, ref) => (
        <InputGroup>
            <InputRightElement pointerEvents="none">
                <Icon as={CalendarIcon} color="gray.500" />
            </InputRightElement>
            <Input
                ref={ref}
                value={value}
                onClick={onClick}
                onBlur={onBlur}
                placeholder="Chọn ngày"
                readOnly
            />
        </InputGroup>
    ));

    return (
        <Box className="p-4 max-w-4xl mx-auto" bg="gray.50" borderRadius="md" boxShadow="md">
            <form>
                <Grid templateColumns={{ base: '1fr', md: '1fr 2fr' }} gap={6}>
                    <Box>
                        <FormControl>
                            <FormLabel htmlFor="images">Hình ảnh cho sự kiện</FormLabel>
                            <Box
                                {...getRootProps()}
                                border="2px dashed"
                                borderColor={isDragActive ? 'blue.500' : 'gray.300'}
                                p={4}
                                borderRadius="md"
                                cursor="pointer"
                                textAlign="center"
                            >
                                <input {...getInputProps()} id="images" />
                                {isDragActive ? (
                                    <p>Kéo và thả ảnh vào đây...</p>
                                ) : (
                                    <p>Nhấp hoặc kéo và thả ảnh vào đây để tải lên</p>
                                )}
                            </Box>
                            <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
                                {formValues.images.map((src, index) => (
                                    <Image
                                        key={index}
                                        src={src}
                                        alt={`Preview ${index}`}
                                        boxSize="100px"
                                        objectFit="cover"
                                        borderRadius="md"
                                    />
                                ))}
                            </Box>
                        </FormControl>
                    </Box>

                    <VStack spacing={4} align="stretch">
                        <FormControl isInvalid={!!errors.eventName}>
                            <FormLabel htmlFor="eventName">
                                Tên sự kiện
                                <Text as="span" color="red.500" ml={1}>*</Text>
                            </FormLabel>
                            <Input
                                id="eventName"
                                type="text"
                                value={formValues.eventName}
                                onChange={(e) => handleInputChange('eventName', e.target.value)}
                                onBlur={() => validateField('eventName')}
                                placeholder='Tên sự kiện'
                            />
                            <FormErrorMessage>{errors.eventName}</FormErrorMessage>
                        </FormControl>

                        <FormControl>
                            <FormLabel htmlFor="slogan">Khẩu hiệu sự kiện</FormLabel>
                            <Input
                                id="slogan"
                                type="text"
                                value={formValues.slogan}
                                onChange={(e) => handleInputChange('slogan', e.target.value)}
                                placeholder='Khẩu hiệu sự kiện'
                            />
                        </FormControl>

                        <FormControl isInvalid={!!errors.gameType}>
                            <FormLabel htmlFor="gameType">
                                Loại trò chơi
                                <Text as="span" color="red.500" ml={1}>*</Text>
                            </FormLabel>
                            <Select
                                id="gameType"
                                value={formValues.gameType}
                                onChange={(e) => handleInputChange('gameType', e.target.value)}
                                onBlur={() => validateField('gameType')}
                            >
                                <option value="">Chọn loại trò chơi</option>
                                <option value="trivia">Trivia (Câu hỏi trắc nghiệm)</option>
                                <option value="shake">Lắc xu</option>
                            </Select>
                            <FormErrorMessage>{errors.gameType}</FormErrorMessage>
                        </FormControl>

                        <Box>
                            <FormControl isInvalid={!!errors.vouchers}>
                                <FormLabel htmlFor="vouchers">
                                    Chọn loại voucher và số lượng
                                    <Text as="span" color="red.500" ml={1}>*</Text>
                                </FormLabel>
                                <Box>
                                    {['Voucher 10%', 'Voucher 20%', 'Voucher 30%'].map((voucherType) => (
                                        <Box className='flex justify-between ' key={voucherType} mb={4}>
                                            <Checkbox
                                                id={voucherType}
                                                isChecked={formValues.vouchers[voucherType]?.selected || false}
                                                onChange={() => handleVoucherChange(voucherType)}
                                            >
                                                {voucherType}
                                            </Checkbox>
                                            {formValues.vouchers[voucherType]?.selected && (
                                                <NumberInput
                                                    mt={2}
                                                    value={formValues.vouchers[voucherType]?.quantity || ''}
                                                    onChange={(value) => handleQuantityChange(voucherType, value)}
                                                    min={1}
                                                    precision={0}
                                                >
                                                    <NumberInputField placeholder="Nhập số lượng" />
                                                </NumberInput>
                                            )}
                                        </Box>
                                    ))}
                                    <FormErrorMessage>{errors.vouchers}</FormErrorMessage>
                                </Box>
                            </FormControl>
                        </Box>

                        <div className='flex'>
                            <FormControl isInvalid={!!errors.startDate}>
                                <FormLabel htmlFor="startDate">
                                    Ngày bắt đầu
                                    <Text as="span" color="red.500" ml={1}>*</Text>
                                </FormLabel>
                                <DatePicker
                                    selected={formValues.startDate}
                                    onChange={(date) => handleInputChange('startDate', date)}
                                    onBlur={() => validateField('startDate')}
                                    dateFormat="dd/MM/yyyy"
                                    customInput={<CustomInput />}
                                    minDate={new Date()}
                                    className="custom-datepicker"
                                />
                                <FormErrorMessage>{errors.startDate}</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!errors.endDate}>
                                <FormLabel htmlFor="endDate">
                                    Ngày kết thúc
                                    <Text as="span" color="red.500" ml={1}>*</Text>
                                </FormLabel>
                                <DatePicker
                                    selected={formValues.endDate}
                                    onChange={(date) => handleInputChange('endDate', date)}
                                    onBlur={() => validateField('endDate')}
                                    dateFormat="dd/MM/yyyy"
                                    customInput={<CustomInput />}
                                    minDate={new Date()}
                                    className="custom-datepicker"
                                />
                                <FormErrorMessage>{errors.endDate}</FormErrorMessage>
                            </FormControl>
                        </div>

                        <FormControl>
                            <FormLabel htmlFor="info">Mô tả ngắn về sự kiện</FormLabel>
                            <Textarea
                                id="info"
                                value={formValues.info}
                                onChange={(e) => handleInputChange('info', e.target.value)}
                            />
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
                                onClick={handleNavigate}
                            >
                                Tiếp theo
                            </Button>
                        </HStack>
                    </VStack>
                </Grid>
            </form>
        </Box>
    );
}

export default EventForm;
