import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { useFormik } from 'formik';

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
    // const dispatch = useDispatch();

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

    return (
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

            <div className='col-span-6'>
                <h3 className="font-bold text-xl">Voucher của tôi</h3>
            </div>
        </div>
    );
};

export default Profile;
