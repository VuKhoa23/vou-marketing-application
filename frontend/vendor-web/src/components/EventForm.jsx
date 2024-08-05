import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEventForm } from '../store/formsSlice';
import { setStep } from '../store/stepSlice';
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
    const formValues = useSelector(state => state.forms.eventForm);

    const [errors, setErrors] = React.useState({
        eventName: '',
        startDate: '',
        endDate: '',
        gameType: '',
    });

    function handleInputChange(identifier, value) {
        // Dispatch the update to Redux store
        dispatch(setEventForm({
            ...formValues,
            [identifier]: value
        }));

        setErrors(prevErrors => ({
            ...prevErrors,
            [identifier]: ''
        }));

        // Validation
        if (identifier === 'startDate' && value && formValues.endDate && new Date(value) > new Date(formValues.endDate)) {
            setErrors(prevErrors => ({
                ...prevErrors,
                startDate: 'Ngày bắt đầu không thể sau ngày kết thúc.'
            }));
        }
        if (identifier === 'endDate' && value && formValues.startDate && new Date(value) < new Date(formValues.startDate)) {
            setErrors(prevErrors => ({
                ...prevErrors,
                endDate: 'Ngày kết thúc không thể trước ngày bắt đầu.'
            }));
        }
        
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

        if (formIsValid) {
            dispatch(setStep(2));
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: 'image/*',
        multiple: true,
        onDrop: (acceptedFiles) => {
            const files = acceptedFiles.map(file => URL.createObjectURL(file));
            dispatch(setEventForm({
                ...formValues,
                images: [...formValues.images, ...files]
            }));
        }
    });

    function handlePrev () {
        dispatch(setStep(1));
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
