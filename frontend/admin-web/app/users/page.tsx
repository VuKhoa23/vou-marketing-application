"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { useFormik } from "formik";
import * as yup from "yup";
import Table from "@/components/Table";
import { User } from "@/lib/types/User";
import Modal from "@/components/Modal";
import NavLayout from "../NavLayout";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { setUsers } from "@/lib/redux/slices/usersSlice";
import toast, { Toaster } from "react-hot-toast";
import * as AWS from "aws-sdk";

// S3 bucket name
const bucketName = "first-time-using-s3-bucket";

// add form validation schema
export const addSchema = yup.object().shape({
    username: yup.string().required("Vui lòng điền tên người dùng"),
    phone: yup
        .string()
        .required("Vui lòng điền số điện thoại")
        .matches(/^0[0-9]{9}$/, "Số điện thoại phải bao gồm 10 chữ số và bắt đầu bằng 0"),
});

// edit form validation schema
export const editSchema = yup.object().shape({
    username: yup.string().required("Vui lòng điền tên người dùng"),
    phone: yup
        .string()
        .required("Vui lòng điền số điện thoại")
        .matches(/^0[0-9]{9}$/, "Số điện thoại phải bao gồm 10 chữ số và bắt đầu bằng 0"),
});

export default function Users() {
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);
    const data = useSelector((state: RootState) => state.users.users);

    const dispatch = useDispatch<AppDispatch>();

    const [fetched, setFetched] = useState(false);

    const [addOpen, setAddOpen] = useState(false);
    const handleToggleAdd = () => setAddOpen((prev) => !prev);

    const [avatarToAdd, setAvatarToAdd] = useState<File>();

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
                username: editingUser.username,
                phone: editingUser.phone,
                gender: editingUser.gender,
            });
        }
    }, [editingUser]);

    useEffect(() => {
        setTableData(data);
    }, [data]);

    useEffect(() => {
        if (!fetched) {
            fetchUsers();
        }
    }, [accessToken]);

    // define columns for user table
    const columnHelper = createColumnHelper<User>();

    const userColumns = [
        columnHelper.accessor((row) => row.id, {
            id: "id",
            cell: (info) => info.getValue(),
            header: () => <span>ID</span>,
        }),
        columnHelper.accessor((row) => row.image_url, {
            id: "avatar",
            cell: (info) => (
                <div className="mask mask-squircle h-12 w-12">
                    {info.getValue() !== "" ? (
                        <img src={info.getValue()} alt="user_avatar" />
                    ) : (
                        "Không có"
                    )}
                </div>
            ),
            header: () => <span>Ảnh đại diện</span>,
        }),
        columnHelper.accessor((row) => row.username, {
            id: "username",
            cell: (info) => <span>{info.getValue()}</span>,
            header: () => <span>Tên người dùng</span>,
        }),
        columnHelper.accessor((row) => row.phone, {
            id: "phone",
            cell: (info) => <span>{info.getValue()}</span>,
            header: () => <span>Số điện thoại</span>,
        }),
        columnHelper.accessor((row) => row.gender, {
            id: "gender",
            cell: (info) => <span>{info.getValue() === "male" ? "Nam" : "Nữ"}</span>,
            header: () => <span>Giới tính</span>,
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
            username: "",
            email: "",
            phone: "",
            gender: "male",
        },
        validationSchema: addSchema,
        onSubmit: async (values) => {
            try {
                let imgUrl = "";

                if (avatarToAdd !== undefined) {
                    imgUrl = await uploadToS3(avatarToAdd, bucketName);
                }

                const newUser = {
                    username: values.username!,
                    password: "initpass",
                    email: values.email!,
                    phone: values.phone!,
                    gender: values.gender!,
                    image_url: imgUrl,
                };

                const response = await fetch("http://localhost/api/admin/user-management/create", {
                    method: "POST",
                    headers: {
                        Authorization: "Bearer " + accessToken,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newUser),
                });

                if (response.ok) {
                    fetchUsers();
                    setAvatarToAdd(undefined);
                    toast.success("Thêm người dùng thành công.");
                } else {
                    console.error("Error fetching users: ", response.status, response.statusText);

                    toast.error("Tên người dùng đã tồn tại.");
                }
            } catch (error) {
                console.error("Error fetching users: ", error);
                toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
            }

            addFormik.resetForm();

            handleToggleAdd();
        },
    });

    // edit form
    const editFormik = useFormik({
        initialValues: {
            id: editingUser?.id,
            username: editingUser?.username,
            phone: editingUser?.phone,
            gender: editingUser?.gender,
        },
        validationSchema: editSchema,
        onSubmit: async (values) => {
            const newUser = {
                id: values.id!,
                username: values.username!,
                phone: values.phone!,
                gender: values.gender!,
                image_url: editingUser?.image_url,
            };

            try {
                const response = await fetch(
                    `http://localhost/api/admin/user-management/update/${values.id}`,
                    {
                        method: "PUT",
                        headers: {
                            Authorization: "Bearer " + accessToken,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(newUser),
                    }
                );

                if (response.ok) {
                    fetchUsers();
                    toast.success("Chỉnh sửa thông tin người dùng thành công.");
                } else {
                    console.error("Error fetching users: ", response.status, response.statusText);

                    toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
                }
            } catch (error) {
                console.error("Error fetching users: ", error);
                toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
            }

            addFormik.resetForm();

            handleToggleEdit();
        },
    });

    return (
        <NavLayout>
            <div className="flex-col">
                <Toaster />
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
                                    <div className="form-error-msg">
                                        {addFormik.errors.username}
                                    </div>
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
                                    <span className="label-text font-bold">Giới tính</span>
                                </div>
                                <select
                                    name="gender"
                                    value={addFormik.values.gender}
                                    className="select select-bordered w-full"
                                    onChange={addFormik.handleChange}
                                    onBlur={addFormik.handleBlur}
                                >
                                    <option value="male" label="Nam" selected>
                                        Nam
                                    </option>
                                    <option value="female" label="Nữ">
                                        Nữ
                                    </option>
                                </select>
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
                                    <div className="form-error-msg">
                                        {editFormik.errors.username}
                                    </div>
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
                                    <span className="label-text font-bold">Giới tính</span>
                                </div>
                                <select
                                    name="gender"
                                    value={editFormik.values.gender}
                                    className="select select-bordered w-full"
                                    onChange={editFormik.handleChange}
                                    onBlur={editFormik.handleBlur}
                                >
                                    <option value="male" label="Nam" selected>
                                        Nam
                                    </option>
                                    <option value="female" label="Nữ">
                                        Nữ
                                    </option>
                                </select>
                            </label>
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
                                handleDelete();
                            }}
                        >
                            Xóa
                        </label>
                    </div>
                </Modal>
            </div>
        </NavLayout>
    );

    async function fetchUsers() {
        try {
            const response = await fetch("http://localhost/api/admin/user-management/get-all", {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + accessToken,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const resData = await response.json();
                dispatch(setUsers(resData.data));
                setFetched(true);
            } else {
                console.error("Error fetching users: ", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Error fetching users: ", error);
        }
    }

    async function handleDelete() {
        try {
            const response = await fetch(
                `http://localhost/api/admin/user-management/delete/${editingUser?.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: "Bearer " + accessToken,
                    },
                }
            );

            if (response.ok) {
                fetchUsers();
                toast.success("Xóa người dùng thành công.");
                handleToggleDelete();
            } else {
                console.error("Error fetching users: ", response.status, response.statusText);
                toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
            }
        } catch (error) {
            console.error("Error fetching users: ", error);
            toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
        }
    }

    function handleImgInputChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const file = (e.target as HTMLInputElement).files![0];

        if (file) {
            setAvatarToAdd(file);
        }
    }

    async function uploadToS3(file: File, bucketName: string): Promise<string> {
        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID!,
            secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY!,
            region: "ap-southeast-2",
        });
        const s3 = new AWS.S3({
            apiVersion: "2012-10-17",
            params: { Bucket: bucketName },
        });

        const params = {
            Bucket: bucketName,
            Key: `${file.name}`,
            Body: file as any,
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
}
