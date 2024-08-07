"use client";

import React, { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { useFormik } from "formik";
import * as yup from "yup";
import Table from "@/components/Table";
import { User } from "@/types/User";
import userData from "@/mock_data/users.json";
import Modal from "@/components/Modal";

// define edit form validation schema
export const editSchema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().required("Vui lòng điền địa chỉ email").email("Địa chỉ email không hợp lệ"),
    username: yup.string().required("Username is required"),
    phone: yup
        .string()
        .required("Vui lòng điền số điện thoại")
        .matches(/^0[0-9]{9}$/, "Số điện thoại phải bao gồm 10 chữ số và bắt đầu bằng 0"),
});

// define edit form
const editForm = () => {
    const formik = useFormik({
        initialValues: {
            avatar: "",
            name: "",
            username: "",
            email: "",
            phone: "",
            gender: "",
            role: "",
        },
        validationSchema: editSchema,
        onSubmit: async (values) => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        },
    });

    // Deconstruct Formik object
    const { errors, touched, values, handleChange, handleSubmit } = formik;

    return (
        <form onSubmit={handleSubmit}>
            {/* Input for Email */}
            <div>
                <label>Email</label>
                <input
                    name="email"
                    type="text"
                    placeholder="Email"
                    value={values.email}
                    onChange={handleChange}
                />
                {touched.email && errors.email && <div>{errors.email}</div>}
            </div>

            {/* Input for Name */}
            <div>
                <label>Name</label>
                <input
                    name="name"
                    type="text"
                    placeholder="Name"
                    value={values.name}
                    onChange={handleChange}
                />
                {touched.name && errors.name && <div>{errors.name}</div>}
            </div>

            {/* Submit Button */}
            <button type="submit">Submit</button>
        </form>
    );
};

export default function Users() {
    const [editOpen, setEditOpen] = useState(false);
    const handleToggleEdit = () => setEditOpen((prev) => !prev);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const handleToggleDelete = () => setDeleteOpen((prev) => !prev);

    // define columns for user table
    const columnHelper = createColumnHelper<User>();

    const userColumns = [
        columnHelper.accessor((row) => row.id, {
            id: "id",
            cell: (info) => info.getValue(),
            header: () => <span>ID</span>,
        }),
        columnHelper.accessor((row) => row.avatar, {
            id: "avatar",
            cell: (info) => (
                <div className="mask mask-squircle h-12 w-12">
                    <img src={info.getValue()} alt="user_avatar" />
                </div>
            ),
            header: () => <span>Ảnh đại diện</span>,
        }),
        columnHelper.accessor((row) => row.name, {
            id: "name",
            cell: (info) => <span>{info.getValue()}</span>,
            header: () => <span>Họ tên</span>,
        }),
        columnHelper.accessor((row) => row.username, {
            id: "username",
            cell: (info) => <span>{info.getValue()}</span>,
            header: () => <span>Tên người dùng</span>,
        }),
        columnHelper.accessor((row) => row.email, {
            id: "email",
            cell: (info) => <span>{info.getValue()}</span>,
            header: () => <span>Email</span>,
        }),
        columnHelper.accessor((row) => row.phone, {
            id: "phone",
            cell: (info) => <span>{info.getValue()}</span>,
            header: () => <span>Số điện thoại</span>,
        }),
        columnHelper.accessor((row) => row.gender, {
            id: "gender",
            cell: (info) => <span>{info.getValue()}</span>,
            header: () => <span>Giới tính</span>,
        }),
        columnHelper.accessor((row) => row.role, {
            id: "role",
            cell: (info) => <span>{info.getValue()}</span>,
            header: () => <span>Quyền hạn</span>,
        }),
        columnHelper.accessor((row) => row.id, {
            id: "edit-del",
            cell: (info) => (
                <div className="flex justify-between">
                    {/* edit button */}
                    <button className="btn btn-square btn-sm" onClick={handleToggleEdit}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                            />
                        </svg>
                    </button>

                    {/* delete button */}
                    <button
                        className="btn btn-error btn-square btn-sm"
                        onClick={handleToggleDelete}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                        </svg>
                    </button>
                </div>
            ),
            header: () => <span></span>,
        }),
    ];

    return (
        <div className="flex-col">
            <h1>Quản lý người dùng</h1>

            <div className="flex justify-end mb-4">
                <button className="btn btn-primary">Thêm người dùng</button>
            </div>

            <div className="card bg-base-100 shadow w-full overflow-x-auto">
                <div className="card-body">
                    <Table columnDef={userColumns} data={userData} />
                </div>
            </div>

            {/* edit modal */}
            <Modal open={editOpen} onClose={handleToggleEdit}>
                <h3 className="font-bold text-lg">Chỉnh sửa thông tin người dùng</h3>
                <p className="py-4">Lmao help.</p>
                <div className="modal-action">
                    <label className="btn btn-secondary" onClick={handleToggleEdit}>
                        Hủy
                    </label>
                    <label className="btn btn-primary" onClick={handleToggleEdit}>
                        Xác nhận
                    </label>
                </div>
            </Modal>

            {/* delete modal */}
            <Modal open={deleteOpen} onClose={handleToggleDelete}>
                <h3 className="font-bold text-lg">Xóa người dùng</h3>
                <p className="py-4">Bạn có chắc chắn muốn xóa người dùng này?</p>
                <div className="modal-action">
                    <label className="btn btn-secondary" onClick={handleToggleDelete}>
                        Hủy
                    </label>
                    <label className="btn btn-error" onClick={handleToggleDelete}>
                        Xóa
                    </label>
                </div>
            </Modal>
        </div>
    );
}
