"use client";

import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const signupSchema = yup.object({
    username: yup.string().required("Vui lòng điền tên đăng nhập"),
    password: yup.string().required("Vui lòng điền mật khẩu"),
    repeatPassword: yup
        .string()
        .required("Vui lòng điền lại mật khẩu")
        .oneOf([yup.ref("password")], "Mật khẩu nhập lại và mật khẩu không trùng nhau"),
    phone: yup
        .string()
        .matches(/^0[0-9]{9}$/, "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0")
        .required("Vui lòng điền số điện thoại"),
});

const Signup = () => {
    const router = useRouter();

    const signupFormik = useFormik({
        initialValues: {
            username: "",
            password: "",
            repeatPassword: "",
            phone: "",
            gender: "male",
        },
        validationSchema: signupSchema,
        onSubmit: (values) => handleSubmit(values),
    });

    const handleSubmit = async (values: {
        username: string;
        password: string;
        repeatPassword: string;
        phone: string;
        gender: string;
    }) => {
        try {
            const response = await fetch("http://localhost/api/admin/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                toast.success("Đăng ký tài khoản thành công.");
                router.push("/login");
            } else {
                toast.error("Tên người dùng đã tồn tại.");
            }
        } catch (error) {
            toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
        }
    };

    return (
        <div className="flex justify-center min-h-screen">
            <div>
                <Toaster position="top-right" />
            </div>
            <div className="flex flex-col gap-4 rounded-box bg-base-200 p-6 my-auto w-1/4">
                <h1 className="text-3xl font-bold self-center">Tạo tài khoản quản trị</h1>

                <span className="self-center">
                    <a href="/login" className="link link-primary ml-1">
                        Đăng nhập vào hệ thống quản trị
                    </a>
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
                        {signupFormik.touched.repeatPassword &&
                            signupFormik.errors.repeatPassword && (
                                <div className="form-error-msg">
                                    {signupFormik.errors.repeatPassword}
                                </div>
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
                        <div className="flex justify-between">
                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text mr-6">Nam</span>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        className="radio radio-primary"
                                        onChange={signupFormik.handleChange}
                                        checked={signupFormik.values.gender === "male"}
                                    />
                                </label>
                            </div>
                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text mr-6">Nữ</span>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        className="radio radio-primary"
                                        onChange={signupFormik.handleChange}
                                        checked={signupFormik.values.gender === "female"}
                                    />
                                </label>
                            </div>
                        </div>
                    </label>

                    <button
                        className="btn btn-primary mt-6"
                        type="submit"
                        onClick={(e) => {
                            e.preventDefault();
                            signupFormik.handleSubmit();
                        }}
                    >
                        Đăng kí
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
