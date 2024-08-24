"use client";

import React, { useEffect, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { useFormik, FormikValues } from "formik";
import * as yup from "yup";
import Table from "@/components/Table";
import { User } from "@/lib/types/User";
import userData from "@/lib/mock_data/users.json";
import Modal from "@/components/Modal";

// duplicate data & get current max ID to generate new iD when adding users
// TODO: REMOVE WHEN CONNECTED TO BACKEND)
let data = [...userData];
let maxId: number = Math.max(...data.map((item) => item.id));

// add form validation schema
export const addSchema = yup.object().shape({
    name: yup.string().required("Vui lòng điền họ và tên"),
    email: yup.string().required("Vui lòng điền địa chỉ email").email("Địa chỉ email không hợp lệ"),
    username: yup.string().required("Vui lòng điền tên người dùng"),
    phone: yup
        .string()
        .required("Vui lòng điền số điện thoại")
        .matches(/^0[0-9]{9}$/, "Số điện thoại phải bao gồm 10 chữ số và bắt đầu bằng 0"),
});

// edit form validation schema
export const editSchema = yup.object().shape({
    name: yup.string().required("Vui lòng điền họ và tên"),
    email: yup.string().required("Vui lòng điền địa chỉ email").email("Địa chỉ email không hợp lệ"),
    username: yup.string().required("Vui lòng điền tên người dùng"),
    phone: yup
        .string()
        .required("Vui lòng điền số điện thoại")
        .matches(/^0[0-9]{9}$/, "Số điện thoại phải bao gồm 10 chữ số và bắt đầu bằng 0"),
});

export default function Users() {
    const [addOpen, setAddOpen] = useState(false);
    const handleToggleAdd = () => setAddOpen((prev) => !prev);

    const [editingUser, setEditingUser] = useState<User>();

    const [editOpen, setEditOpen] = useState(false);
    const handleToggleEdit = () => setEditOpen((prev) => !prev);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const handleToggleDelete = () => setDeleteOpen((prev) => !prev);

    const [tableData, setTableData] = useState(data);

    // update the edit form whenever the selected user changes
    useEffect(() => {
        if (editingUser) {
            editFormik.setValues({
                id: editingUser.id,
                name: editingUser.name,
                username: editingUser.username,
                email: editingUser.email,
                phone: editingUser.phone,
                role: editingUser.role,
                isActivated: editingUser.isActivated,
            });
        }
    }, [editingUser]);

    // define columns for user table
    const columnHelper = createColumnHelper<User>();

    const userColumns = [
        columnHelper.accessor((row) => row.id, {
            id: "id",
            cell: (info) => info.getValue(),
            header: () => <span>ID</span>,
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
            header: () => <span>Địa chỉ email</span>,
        }),
        columnHelper.accessor((row) => row.phone, {
            id: "phone",
            cell: (info) => <span>{info.getValue()}</span>,
            header: () => <span>Số điện thoại</span>,
        }),
        columnHelper.accessor((row) => row.role, {
            id: "role",
            cell: (info) => <span>{info.getValue()}</span>,
            header: () => <span>Quyền hạn</span>,
        }),
        columnHelper.accessor((row) => row.isActivated, {
            id: "active-status",
            cell: (info) => (
                <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    disabled
                    checked={info.getValue()}
                />
            ),
            header: () => <span>Đã kích hoạt?</span>,
        }),
        columnHelper.accessor((row) => row, {
            id: "edit-del",
            cell: (info) => (
                <div className="flex justify-between">
                    {/* edit button */}
                    <button
                        className="btn btn-square btn-sm"
                        onClick={(e) => {
                            e.preventDefault();
                            setEditingUser(info.getValue());
                            handleToggleEdit();
                        }}
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
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                            />
                        </svg>
                    </button>

                    {/* delete button */}
                    <button
                        className="btn btn-error btn-square btn-sm"
                        onClick={(e) => {
                            e.preventDefault();
                            setEditingUser(info.getValue());
                            handleToggleDelete();
                        }}
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

    // add form
    const addFormik = useFormik({
        initialValues: {
            name: "",
            username: "",
            email: "",
            phone: "",
            role: "Người dùng",
            isActivated: false,
        },
        validationSchema: addSchema,
        onSubmit: async (values) => {
            const newUser: User = {
                id: maxId ? ++maxId : 1,
                name: values.name!,
                username: values.username!,
                email: values.email!,
                phone: values.phone!,
                role: values.role!,
                isActivated: values.isActivated!,
            };

            data = [...data, newUser];

            setTableData(data);
            addFormik.resetForm();

            handleToggleAdd();
        },
    });

    // edit form
    const editFormik = useFormik({
        initialValues: {
            id: editingUser?.id,
            name: editingUser?.name,
            username: editingUser?.username,
            email: editingUser?.email,
            phone: editingUser?.phone,
            role: editingUser?.role,
            isActivated: editingUser?.isActivated,
        },
        validationSchema: editSchema,
        onSubmit: async (values) => {
            const newUser: User = {
                id: values.id!,
                name: values.name!,
                username: values.username!,
                email: values.email!,
                phone: values.phone!,
                role: values.role!,
                isActivated: values.isActivated!,
            };

            data = data.map((u) => (u.id === newUser.id ? { ...newUser } : u));

            setTableData(data);

            handleToggleEdit();
        },
    });

    return (
        <div className="flex-col">
            <h1>Quản lý người dùng</h1>

            <div className="flex justify-end mb-4">
                <button className="btn btn-primary" onClick={handleToggleAdd}>
                    Thêm người dùng
                </button>
            </div>

            <div className="card bg-base-100 shadow w-full overflow-x-auto">
                <div className="card-body">
                    <Table columnDef={userColumns} data={tableData} />
                </div>
            </div>

            {/* add modal */}
            <Modal open={addOpen}>
                <h3 className="font-bold text-lg">Thêm người dùng</h3>
                <form
                    method="dialog"
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                >
                    <div>
                        <label className="form-control w-full mt-3">
                            <div className="label">
                                <span className="label-text font-bold">Họ và tên</span>
                            </div>
                            <input
                                name="name"
                                type="text"
                                placeholder="Họ và tên"
                                className="input input-bordered w-full"
                                value={addFormik.values.name}
                                onChange={addFormik.handleChange}
                            />
                            {addFormik.touched.name && addFormik.errors.name && (
                                <div className="form-error-msg">{addFormik.errors.name}</div>
                            )}
                        </label>

                        <label className="form-control w-full mt-3">
                            <div className="label">
                                <span className="label-text font-bold">Tên người dùng</span>
                            </div>
                            <input
                                name="username"
                                type="text"
                                placeholder="Tên người dùng"
                                className="input input-bordered w-full"
                                value={addFormik.values.username}
                                onChange={addFormik.handleChange}
                            />
                            {addFormik.touched.username && addFormik.errors.username && (
                                <div className="form-error-msg">{addFormik.errors.username}</div>
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
                                value={addFormik.values.email}
                                onChange={addFormik.handleChange}
                            />
                            {addFormik.touched.email && addFormik.errors.email && (
                                <div className="form-error-msg">{addFormik.errors.email}</div>
                            )}
                        </label>

                        <label className="form-control w-full mt-3">
                            <div className="label">
                                <span className="label-text font-bold">Số điện thoại</span>
                            </div>
                            <input
                                name="phone"
                                type="tel"
                                placeholder="Số diện thoại"
                                className="input input-bordered w-full"
                                value={addFormik.values.phone}
                                onChange={addFormik.handleChange}
                            />
                            {addFormik.touched.phone && addFormik.errors.phone && (
                                <div className="form-error-msg">{addFormik.errors.phone}</div>
                            )}
                        </label>

                        <label className="form-control w-full mt-3">
                            <div className="label">
                                <span className="label-text font-bold">Quyền hạn</span>
                            </div>
                            <select
                                name="role"
                                value={addFormik.values.role}
                                className="select select-bordered w-full"
                                onChange={addFormik.handleChange}
                                onBlur={addFormik.handleBlur}
                            >
                                <option value="Admin" label="Admin" selected>
                                    Admin
                                </option>
                                <option value="Người dùng" label="Người dùng">
                                    Người dùng
                                </option>
                            </select>
                        </label>

                        <div className="form-control w-full mt-3">
                            <label className="label cursor-pointer">
                                <span className="label-text font-bold">Kích hoạt tài khoản</span>
                                <input
                                    type="checkbox"
                                    name="isActivated"
                                    onChange={addFormik.handleChange}
                                    className="checkbox"
                                />
                            </label>
                        </div>
                    </div>

                    <div className="modal-action">
                        <label className="btn btn-secondary" onClick={handleToggleAdd}>
                            Hủy
                        </label>
                        <button
                            type="submit"
                            onClick={(e) => {
                                e.preventDefault();
                                addFormik.handleSubmit();
                            }}
                            className="btn btn-primary"
                        >
                            Thêm
                        </button>
                    </div>
                </form>
            </Modal>

            {/* edit modal */}
            <Modal open={editOpen}>
                <h3 className="font-bold text-lg">Cập nhật thông tin người dùng</h3>
                <form
                    method="dialog"
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                >
                    <div>
                        <label className="form-control w-full mt-3">
                            <div className="label">
                                <span className="label-text font-bold">ID</span>
                            </div>
                            <input
                                name="id"
                                type="text"
                                className="input input-bordered w-full"
                                value={editFormik.values.id}
                                disabled
                            />
                        </label>

                        <label className="form-control w-full mt-3">
                            <div className="label">
                                <span className="label-text font-bold">Họ và tên</span>
                            </div>
                            <input
                                name="name"
                                type="text"
                                placeholder="Họ và tên"
                                className="input input-bordered w-full"
                                value={editFormik.values.name}
                                onChange={editFormik.handleChange}
                            />
                            {editFormik.touched.name && editFormik.errors.name && (
                                <div className="form-error-msg">{editFormik.errors.name}</div>
                            )}
                        </label>

                        <label className="form-control w-full mt-3">
                            <div className="label">
                                <span className="label-text font-bold">Tên người dùng</span>
                            </div>
                            <input
                                name="username"
                                type="text"
                                placeholder="Tên người dùng"
                                className="input input-bordered w-full"
                                value={editFormik.values.username}
                                onChange={editFormik.handleChange}
                            />
                            {editFormik.touched.username && editFormik.errors.username && (
                                <div className="form-error-msg">{editFormik.errors.username}</div>
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
                                value={editFormik.values.email}
                                onChange={editFormik.handleChange}
                            />
                            {editFormik.touched.email && editFormik.errors.email && (
                                <div className="form-error-msg">{editFormik.errors.email}</div>
                            )}
                        </label>

                        <label className="form-control w-full mt-3">
                            <div className="label">
                                <span className="label-text font-bold">Số điện thoại</span>
                            </div>
                            <input
                                name="phone"
                                type="tel"
                                placeholder="Số diện thoại"
                                className="input input-bordered w-full"
                                value={editFormik.values.phone}
                                onChange={editFormik.handleChange}
                            />
                            {editFormik.touched.phone && editFormik.errors.phone && (
                                <div className="form-error-msg">{editFormik.errors.phone}</div>
                            )}
                        </label>

                        <label className="form-control w-full mt-3">
                            <div className="label">
                                <span className="label-text font-bold">Quyền hạn</span>
                            </div>
                            <select
                                name="role"
                                value={editFormik.values.role}
                                className="select select-bordered w-full"
                                onChange={editFormik.handleChange}
                                onBlur={editFormik.handleBlur}
                            >
                                <option value="Admin" label="Admin" selected>
                                    Admin
                                </option>
                                <option value="Người dùng" label="Người dùng">
                                    Người dùng
                                </option>
                            </select>
                        </label>

                        <div className="form-control w-full mt-3">
                            <label className="label cursor-pointer">
                                <span className="label-text font-bold">Kích hoạt tài khoản</span>
                                <input
                                    type="checkbox"
                                    name="isActivated"
                                    onChange={editFormik.handleChange}
                                    checked={editFormik.values.isActivated}
                                    className="checkbox"
                                />
                            </label>
                        </div>
                    </div>

                    <div className="modal-action mt-3">
                        <label className="btn btn-secondary" onClick={handleToggleEdit}>
                            Hủy
                        </label>
                        <button
                            type="submit"
                            onClick={(e) => {
                                e.preventDefault();
                                editFormik.handleSubmit();
                            }}
                            className="btn btn-primary"
                        >
                            Xác nhận
                        </button>
                    </div>
                </form>
            </Modal>

            {/* delete modal */}
            <Modal open={deleteOpen}>
                <h3 className="font-bold text-lg">Xóa người dùng</h3>
                <p className="py-4">Bạn có chắc chắn muốn xóa người dùng này?</p>
                <div className="modal-action">
                    <label className="btn btn-secondary" onClick={handleToggleDelete}>
                        Hủy
                    </label>
                    <label
                        className="btn btn-error"
                        onClick={(e) => {
                            e.preventDefault();
                            data = data.filter((u) => {
                                if (editingUser) {
                                    return u.id != editingUser.id;
                                }
                            });

                            setTableData(data);
                            handleToggleDelete();
                        }}
                    >
                        Xóa
                    </label>
                </div>
            </Modal>
        </div>
    );
}
