import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setVoucherForm, updateVoucherQuantity } from '../../../store/formsSlice';
import { setStep } from '../../../store/stepSlice';
import {
    Box,
    FormControl,
    FormLabel,
    Input,
    Button,
    VStack,
    HStack,
    Text,
    FormErrorMessage,
    Radio,
    RadioGroup,
    NumberInput,
    NumberInputField,
    Image,
    Grid,
    InputGroup,
    InputRightElement,
    Icon,
} from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import { CalendarIcon } from '@chakra-ui/icons';
import DatePicker from 'react-datepicker';

function VoucherForm() {
    const dispatch = useDispatch();
    const formValues = useSelector(state => state.forms.voucherForm);

    const [errors, setErrors] = React.useState({
        description: '',
        vouchers: '',
        endDate: ''
    });

    function handleVoucherChange(voucherType) {
        // Update voucher selection and clear quantities of non-selected vouchers
        const updatedVouchers = Object.keys(formValues.vouchers).reduce((acc, type) => {
            acc[type] = {
                selected: type === voucherType ? true : false,
                quantity: type === voucherType ? formValues.vouchers[voucherType]?.quantity || 0 : 0
            };
            return acc;
        }, {});

        dispatch(setVoucherForm({
            ...formValues,
            vouchers: updatedVouchers
        }));
    }

    function handleQuantityChange(voucherType, value) {
        dispatch(updateVoucherQuantity({ voucherType, quantity: value }));
    }

    function handleInputChange(identifier, value) {
        dispatch(setVoucherForm({
            ...formValues,
            [identifier]: value
        }));

        setErrors(prevErrors => ({
            ...prevErrors,
            [identifier]: ''
        }));
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: 'image/*',
        multiple: true,
        onDrop: (acceptedFiles) => {
            const files = acceptedFiles.map(file => URL.createObjectURL(file));
            dispatch(setVoucherForm({
                ...formValues,
                images: [...formValues.images, ...files]
            }));
        }
    });

    function handleInputBlur(identifier) {
        validateField(identifier);
    }

    function validateField(identifier) {
        const value = formValues[identifier];
        let errorMessage = '';

        switch (identifier) {
            case 'description':
                if (!value) {
                    errorMessage = 'Mô tả không được bỏ trống.';
                }
                break;
            case 'endDate':
                if (!value) {
                    errorMessage = 'Hạn sử dụng không được bỏ trống.';
                }
                break;
            case 'vouchers':
                const selectedVoucher = Object.values(formValues.vouchers).find(voucher => voucher.selected);
                if (!selectedVoucher) {
                    errorMessage = 'Bạn phải chọn một loại voucher.';
                } else if (selectedVoucher && !selectedVoucher.quantity) {
                    errorMessage = 'Số lượng voucher không hợp lệ.';
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

    function handlePrev() {
        dispatch(setStep(1));
    }

    function handleNavigate(event) {
        event.preventDefault();

        const fields = ['description', 'endDate'];
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
            const selectedVoucher = Object.values(formValues.vouchers).find(voucher => voucher.selected);
            if (selectedVoucher && !selectedVoucher.quantity) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    vouchers: 'Số lượng voucher không hợp lệ.'
                }));
                formIsValid = false;
            }
        }

        if (formIsValid) {
            dispatch(setStep(3));
        }
    }

    return (
        <Box className="p-4 max-w-4xl mx-auto" bg="gray.50" borderRadius="md" boxShadow="md">
            <form>
                <Grid templateColumns={{ base: '1fr', md: '1fr 2fr' }} gap={6}>
                    <Box>
                        <FormControl>
                            <FormLabel htmlFor="image">Hình ảnh cho voucher</FormLabel>
                            <Box
                                {...getRootProps()}
                                border="2px dashed"
                                borderColor={isDragActive ? 'blue.500' : 'gray.300'}
                                p={4}
                                borderRadius="md"
                                cursor="pointer"
                                textAlign="center"
                            >
                                <input {...getInputProps()} id="image" />
                                {isDragActive ? (
                                    <p>Kéo và thả ảnh vào đây...</p>
                                ) : (
                                    <p>Nhấp hoặc kéo và thả ảnh vào đây để tải lên</p>
                                )}
                            </Box>
                            {formValues.images.length > 0 && (
                                <Box mt={2}>
                                    {formValues.images.map((img, index) => (
                                        <Image key={index} src={img} alt={`Preview ${index}`} boxSize="full" objectFit="contain" />
                                    ))}
                                </Box>
                            )}
                        </FormControl>
                    </Box>

                    <VStack spacing={4} align="stretch">
                        <FormControl isInvalid={!!errors.description}>
                            <FormLabel htmlFor="description">
                                Mô tả
                                <Text as="span" color="red.500" ml={1}>*</Text>
                            </FormLabel>
                            <Input
                                id="description"
                                type="text"
                                value={formValues.description}
                                onChange={(event) => handleInputChange('description', event.target.value)}
                                onBlur={() => handleInputBlur('description')}
                                placeholder='Những ưu đãi đặc biệt vào mùa hè'
                            />
                            {errors.description && <FormErrorMessage>{errors.description}</FormErrorMessage>}
                        </FormControl>

                        <Box>
                            <FormControl isInvalid={!!errors.vouchers}>
                                <FormLabel htmlFor="vouchers">
                                    Chọn loại voucher và số lượng
                                    <Text as="span" color="red.500" ml={1}>*</Text>
                                </FormLabel>
                                <RadioGroup
                                    onChange={handleVoucherChange}
                                    value={Object.keys(formValues.vouchers).find(voucherType => formValues.vouchers[voucherType]?.selected)}
                                >
                                    <Box>
                                        {['Voucher 10%', 'Voucher 20%', 'Voucher 30%'].map((voucherType) => (
                                            <Box className='flex justify-between' key={voucherType} mb={4}>
                                                <Radio value={voucherType}>
                                                    {voucherType}
                                                </Radio>
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
                                    </Box>
                                </RadioGroup>
                                <FormErrorMessage>{errors.vouchers}</FormErrorMessage>
                            </FormControl>
                        </Box>

                        <FormControl isInvalid={!!errors.endDate}>
                            <FormLabel htmlFor="endDate">
                                Hạn sử dụng đến
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

export default VoucherForm;
