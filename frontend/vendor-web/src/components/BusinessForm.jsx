import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setStep } from "../store/slices/stepSlice";
import {
    Box,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Button,
    Grid,
    VStack,
    HStack,
    FormErrorMessage,
    Image,
    Text,
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";

function BusinessForm() {
    const dispatch = useDispatch();

    const [formValues, setFormValues] = useState({
        image: null,
        brandName: "",
        address: "",
        phone: "",
        email: "",
        info: "",
    });

    const [errors, setErrors] = useState({
        brandName: "",
        address: "",
        phone: "",
        email: "",
    });

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: "image/*",
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (file) {
                setFormValues((prevValues) => ({
                    ...prevValues,
                    image: URL.createObjectURL(file),
                }));
            }
        },
    });

    function handleInputChange(identifier, value) {
        setFormValues((prevValues) => ({
            ...prevValues,
            [identifier]: value,
        }));

        // Clear the error for this field when user starts typing
        setErrors((prevErrors) => ({
            ...prevErrors,
            [identifier]: "",
        }));
    }

    function handleInputBlur(identifier) {
        validateField(identifier);
    }

    function validateField(identifier) {
        const value = formValues[identifier];
        let errorMessage = "";

        switch (identifier) {
            case "brandName":
                if (!value) {
                    errorMessage = "Tên doanh nghiệp không được bỏ trống.";
                }
                break;
            case "address":
                if (!value) {
                    errorMessage = "Địa chỉ không được bỏ trống.";
                }
                break;
            case "phone":
                const phonePattern = /^[0-9]{10,11}$/;
                if (!value) {
                    errorMessage = "Số điện thoại không được bỏ trống.";
                } else if (!phonePattern.test(value)) {
                    errorMessage = "Số điện thoại phải là 10-11 chữ số.";
                }
                break;
            case "email":
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    errorMessage = "Email không được bỏ trống.";
                } else if (!emailPattern.test(value)) {
                    errorMessage =
                        'Email không hợp lệ. Phải có ký tự "@" và ".", và có chữ giữa "@" và ".".';
                }
                break;
            default:
                break;
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [identifier]: errorMessage,
        }));
    }

    function handleNavigate(event) {
        event.preventDefault();
        const fields = ["brandName", "address", "phone", "email"];
        let formIsValid = true;

        fields.forEach((field) => {
            if (!formValues[field]) {
                validateField(field);
                formIsValid = false;
            }
        });

        if (formIsValid) {
            dispatch(setStep(2));
        }
    }

    return (
        <Box className="p-4 max-w-4xl mx-auto" bg="gray.50" borderRadius="md" boxShadow="md">
            <form>
                <Grid templateColumns={{ base: "1fr", md: "1fr 2fr" }} gap={6}>
                    <Box>
                        <FormControl>
                            <FormLabel htmlFor="image">Hình ảnh doanh nghiệp</FormLabel>
                            <Box
                                {...getRootProps()}
                                border="2px dashed"
                                borderColor={isDragActive ? "blue.500" : "gray.300"}
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
                            {formValues.image && (
                                <Box mt={2}>
                                    <Image
                                        src={formValues.image}
                                        alt="Preview"
                                        boxSize="full"
                                        objectFit="contain"
                                    />
                                </Box>
                            )}
                        </FormControl>
                    </Box>

                    <VStack spacing={4} align="stretch">
                        <FormControl isInvalid={!!errors.brandName}>
                            <FormLabel htmlFor="brandName">
                                Tên doanh nghiệp
                                <Text as="span" color="red.500" ml={1}>
                                    *
                                </Text>
                            </FormLabel>
                            <Input
                                id="brandName"
                                type="text"
                                value={formValues.brandName}
                                onChange={(e) => handleInputChange("brandName", e.target.value)}
                                onBlur={() => handleInputBlur("brandName")}
                                placeholder="We Marketing"
                            />
                            <FormErrorMessage>{errors.brandName}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.address}>
                            <FormLabel htmlFor="address">
                                Địa chỉ
                                <Text as="span" color="red.500" ml={1}>
                                    *
                                </Text>
                            </FormLabel>
                            <Input
                                id="address"
                                type="text"
                                value={formValues.address}
                                onChange={(e) => handleInputChange("address", e.target.value)}
                                onBlur={() => handleInputBlur("address")}
                                placeholder="123/4 Đường 567, Phường 8, Quận 9, Thành phố Hồ Chí Minh"
                            />
                            <FormErrorMessage>{errors.address}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.phone}>
                            <FormLabel htmlFor="phone">
                                Số điện thoại
                                <Text as="span" color="red.500" ml={1}>
                                    *
                                </Text>
                            </FormLabel>
                            <Input
                                id="phone"
                                type="tel"
                                value={formValues.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                onBlur={() => handleInputBlur("phone")}
                                placeholder="0999999999"
                            />
                            <FormErrorMessage>{errors.phone}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.email}>
                            <FormLabel htmlFor="email">
                                Email
                                <Text as="span" color="red.500" ml={1}>
                                    *
                                </Text>
                            </FormLabel>
                            <Input
                                id="email"
                                type="email"
                                value={formValues.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                onBlur={() => handleInputBlur("email")}
                                placeholder="httkcompany@email.com"
                            />
                            <FormErrorMessage>{errors.email}</FormErrorMessage>
                        </FormControl>

                        <FormControl>
                            <FormLabel htmlFor="info">Mô tả ngắn về doanh nghiệp</FormLabel>
                            <Textarea
                                id="info"
                                value={formValues.info}
                                onChange={(e) => handleInputChange("info", e.target.value)}
                            />
                        </FormControl>

                        <HStack w="full" spacing={4} mt={4} justify="space-between">
                            <Button
                                variant="outline"
                                bg="white"
                                onClick={() => alert("Quay lại để chỉnh sửa thông tin")}
                            >
                                Quay Lại
                            </Button>

                            <Button colorScheme="teal" onClick={handleNavigate}>
                                Tiếp theo
                            </Button>
                        </HStack>
                    </VStack>
                </Grid>
            </form>
        </Box>
    );
}

export default BusinessForm;
