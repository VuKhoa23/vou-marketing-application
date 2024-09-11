import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, } from 'react-redux';
import * as yup from 'yup';
import { useFormik } from 'formik';
import toast, { Toaster } from 'react-hot-toast';

const signupSchema = yup.object({
    username: yup.string().required("Vui lòng điền tên thương hiệu"),
    category: yup.string().required("Vui lòng điền tên lĩnh vực"),
    address: yup.string().required("Vui lòng điền địa chỉ"),
    lon: yup
        .string()
        .required("Vui lòng điền kinh độ")
        .matches(/^[0-9.]*$/, "Kinh độ không hợp lệ"),
    lat: yup
        .string()
        .required("Vui lòng điền vĩ độ")
        .matches(/^[0-9.]*$/, "Vĩ độ không hợp lệ"),
    password: yup
        .string()
        .required('Vui lòng điền mật khẩu'),
    repeatPassword: yup
        .string()
        .required('Vui lòng điền lại mật khẩu')
        .oneOf([yup.ref("password")], "Mật khẩu nhập lại và mật khẩu không trùng nhau"),
});

const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const signupFormik = useFormik({
        initialValues: {
            username: '',
            password: '',
            repeatPassword: '',
            category: '',
            address: '',
            lon: '',
            lat: ''
        },
        validationSchema: signupSchema,
        onSubmit: (values) => handleSubmit(values),
    });

    const handleSubmit = async (values) => {
        try {
            const response = await fetch('http://localhost/api/brand/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),

            });

            if (response.ok) {
                toast.success('Đăng ký tài khoản thành công.');
                navigate('/login');
            } else {
                toast.error('Tên người dùng đã tồn tại.');
            }
        } catch (error) {
            toast.error('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
        }
    };

    return (
        <div className='flex justify-center min-h-screen'>
            <div><Toaster position="top-right" /></div>
            <div className="flex flex-col gap-4 rounded-box bg-base-200 p-6 my-auto w-1/4">
                <h1 className="text-3xl font-bold self-center">Đăng ký tài khoản VOU</h1>

                <span className="self-center">
                    <a href="/login" className="link link-primary ml-1">Đăng nhập vào tài khoản thương hiệu</a>
                </span>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                >
                    <label className="form-control w-full mt-3">
                        <div className="label">
                            <span className="label-text">Tên thương hiệu</span>
                        </div>
                        <input
                            name="username"
                            type="text"
                            placeholder="Tên đăng nhập"
                            className="input input-bordered w-full"
                            value={signupFormik.values.username}
                            onChange={signupFormik.handleChange}
                        />
                        {signupFormik.touched.username && signupFormik.errors.username && (
                            <div className="form-error-msg">{signupFormik.errors.username}</div>
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
                            value={signupFormik.values.password}
                            onChange={signupFormik.handleChange}
                        />
                        {signupFormik.touched.password && signupFormik.errors.password && (
                            <div className="form-error-msg">{signupFormik.errors.password}</div>
                        )}
                    </label>

                    <label className="form-control w-full mt-3">
                        <div className="label">
                            <span className="label-text">Nhập lại mật khẩu</span>
                        </div>
                        <input
                            name="repeatPassword"
                            type="password"
                            placeholder="Nhập lại mật khẩu"
                            className="input input-bordered w-full"
                            value={signupFormik.values.repeatPassword}
                            onChange={signupFormik.handleChange}
                        />
                        {signupFormik.touched.repeatPassword && signupFormik.errors.repeatPassword && (
                            <div className="form-error-msg">{signupFormik.errors.repeatPassword}</div>
                        )}
                    </label>

                    <label className="form-control w-full mt-3">
                        <div className="label">
                            <span className="label-text font-bold">Tên lĩnh vực</span>
                        </div>
                        <input
                            name="category"
                            type="text"
                            placeholder="Tên lĩnh vực"
                            className="input input-bordered w-full"
                            value={signupFormik.values.category}
                            onChange={signupFormik.handleChange}
                        />
                        {signupFormik.touched.category && signupFormik.errors.category && (
                            <div className="form-error-msg">
                                {signupFormik.errors.category}
                            </div>
                        )}
                    </label>

                    <label className="form-control w-full mt-3">
                        <div className="label">
                            <span className="label-text font-bold">Địa chỉ</span>
                        </div>
                        <input
                            name="address"
                            type="text"
                            placeholder="Địa chỉ"
                            className="input input-bordered w-full"
                            value={signupFormik.values.address}
                            onChange={signupFormik.handleChange}
                            onBlur={randCoords}
                        />
                        {signupFormik.touched.address && signupFormik.errors.address && (
                            <div className="form-error-msg">
                                {signupFormik.errors.address}
                            </div>
                        )}
                    </label>

                    <label className="form-control w-full mt-3">
                        <div className="label">
                            <span className="label-text font-bold">Kinh độ</span>
                        </div>
                        <input
                            name="lon"
                            type="text"
                            placeholder="Kinh độ"
                            className="input input-bordered w-full"
                            value={signupFormik.values.lon}
                            onChange={signupFormik.handleChange}
                        />
                        {signupFormik.touched.lon && signupFormik.errors.lon && (
                            <div className="form-error-msg">{signupFormik.errors.lon}</div>
                        )}
                    </label>

                    <label className="form-control w-full mt-3">
                        <div className="label">
                            <span className="label-text font-bold">Vĩ độ</span>
                        </div>
                        <input
                            name="lat"
                            type="text"
                            placeholder="Vĩ độ"
                            className="input input-bordered w-full"
                            value={signupFormik.values.lat}
                            onChange={signupFormik.handleChange}
                        />
                        {signupFormik.touched.lat && signupFormik.errors.lat && (
                            <div className="form-error-msg">{signupFormik.errors.lat}</div>
                        )}
                    </label>

                    <button
                        className="btn btn-primary mt-6"
                        type="submit"
                        onClick={(e) => {
                            e.preventDefault();
                            signupFormik.handleSubmit();
                        }}
                    >
                        Đăng ký
                    </button>
                </form>
            </div>
        </div>
    );

    function randCoords() {
        // long limits
        const lonMin = 102.15;
        const lonMax = 109.4;

        // lat limits
        const latMin = 8.57;
        const latMax = 23.38;

        const longitude = Math.random() * (lonMax - lonMin) + lonMin;
        const latitude = Math.random() * (latMax - latMin) + latMin;

        signupFormik.setFieldValue("lon", longitude.toFixed(6));
        signupFormik.setFieldValue("lat", latitude.toFixed(6));
    }
};

export default Signup;
