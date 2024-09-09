import { useState } from 'react';
import { Box, Button, Input, Text, VStack } from '@chakra-ui/react';

function EditableForm() {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        phoneNumber: '0291421631',
        email: 'dookki@koreanfood.com',
        address: 'NowZone Quận 1, Thành phố Hồ Chí Minh',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const toggleEditing = () => {
        setIsEditing(!isEditing);
    };

    return (
        <Box p={4}>
            <VStack spacing={4} align="start">
                <Box>
                    <Text fontWeight="bold">Số điện thoại:</Text>
                    {isEditing ? (
                        <Input
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <Text>{formData.phoneNumber}</Text>
                    )}
                </Box>

                <Box>
                    <Text fontWeight="bold">Email:</Text>
                    {isEditing ? (
                        <Input
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <Text>{formData.email}</Text>
                    )}
                </Box>

                <Box>
                    <Text fontWeight="bold">Địa chỉ:</Text>
                    {isEditing ? (
                        <Input
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <Text>{formData.address}</Text>
                    )}
                </Box>

                <Button onClick={toggleEditing} colorScheme="blue" width="100%">
                    {isEditing ? 'Lưu' : 'Chỉnh sửa'}
                </Button>
            </VStack>
        </Box>
    );
}

export default EditableForm;
