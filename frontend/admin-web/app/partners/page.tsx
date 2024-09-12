"use client";

import React, { useEffect, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { useFormik } from "formik";
import * as yup from "yup";
import Table from "@/components/Table";
import { Partner } from "@/lib/types/Partner";
import Modal from "@/components/Modal";
import NavLayout from "../NavLayout";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { setPartners } from "@/lib/redux/slices/partnersSlice";
import toast, { Toaster } from "react-hot-toast";

// add form validation schema
export const addSchema = yup.object().shape({
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
});

// edit form validation schema
export const editSchema = yup.object().shape({
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
});

export default function Partners() {
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);
    const data = useSelector((state: RootState) => state.partners.partners);

    const dispatch = useDispatch<AppDispatch>();

    const [fetched, setFetched] = useState(false);

    const [addOpen, setAddOpen] = useState(false);
    const handleToggleAdd = () => setAddOpen((prev) => !prev);

    const [editingPartner, setEditingPartner] = useState<Partner>();

    const [editOpen, setEditOpen] = useState(false);
    const handleToggleEdit = () => setEditOpen((prev) => !prev);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const handleToggleDelete = () => setDeleteOpen((prev) => !prev);

    const [tableData, setTableData] = useState(data);

    // update the edit form whenever the selected partner changes
    useEffect(() => {
        if (editingPartner) {
            editFormik.setValues({
                id: editingPartner.id,
                username: editingPartner.username,
                category: editingPartner.category,
                address: editingPartner.address,
                lon: editingPartner.lon,
                lat: editingPartner.lat,
                state: editingPartner.state,
            });
        }
    }, [editingPartner]);

    useEffect(() => {
        setTableData(data);
    }, [data]);

    useEffect(() => {
        if (!fetched) {
            fetchPartners();
        }
    }, [accessToken]);

    // define columns for user table
    const columnHelper = createColumnHelper<Partner>();

    const partnerColumns = [
        columnHelper.accessor((row) => row.id, {
            id: "id",
            cell: (info) => info.getValue(),
            header: () => <span>ID</span>,
        }),
        columnHelper.accessor((row) => row.username, {
            id: "username",
            cell: (info) => <span>{info.getValue()}</span>,
            header: () => <span>Tên thương hiệu</span>,
        }),
        columnHelper.accessor((row) => row.category, {
            id: "category",
            cell: (info) => <span>{info.getValue()}</span>,
            header: () => <span>Lĩnh vực</span>,
        }),
        columnHelper.accessor((row) => row.address, {
            id: "address",
            cell: (info) => <span>{info.getValue()}</span>,
            header: () => <span>Địa chỉ</span>,
        }),
        columnHelper.accessor((row) => `${row.lon}, ${row.lat}`, {
            id: "gps",
            cell: (info) => <span>{info.getValue()}</span>,
            header: () => <span>Tọa độ GPS</span>,
        }),
        columnHelper.accessor((row) => row.state, {
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
                            setEditingPartner(info.getValue());
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
                            setEditingPartner(info.getValue());
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
            category: "",
            address: "",
            lon: "",
            lat: "",
            state: false,
        },
        validationSchema: addSchema,
        onSubmit: async (values) => {
            const newPartner = {
                username: values.username!,
                password: "initpass",
                category: values.category!,
                address: values.address!,
                lon: values.lon!,
                lat: values.lat!,
                state: values.state!,
            };

            try {
                const response = await fetch("http://localhost/api/admin/brand-management/create", {
                    method: "POST",
                    headers: {
                        Authorization: "Bearer " + accessToken,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newPartner),
                });

                if (response.ok) {
                    fetchPartners();
                    toast.success("Thêm thương hiệu thành công.");
                } else {
                    console.error(
                        "Error fetching partners: ",
                        response.status,
                        response.statusText
                    );

                    toast.error("Thương hiệu đã tồn tại.");
                }
            } catch (error) {
                console.error("Error fetching partners: ", error);
                toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
            }

            addFormik.resetForm();

            handleToggleAdd();
        },
    });

    // edit form
    const editFormik = useFormik({
        initialValues: {
            id: editingPartner?.id,
            username: editingPartner?.username,
            category: editingPartner?.category,
            address: editingPartner?.address,
            lon: editingPartner?.lon,
            lat: editingPartner?.lat,
            state: editingPartner?.state,
        },
        validationSchema: editSchema,
        onSubmit: async (values) => {
            const newPartner = {
                username: values.username!,
                category: values.category!,
                address: values.address!,
                lon: values.lon!,
                lat: values.lat!,
                state: values.state!,
            };

            console.log(newPartner);

            handleToggleEdit();
        },
    });

    return (
        <NavLayout>
            <div className="flex-col">
                <Toaster />
                <h1>Quản lý thương hiệu</h1>

                <div className="flex justify-end mb-4">
                    <button className="btn btn-primary" onClick={handleToggleAdd}>
                        Thêm thương hiệu
                    </button>
                </div>

                <div className="card bg-base-100 shadow w-full overflow-x-auto">
                    <div className="card-body">
                        <Table columnDef={partnerColumns} data={tableData} />
                    </div>
                </div>

                {/* add modal */}
                <Modal open={addOpen}>
                    <h3 className="font-bold text-lg">Thêm thương hiệu</h3>
                    <form
                        method="dialog"
                        onSubmit={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <div>
                            <label className="form-control w-full mt-3">
                                <div className="label">
                                    <span className="label-text font-bold">Tên thương hiệu</span>
                                </div>
                                <input
                                    name="username"
                                    type="text"
                                    placeholder="Tên thương hiệu"
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
                                    <span className="label-text font-bold">Tên lĩnh vực</span>
                                </div>
                                <input
                                    name="category"
                                    type="text"
                                    placeholder="Tên lĩnh vực"
                                    className="input input-bordered w-full"
                                    value={addFormik.values.category}
                                    onChange={addFormik.handleChange}
                                />
                                {addFormik.touched.category && addFormik.errors.category && (
                                    <div className="form-error-msg">
                                        {addFormik.errors.category}
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
                                    value={addFormik.values.address}
                                    onChange={addFormik.handleChange}
                                    onBlur={randCoords}
                                />
                                {addFormik.touched.address && addFormik.errors.address && (
                                    <div className="form-error-msg">{addFormik.errors.address}</div>
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
                                    value={addFormik.values.lon}
                                    onChange={addFormik.handleChange}
                                />
                                {addFormik.touched.lon && addFormik.errors.lon && (
                                    <div className="form-error-msg">{addFormik.errors.lon}</div>
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
                                    value={addFormik.values.lat}
                                    onChange={addFormik.handleChange}
                                />
                                {addFormik.touched.lat && addFormik.errors.lat && (
                                    <div className="form-error-msg">{addFormik.errors.lat}</div>
                                )}
                            </label>

                            <div className="form-control w-full mt-3">
                                <label className="label cursor-pointer">
                                    <span className="label-text font-bold">
                                        Kích hoạt tài khoản
                                    </span>
                                    <input
                                        type="checkbox"
                                        name="state"
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
                    <h3 className="font-bold text-lg">Cập nhật thông tin thương hiệu</h3>
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
                                    <span className="label-text font-bold">Tên thương hiệu</span>
                                </div>
                                <input
                                    name="username"
                                    type="text"
                                    placeholder="Tên thương hiệu"
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
                                    <span className="label-text font-bold">Tên lĩnh vực</span>
                                </div>
                                <input
                                    name="category"
                                    type="text"
                                    placeholder="Tên lĩnh vực"
                                    className="input input-bordered w-full"
                                    value={editFormik.values.category}
                                    onChange={editFormik.handleChange}
                                />
                                {editFormik.touched.category && editFormik.errors.category && (
                                    <div className="form-error-msg">
                                        {editFormik.errors.category}
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
                                    value={editFormik.values.address}
                                    onChange={editFormik.handleChange}
                                />
                                {editFormik.touched.address && editFormik.errors.address && (
                                    <div className="form-error-msg">
                                        {editFormik.errors.address}
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
                                    value={editFormik.values.lon}
                                    onChange={editFormik.handleChange}
                                />
                                {editFormik.touched.lon && editFormik.errors.lon && (
                                    <div className="form-error-msg">{editFormik.errors.lon}</div>
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
                                    value={editFormik.values.lat}
                                    onChange={editFormik.handleChange}
                                />
                                {editFormik.touched.lat && editFormik.errors.lat && (
                                    <div className="form-error-msg">{editFormik.errors.lat}</div>
                                )}
                            </label>

                            <div className="form-control w-full mt-3">
                                <label className="label cursor-pointer">
                                    <span className="label-text font-bold">
                                        Kích hoạt tài khoản
                                    </span>
                                    <input
                                        type="checkbox"
                                        name="state"
                                        onChange={editFormik.handleChange}
                                        checked={editFormik.values.state}
                                        className="checkbox"
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="modal-action">
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
                    <h3 className="font-bold text-lg">Xóa thương hiệu</h3>
                    <p className="py-4">Bạn có chắc chắn muốn xóa thương hiệu này?</p>
                    <div className="modal-action">
                        <label className="btn btn-secondary" onClick={handleToggleDelete}>
                            Hủy
                        </label>
                        <label
                            className="btn btn-error"
                            onClick={(e) => {
                                e.preventDefault();

                                const deleted = data.filter((u) => {
                                    if (editingPartner) {
                                        return u.id != editingPartner.id;
                                    }
                                });

                                handleToggleDelete();
                            }}
                        >
                            Xóa
                        </label>
                    </div>
                </Modal>
            </div>
        </NavLayout>
    );

    async function fetchPartners() {
        try {
            const response = await fetch("http://localhost/api/admin/brand-management/get-all", {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + accessToken,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const resData = await response.json();
                dispatch(setPartners(resData.data));
                setFetched(true);
            } else {
                console.error("Error fetching partners: ", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Error fetching partners: ", error);
        }
    }

    function randCoords() {
        // long limits
        const lonMin = 102.15;
        const lonMax = 109.4;

        // lat limits
        const latMin = 8.57;
        const latMax = 23.38;

        const longitude = Math.random() * (lonMax - lonMin) + lonMin;
        const latitude = Math.random() * (latMax - latMin) + latMin;

        addFormik.setFieldValue("lon", longitude.toFixed(6));
        addFormik.setFieldValue("lat", latitude.toFixed(6));
    }
}
