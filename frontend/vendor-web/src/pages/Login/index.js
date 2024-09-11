import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { setAuthUser } from '../../store/slices/authSlice';
import { setBrandInfo } from '../../store/slices/brandSlice';
import toast, { Toaster } from 'react-hot-toast';

const loginSchema = yup.object({
    username: yup
        .string()
        .required('Vui lòng điền tên đăng nhập'),
    password: yup
        .string()
        .required('Vui lòng điền mật khẩu'),
});

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const dest = useSelector((state) => state.auth.destination);

    const loginFormik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema: loginSchema,
        onSubmit: (values) => handleSubmit(values),
    });

    const handleSubmit = async (values) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/brand/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),

            });

            if (response.ok) {
                const userData = await response.json();
                const token = userData.accessToken.replace('Bearer ', '');
                dispatch(setAuthUser(token));
                toast.success('Đăng nhập thành công.');

                fetchBrandInfo(token);

                navigate(dest);
            } else {
                toast.error('Thông tin đăng nhập không hợp lệ.');
            }
        } catch (error) {
            toast.error('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
        }
    };

    const fetchBrandInfo = async (token) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/brand/info`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const brandData = await response.json();
                dispatch(setBrandInfo({
                    id: brandData.id,
                    username: brandData.username,
                    category: brandData.category,
                    address: brandData.address,
                }));
            } else {
                toast.error('Không thể lấy thông tin thương hiệu.');
            }
        } catch (error) {
            toast.error('Đã có lỗi xảy ra khi lấy thông tin thương hiệu.');
        }
    };

    return (
        <div className='flex justify-center min-h-screen'>
            <div><Toaster position="top-right" /></div>
            <div className="flex flex-col gap-4 rounded-box bg-base-200 p-6 my-auto w-1/4">
                <h1 className="text-3xl font-bold self-center">Đăng nhập vào VOU</h1>

                <span className="self-center">
                    <a href="/signup" className="link link-primary ml-1">Đăng ký tài khoản doanh nghiệp</a>
                </span>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                >
                    <label className="form-control w-full mt-3">
                        <div className="label">
                            <span className="label-text">Tên đăng nhập</span>
                        </div>
                        <input
                            name="username"
                            type="text"
                            placeholder="Tên đăng nhập"
                            className="input input-bordered w-full"
                            value={loginFormik.values.username}
                            onChange={loginFormik.handleChange}
                        />
                        {loginFormik.touched.username && loginFormik.errors.username && (
                            <div className="form-error-msg">{loginFormik.errors.username}</div>
                        )}
                    </label>

                    <label className="form-control w-full mt-3">
                        <div className="label">
                            <span className="label-text">Mật khẩu</span>
                        </div>
                        <input
                            name="password"
                            type="password"
                            placeholder="Mật khẩu"
                            className="input input-bordered w-full"
                            value={loginFormik.values.password}
                            onChange={loginFormik.handleChange}
                        />
                        {loginFormik.touched.password && loginFormik.errors.password && (
                            <div className="form-error-msg">{loginFormik.errors.password}</div>
                        )}
                    </label>

                    <button
                        className="btn btn-primary mt-6"
                        type="submit"
                        onClick={(e) => {
                            e.preventDefault();
                            loginFormik.handleSubmit();
                        }}
                    >
                        Đăng nhập
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
