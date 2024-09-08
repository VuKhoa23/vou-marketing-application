"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { useFormik } from "formik";
import { setAuthUser } from "@/lib/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const loginSchema = yup.object({
    username: yup.string().required("Vui lòng điền tên đăng nhập"),
    password: yup.string().required("Vui lòng điền mật khẩu"),
});

const Login = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const loginFormik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: loginSchema,
        onSubmit: (values) => handleSubmit(values),
    });

    const handleSubmit = async (values: { username: string; password: string }) => {
        try {
            const response = await fetch("http://localhost/api/admin/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                const data = await response.json();
                dispatch(setAuthUser(data));
                toast.success("Đăng nhập thành công.");
                router.push("/");
            } else {
                toast.error("Thông tin đăng nhập không hợp lệ.");
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
                <h1 className="text-3xl font-bold self-center">Chào mừng admin VOU</h1>

                <span className="self-center">
                    <a href="/signup" className="link link-primary ml-1">
                        Đăng ký tài khoản quản trị
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
