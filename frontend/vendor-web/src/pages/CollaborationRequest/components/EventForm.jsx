import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEventForm, updateGameTypeSelection } from '../../../store/formsSlice';
import { setStep } from '../../../store/stepSlice';
import {
    Box,
    FormControl,
    FormLabel,
    Input,
    Button,
    Grid,
    VStack,
    Image,
    Checkbox,
    InputGroup,
    InputRightElement,
    Icon,
    FormErrorMessage,
    HStack,
    Text,
    Flex
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
        name: '',
        startDate: '',
        endDate: '',
        gameType: '',
    });

    function handleInputChange(identifier, value) {
        // Dispatch the update to Redux store
        dispatch(setEventForm({
            ...formValues,
            eventDTO: {
                ...formValues.eventDTO,
                [identifier]: value
            }
        }));

        setErrors(prevErrors => ({
            ...prevErrors,
            [identifier]: ''
        }));

        // Validation
        if (identifier === 'startDate' && value && formValues.eventDTO.endDate && new Date(value) > new Date(formValues.eventDTO.endDate)) {
            setErrors(prevErrors => ({
                ...prevErrors,
                startDate: 'Ngày bắt đầu không thể sau ngày kết thúc.'
            }));
        }
        if (identifier === 'endDate' && value && formValues.eventDTO.startDate && new Date(value) < new Date(formValues.eventDTO.startDate)) {
            setErrors(prevErrors => ({
                ...prevErrors,
                endDate: 'Ngày kết thúc không thể trước ngày bắt đầu.'
            }));
        }
    }


    function handleGameTypeChange(gameType, selected) {
        dispatch(updateGameTypeSelection({ gameType, selected }));

        const updatedEventDTO = {
            ...formValues.eventDTO,
            [gameType]: selected
        };

        const isAnySelected = ['isShaking', 'isTrivia'].some(type => updatedEventDTO[type]);

        setErrors(prevErrors => ({
            ...prevErrors,
            gameType: isAnySelected ? '' : 'Bạn phải chọn ít nhất một loại trò chơi.'
        }));
    }




    function validateField(identifier) {
        const value = formValues.eventDTO[identifier];
        let errorMessage = '';

        switch (identifier) {
            case 'name':
                if (!value) {
                    errorMessage = 'Tên sự kiện không được bỏ trống.';
                }
                break;
            case 'startDate':
                if (!value) {
                    errorMessage = 'Ngày bắt đầu không được bỏ trống.';
                } else if (formValues.eventDTO.endDate && new Date(value) > new Date(formValues.eventDTO.endDate)) {
                    errorMessage = 'Ngày bắt đầu không thể sau ngày kết thúc.';
                }
                break;
            case 'endDate':
                if (!value) {
                    errorMessage = 'Ngày kết thúc không được bỏ trống.';
                } else if (formValues.eventDTO.startDate && new Date(value) < new Date(formValues.eventDTO.startDate)) {
                    errorMessage = 'Ngày kết thúc không thể trước ngày bắt đầu.';
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
        console.log(formValues.eventImage);
        const fields = ['name', 'startDate', 'endDate'];
        let formIsValid = true;

        fields.forEach(field => {
            if (!formValues.eventDTO[field]) {
                validateField(field);
                formIsValid = false;
            }
        });

        const isAnySelected = ['isShaking', 'isTrivia'].some(
            type => formValues.eventDTO[type]
        );

        if (!isAnySelected) {
            setErrors(prevErrors => ({
                ...prevErrors,
                gameType: 'Bạn phải chọn ít nhất một loại trò chơi.'
            }));
            formIsValid = false;
        }

        if (formIsValid) {
            dispatch(setStep(2));
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: 'image/*',
        multiple: false,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0]; 
                dispatch(setEventForm({
                    ...formValues,
                    eventImage: file 
                }));
            }
        }
    });


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
                            <FormLabel htmlFor="eventImage">Hình ảnh cho sự kiện</FormLabel>
                            <Box
                                {...getRootProps()}
                                border="2px dashed"
                                borderColor={isDragActive ? 'blue.500' : 'gray.300'}
                                p={4}
                                borderRadius="md"
                                cursor="pointer"
                                textAlign="center"
                            >
                                <input {...getInputProps()} id="eventImage" />
                                {isDragActive ? (
                                    <p>Kéo và thả ảnh vào đây...</p>
                                ) : (
                                    <p>Nhấp hoặc kéo và thả ảnh vào đây để tải lên</p>
                                )}
                            </Box>
                            {formValues.eventImage && (
                                <Box mt={2}>
                                    <Image
                                        src={URL.createObjectURL(formValues.eventImage)}
                                        alt="Preview"
                                        boxSize="full"
                                        objectFit="contain"
                                    />
                                </Box>
                            )}
                        </FormControl>
                    </Box>

                    <VStack spacing={4} align="stretch">
                        <FormControl isInvalid={!!errors.name}>
                            <FormLabel htmlFor="name">
                                Tên sự kiện
                                <Text as="span" color="red.500" ml={1}>*</Text>
                            </FormLabel>
                            <Input
                                id="name"
                                type="text"
                                value={formValues.eventDTO.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                onBlur={() => validateField('name')}
                                placeholder='Tên sự kiện'
                            />
                            <FormErrorMessage>{errors.name}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.gameType}>
                            <FormLabel>
                                Loại trò chơi
                                <Text as="span" color="red.500" ml={1}>*</Text>
                            </FormLabel>
                            <VStack align="left">
                                <Checkbox
                                    isChecked={formValues.eventDTO.isShaking}
                                    onChange={(e) => handleGameTypeChange('isShaking', e.target.checked)}
                                >
                                    Lắc xu
                                </Checkbox>
                                <Checkbox
                                    isChecked={formValues.eventDTO.isTrivia}
                                    onChange={(e) => handleGameTypeChange('isTrivia', e.target.checked)}
                                >
                                    Trivia (câu hỏi trắc nghiệm)
                                </Checkbox>
                            </VStack>

                            <FormErrorMessage>{errors.gameType}</FormErrorMessage>
                        </FormControl>

                        <Flex>
                            <FormControl isInvalid={!!errors.startDate}>
                                <FormLabel htmlFor="startDate">
                                    Ngày bắt đầu
                                    <Text as="span" color="red.500" ml={1}>*</Text>
                                </FormLabel>
                                <DatePicker
                                    id="startDate"
                                    selected={formValues.eventDTO.startDate ? new Date(formValues.eventDTO.startDate) : null}
                                    onChange={(date) => handleInputChange('startDate', date)}
                                    dateFormat="dd/MM/yyyy"
                                    customInput={<CustomInput />}
                                    placeholderText="Chọn ngày bắt đầu"
                                    minDate={new Date()}
                                />
                                <FormErrorMessage>{errors.startDate}</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!errors.endDate}>
                                <FormLabel htmlFor="endDate">
                                    Ngày kết thúc
                                    <Text as="span" color="red.500" ml={1}>*</Text>
                                </FormLabel>
                                <DatePicker
                                    id="endDate"
                                    selected={formValues.eventDTO.endDate ? new Date(formValues.eventDTO.endDate) : null}
                                    onChange={(date) => handleInputChange('endDate', date)}
                                    dateFormat="dd/MM/yyyy"
                                    customInput={<CustomInput />}
                                    placeholderText="Chọn ngày kết thúc"
                                    minDate={new Date()}
                                />
                                <FormErrorMessage>{errors.endDate}</FormErrorMessage>
                            </FormControl>
                        </Flex>

                    </VStack>
                </Grid>
                <HStack mt={4} justify="flex-end">
                    <Button colorScheme="blue" onClick={handleNavigate}>Tiếp theo</Button>
                </HStack>
            </form>
        </Box>
    );
}

export default EventForm;
