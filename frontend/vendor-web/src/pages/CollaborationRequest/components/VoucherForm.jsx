import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setVoucherForm } from '../../../store/formsSlice';
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
    Select,
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
        value: '',
        voucherQuantities: '',
        endDate: ''
    });

    function handleInputChange(identifier, value) {
        let processedValue = value;
    
    
        // Dispatch the update to Redux store
        dispatch(setVoucherForm({
            ...formValues,
            voucherDTO: {
                ...formValues.voucherDTO,
                [identifier]: processedValue
            }
        }));
    
        setErrors(prevErrors => ({
            ...prevErrors,
            [identifier]: ''
        }));
    }
    

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: 'image/*',
        multiple: false, 
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0]; 

                dispatch(setVoucherForm({
                    ...formValues,
                    voucherImage: file 
                }));
            }
        }
    });



    function handleInputBlur(identifier) {
        validateField(identifier);
    }

    function validateField(identifier) {
        const value = formValues.voucherDTO[identifier];
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
            case 'value':
                if (!value) {
                    errorMessage = 'Bạn phải chọn loại voucher.';
                }
                break;
            case 'voucherQuantities':
                if (!value || value <= 0) {
                    errorMessage = 'Số lượng voucher phải lớn hơn 0.';
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


        const fields = ['description', 'endDate', 'value', 'voucherQuantities'];
        let formIsValid = true;

        fields.forEach(field => {
            if (!formValues.voucherDTO[field]) {
                validateField(field);
                formIsValid = false;
            }
        });

        if (formValues.voucherDTO.voucherQuantities <= 0) {
            setErrors(prevErrors => ({
                ...prevErrors,
                voucherQuantities: 'Số lượng voucher không hợp lệ.'
            }));
            formIsValid = false;
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
                            {formValues.voucherImage && (
                                <Box mt={2}>
                                    <Image
                                        src={URL.createObjectURL(formValues.voucherImage)}
                                        alt="Preview"
                                        boxSize="full"
                                        objectFit="contain"
                                    />
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

                        <FormControl isInvalid={!!errors.value}>
                            <FormLabel htmlFor="value">
                                Loại voucher
                                <Text as="span" color="red.500" ml={1}>*</Text>
                            </FormLabel>
                            <Select
                                id="value"
                                value={formValues.voucherDTO.value}
                                onChange={(event) => handleInputChange('value', Number(event.target.value))}
                                onBlur={() => handleInputBlur('value')}
                            >
                                <option value="">Chọn loại voucher</option>
                                <option value="10">Voucher 10%</option>
                                <option value="20">Voucher 20%</option>
                                <option value="30">Voucher 30%</option>
                            </Select>
                            {errors.value && <FormErrorMessage>{errors.value}</FormErrorMessage>}
                        </FormControl>

                        <FormControl isInvalid={!!errors.voucherQuantities}>
                            <FormLabel htmlFor="voucherQuantities">
                                Số lượng
                                <Text as="span" color="red.500" ml={1}>*</Text>
                            </FormLabel>
                            <NumberInput
                                id="voucherQuantities"
                                value={formValues.voucherDTO.voucherQuantities}
                                onChange={(valueString) => handleInputChange('voucherQuantities', Number(valueString))}
                                onBlur={() => handleInputBlur('voucherQuantities')}
                                min={1}
                            >
                                <NumberInputField placeholder="Nhập số lượng" />
                            </NumberInput>
                            {errors.voucherQuantities && <FormErrorMessage>{errors.voucherQuantities}</FormErrorMessage>}
                        </FormControl>

                        <FormControl isInvalid={!!errors.endDate}>
                            <FormLabel htmlFor="endDate">
                                Hạn sử dụng đến
                                <Text as="span" color="red.500" ml={1}>*</Text>
                            </FormLabel>
                            <DatePicker
                                selected={formValues.voucherDTO.endDate}
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
