import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useFormik } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import * as AWS from "aws-sdk";

// S3 bucket name
const bucketName = "first-time-using-s3-bucket";

const signupSchema = yup.object({
    username: yup
        .string()
        .required('Vui lòng điền tên đăng nhập'),
    password: yup
        .string()
        .required('Vui lòng điền mật khẩu'),
    repeatPassword: yup
        .string()
        .required('Vui lòng điền lại mật khẩu')
        .oneOf([yup.ref("password")], "Mật khẩu nhập lại và mật khẩu không trùng nhau"),
    phone: yup
        .string()
        .matches(/^0[0-9]{9}$/, 'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0')
        .required('Vui lòng điền số điện thoại')
});

const Signup = () => {
    const navigate = useNavigate();

    const [avatarToAdd, setAvatarToAdd] = useState();

    const signupFormik = useFormik({
        initialValues: {
            username: '',
            password: '',
            repeatPassword: '',
            phone: '',
            gender: 'male'
        },
        validationSchema: signupSchema,
        onSubmit: (values) => handleSubmit(values),
    });

    const handleSubmit = async (values) => {
        try {
            let imgUrl = "";

            if (avatarToAdd !== undefined) {
                imgUrl = await uploadToS3(avatarToAdd, bucketName);
            }

            const newUser = {
                username: values.username,
                password: values.password,
                phone: values.phone,
                gender: values.gender,
                image_url: imgUrl,
            };

            const response = await fetch('http://localhost/api/user/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),

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
                    Bạn đã có tài khoản?
                    <a href="/login" className="link link-primary ml-1">Đăng nhập</a>
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
                            <span className="label-text">Số điện thoại</span>
                        </div>
                        <input
                            name="phone"
                            type="text"
                            placeholder="Số điện thoại"
                            className="input input-bordered w-full"
                            value={signupFormik.values.phone}
                            onChange={signupFormik.handleChange}
                        />
                        {signupFormik.touched.phone && signupFormik.errors.phone && (
                            <div className="form-error-msg">{signupFormik.errors.phone}</div>
                        )}
                    </label>

                    <label className="form-control w-full mt-3">
                        <div className="label">
                            <span className="label-text">Giới tính</span>
                        </div>
                        <div className='flex justify-between'>
                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text mr-6">Nam</span>
                                    <input type="radio" name="gender" value="male" className="radio radio-primary" onChange={signupFormik.handleChange} checked={signupFormik.values.gender === 'male'} />
                                </label>
                            </div>
                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text mr-6">Nữ</span>
                                    <input type="radio" name="gender" value="female" className="radio radio-primary" onChange={signupFormik.handleChange} checked={signupFormik.values.gender === 'female'} />
                                </label>
                            </div>
                        </div>
                    </label>

                    <label className="form-control w-full mt-3">
                        <div className="label">
                            <span className="label-text font-bold">Ảnh đại diện</span>
                        </div>
                        <input
                            type="file"
                            accept=".jpg, .jpeg, .png"
                            multiple={false}
                            className="file-input file-input-bordered w-full"
                            onChange={handleImgInputChange}
                        />
                        <div className="label"></div>
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

    function handleImgInputChange(e) {
        const file = e.target.files[0];

        if (file) {
            setAvatarToAdd(file);
        }
    }

    async function uploadToS3(file, bucketName) {
        AWS.config.update({
            accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
            secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
            region: "ap-southeast-2",
        });
        const s3 = new AWS.S3({
            apiVersion: "2012-10-17",
            params: { Bucket: bucketName },
        });

        const params = {
            Bucket: bucketName,
            Key: `${file.name}`,
            Body: file,
            ContentType: file.type,
        };

        try {
            const data = await s3.upload(params).promise();
            return data.Location;
        } catch (error) {
            console.error("Error uploading to S3: ", error);
            throw error;
        }
    }
};

export default Signup;
