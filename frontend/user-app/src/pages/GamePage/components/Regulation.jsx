import '../style/index.css';
import { Box, Text, VStack } from '@chakra-ui/react';
import { FaInfoCircle, FaUsers, FaCalendarDay, FaBullhorn, FaGift, FaRegFileAlt } from 'react-icons/fa';
import InfoItem from './InfoItem';
function Regulations() {
    return (
        <Box>
            <h1
                className="bru-font border-4 border-black bru-shadow text-3xl text-center p-2 m-5 font-bold bg-blue-300" >
                THÔNG TIN VỀ CHƯƠNG TRÌNH
            </h1>
            <VStack spacing={4} align="start" className='px-5'>
                <InfoItem
                    icon={FaInfoCircle}
                    iconColor="blue"
                    title="Nội dung chương trình"
                    info="Chi tiết về nội dung của chương trình sẽ được cung cấp tại đây. Chi tiết về nội dung của chương trình sẽ được cung cấp tại đây."
                />
                <InfoItem
                    icon={FaUsers}
                    iconColor="green"
                    title="Đối tượng tham gia"
                    info="Tất cả người dùng VOU từ đủ 18 tuổi trở lên, mang quốc tịch Việt Nam, đang sống và làm việc trên lãnh thổ Việt Nam."
                />

                <InfoItem
                    icon={FaCalendarDay}
                    iconColor="red"
                    title="Thời gian diễn ra"
                    info="Chương trình sẽ bắt đầu từ ngày 01/10/2024 và kết thúc vào ngày 31/10/2024. Nhanh chóng tham gia trong thời gian diễn ra sự kiện."
                />
                <InfoItem
                    icon={FaBullhorn}
                    iconColor="yellow"
                    title="Cách thức tham gia"
                    info="Người dùng cần thực hiện các bước sau đây để tham gia chương trình: Đăng ký, hoàn thành các yêu cầu, và theo dõi thông báo."
                />
                <InfoItem
                    icon={FaGift}
                    iconColor="purple"
                    title="Thông tin ưu đãi"
                    info="Hoàn thành nhiệm vụ để nhận được phần thưởng xu. Sử dụng xu để có thể quy đổi được thành nhiều voucher ưu đãi hấp dẫn khác."
                />
                <InfoItem
                    icon={FaRegFileAlt}
                    iconColor="teal"
                    title="Điều khoản khác"
                    info="Voucher không có giá trị quy đổi thành tiền mặt hay chuyển nhượng dưới mọi hình thức. Mọi vấn đề phát sinh liên quan đến Voucher, quyền quyết định cuối cùng thuộc về VOU"
                />

            </VStack>
        </Box>
    );
}


export default Regulations;