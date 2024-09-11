import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Event from '../Home/components/Event';
import * as yup from 'yup';
import { useFormik } from 'formik';
import ProtectedRoute from '../../components/ProtectedRoute';
import { Flex, Image, Text, Box } from '@chakra-ui/react';

const updateProfileSchema = yup.object({
    username: yup
        .string()
        .required('Vui lòng điền tên đăng nhập'),
    email: yup
        .string()
        .email('Email không hợp lệ')
        .required('Vui lòng điền email'),
    oldPassword: yup
        .string()
        .required('Vui lòng điền mật khẩu hiện tại'),
    newPassword: yup
        .string()
        .required('Vui lòng điền mật khẩu mới'),
    repeatPassword: yup
        .string()
        .required("Vui lòng xác nhận mật khẩu mới")
        .oneOf([yup.ref("newPassword")], "Mật khẩu mới không trùng với trường thông tin này"),
});

const Profile = () => {
    const user = { id: 1, username: "huong", email: "huong@gmail.com", password: "230403" }
    const token = useSelector((state) => state.auth.accessToken);
    const [favoriteEvents, setFavoriteEvents] = useState([]);
    // const dispatch = useDispatch();

    const [vouchers, setVouchers] = useState([
        {
            id: 1,
            image: "/vc1.jpg",
            quantity: 2,
            description: "Voucher giảm giá 10% cho tổng hóa đơn",
            value: "10%",
            expiryDate: "31-12-2024"
        },
        {
            id: 2,
            image: "/vc6.jpg",
            quantity: 1,
            description: "Voucher giảm giá 20% cho đơn hàng từ 500k",
            value: "20%",
            expiryDate: "30-11-2024"
        }
    ]);

    const [updateButtonDisabled, setUpdateButtonDisabled] = useState(true);

    const updateProfileFormik = useFormik({
        initialValues: {
            id: user?._id,
            username: user?.username,
            email: user?.email,
            oldPassword: '',
            newPassword: '',
            repeatPassword: ''
        },
        validationSchema: updateProfileSchema,
        onSubmit: (values) => {
            // dispatch(updateUser(values));

            console.log("updated");
            setUpdateButtonDisabled(true);
        },
    });

    useEffect(() => {
        async function fetchFavoriteEvents(token) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/watchlist`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setFavoriteEvents(data.data);
                } else {
                    console.error("Error fetching favorite list:", response.status, response.statusText);
                }
            } catch (error) {
                console.error("Error fetching game ID:", error);
            }
        }

        fetchFavoriteEvents(token);
    }, [])

    return (
        <ProtectedRoute>
            <div className='grid grid-cols-12 gap-x-10 m-12'>
                <div className='col-span-4'>
                    <h3 className="font-bold text-xl">Tài khoản</h3>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <img className="rounded-full h-2/5 w-2/5 my-6" alt="user-avatar" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZOAYbH3sK6GdjANHyPPxOEQ051JoPqIg10nehLc8Px8vhn3VrWGGE5TjrcaAKu5tSUZs&usqp=CAU" />

                        <label className="form-control w-full mt-3">
                            <div className="label">
                                <span className="label-text font-bold">Tên đăng nhập</span>
                            </div>
                            <input
                                name="username"
                                type="text"
                                placeholder="Tên đăng nhập"
                                className="input input-bordered w-full"
                                value={updateProfileFormik.values.username}
                                onChange={(e) => {
                                    setUpdateButtonDisabled(false);
                                    updateProfileFormik.handleChange(e);
                                }}
                            />
                            {updateProfileFormik.touched.username && updateProfileFormik.errors.username && (
                                <div className="form-error-msg">{updateProfileFormik.errors.username}</div>
                            )}
                        </label>

                        <label className="form-control w-full mt-3">
                            <div className="label">
                                <span className="label-text font-bold">Địa chỉ email</span>
                            </div>
                            <input
                                name="email"
                                type="text"
                                placeholder="Địa chỉ email"
                                className="input input-bordered w-full"
                                value={updateProfileFormik.values.email}
                                onChange={(e) => {
                                    setUpdateButtonDisabled(false);
                                    updateProfileFormik.handleChange(e);
                                }}
                            />
                            {updateProfileFormik.touched.email && updateProfileFormik.errors.email && (
                                <div className="form-error-msg">{updateProfileFormik.errors.email}</div>
                            )}
                        </label>

                        <label className="form-control w-full mt-3">
                            <div className="label">
                                <span className="label-text font-bold">Mật khẩu hiện tại</span>
                            </div>
                            <input
                                name="oldPassword"
                                type="password"
                                placeholder="Mật khẩu hiện tại"
                                className="input input-bordered w-full"
                                value={updateProfileFormik.values.oldPassword}
                                onChange={(e) => {
                                    setUpdateButtonDisabled(false);
                                    updateProfileFormik.handleChange(e);
                                }}
                            />
                            {updateProfileFormik.touched.oldPassword && updateProfileFormik.errors.oldPassword && (
                                <div className="form-error-msg">{updateProfileFormik.errors.oldPassword}</div>
                            )}
                        </label>

                        <label className="form-control w-full mt-3">
                            <div className="label">
                                <span className="label-text font-bold">Mật khẩu mới</span>
                            </div>
                            <input
                                name="newPassword"
                                type="password"
                                placeholder="Mật khẩu mới"
                                className="input input-bordered w-full"
                                value={updateProfileFormik.values.newPassword}
                                onChange={(e) => {
                                    setUpdateButtonDisabled(false);
                                    updateProfileFormik.handleChange(e);
                                }}
                            />
                            {updateProfileFormik.touched.newPassword && updateProfileFormik.errors.newPassword && (
                                <div className="form-error-msg">{updateProfileFormik.errors.newPassword}</div>
                            )}
                        </label>

                        <label className="form-control w-full mt-3">
                            <div className="label">
                                <span className="label-text font-bold">Nhập lại mật khẩu mới</span>
                            </div>
                            <input
                                name="repeatPassword"
                                type="password"
                                placeholder="Nhập lại mật khẩu mới"
                                className="input input-bordered w-full"
                                value={updateProfileFormik.values.repeatPassword}
                                onChange={(e) => {
                                    setUpdateButtonDisabled(false);
                                    updateProfileFormik.handleChange(e);
                                }}
                            />
                            {updateProfileFormik.touched.repeatPassword && updateProfileFormik.errors.repeatPassword && (
                                <div className="form-error-msg">{updateProfileFormik.errors.repeatPassword}</div>
                            )}
                        </label>

                        <button
                            className="btn btn-primary mt-6"
                            type='submit'
                            disabled={updateButtonDisabled}
                            onClick={updateProfileFormik.handleSubmit}>
                            Cập nhật
                        </button>
                    </form>
                </div>

                <div className='col-span-4'>
                    <h3 className="font-bold text-xl">Voucher của tôi</h3>
                    <ul className='flex flex-wrap justify-center'>
                        {vouchers.map((voucher) => {
                            return (
                                <li key={voucher.id} className='m-4 p-4 border rounded-lg hover:shadow-lg'>
                                    <Flex direction="column" align="left">
                                        <Image
                                            src={voucher.image}
                                            alt='Voucher Image'
                                            objectFit="cover"
                                            mb={4}
                                            background="transparent"
                                        />
                                        <Box textAlign="left" mb={4}>
                                            <Text fontSize="lg" textAlign="center" fontWeight="semibold">{voucher.description}</Text>
                                            <Text fontSize="md">Giá trị: <b>giảm giá {voucher.value} cho tổng hóa đơn</b></Text>
                                            <Text fontSize="md">Hạn sử dụng: <b>{voucher.expiryDate}</b></Text>
                                            <Text fontSize="md">Sở hữu: <b>{voucher.quantity} cái</b></Text>
                                        </Box>
                                    </Flex>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className='col-span-4'>
                    <h3 className="font-bold text-xl">Sự kiện yêu thích</h3>
                    <ul className='flex flex-wrap justify-center space-x-4 md:space-x-6 lg:space-x-8 mb-10'>
                        {favoriteEvents.map((event) => {
                            return (
                                <li key={event.event.Id} className='m-4 hover:shadow-lg'>
                                    <Event
                                        id={event.event.Id}
                                        image={event.event.ImageURL}
                                        name={event.event.Name}
                                        startDate={formatDate(event.event.StartDate)}
                                        endDate={formatDate(event.event.EndDate)}
                                        brand={event.event.brand.username}
                                        voucher={event.voucher.voucherQuantities}
                                        gameType={getGameType(event.event)}
                                        isHome={false}
                                    />
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default Profile;

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

function getGameType(event) {
    let gameType = "";

    if (event.shaking) {
        gameType += "Lắc xu";
    }

    if (event.trivia) {
        if (gameType !== "") {
            gameType += ", ";
        }
        gameType += "Trivia (câu hỏi trắc nghiệm)";
    }

    return gameType;
}