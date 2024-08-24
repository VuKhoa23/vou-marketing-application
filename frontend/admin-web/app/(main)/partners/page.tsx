"use client";

import React, { useEffect, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { useFormik } from "formik";
import * as yup from "yup";
import Table from "@/components/Table";
import { Partner } from "@/lib/types/Partner";
import partnerData from "@/lib/mock_data/partners.json";
import Modal from "@/components/Modal";

// duplicate data & get current max ID to generate new iD when adding users
// TODO: REMOVE WHEN CONNECTED TO BACKEND)
let data = [...partnerData];
let maxId: number = Math.max(...data.map((item) => item.id));

// add form validation schema
export const addSchema = yup.object().shape({
    name: yup.string().required("Vui lòng điền tên thương hiệu"),
    industry: yup.string().required("Vui lòng điền tên lĩnh vực"),
    address: yup.string().required("Vui lòng điền địa chỉ"),
    long: yup
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
    name: yup.string().required("Vui lòng điền tên thương hiệu"),
    industry: yup.string().required("Vui lòng điền tên lĩnh vực"),
    address: yup.string().required("Vui lòng điền địa chỉ"),
    long: yup
        .string()
        .required("Vui lòng điền kinh độ")
        .matches(/^[0-9.]*$/, "Kinh độ không hợp lệ"),
    lat: yup
        .string()
        .required("Vui lòng điền vĩ độ")
        .matches(/^[0-9.]*$/, "Vĩ độ không hợp lệ"),
});

export default function Partners() {
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
                name: editingPartner.name,
                industry: editingPartner.industry,
                address: editingPartner.address,
                long: editingPartner.long,
                lat: editingPartner.lat,
                isActivated: editingPartner.isActivated,
            });
        }
    }, [editingPartner]);

    // define columns for user table
    const columnHelper = createColumnHelper<Partner>();

    const partnerColumns = [
        columnHelper.accessor((row) => row.id, {
            id: "id",
            cell: (info) => info.getValue(),
            header: () => <span>ID</span>,
        }),
        columnHelper.accessor((row) => row.name, {
            id: "name",
            cell: (info) => <span>{info.getValue()}</span>,
            header: () => <span>Tên thương hiệu</span>,
        }),
        columnHelper.accessor((row) => row.industry, {
            id: "industry",
            cell: (info) => <span>{info.getValue()}</span>,
            header: () => <span>Lĩnh vực</span>,
        }),
        columnHelper.accessor((row) => row.address, {
            id: "address",
            cell: (info) => <span>{info.getValue()}</span>,
            header: () => <span>Địa chỉ</span>,
        }),
        columnHelper.accessor((row) => `${row.long}, ${row.lat}`, {
            id: "gps",
            cell: (info) => <span>{info.getValue()}</span>,
            header: () => <span>Tọa độ GPS</span>,
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
            name: "",
            industry: "",
            address: "",
            long: "",
            lat: "",
            isActivated: false,
        },
        validationSchema: addSchema,
        onSubmit: async (values) => {
            const newPartner: Partner = {
                id: maxId ? ++maxId : 1,
                name: values.name!,
                industry: values.industry!,
                address: values.address!,
                long: values.long!,
                lat: values.lat!,
                isActivated: values.isActivated!,
            };

            data = [...data, newPartner];

            setTableData(data);
            addFormik.resetForm();

            handleToggleAdd();
        },
    });

    // edit form
    const editFormik = useFormik({
        initialValues: {
            id: editingPartner?.id,
            name: editingPartner?.name,
            industry: editingPartner?.industry,
            address: editingPartner?.address,
            long: editingPartner?.long,
            lat: editingPartner?.lat,
            isActivated: editingPartner?.isActivated,
        },
        validationSchema: editSchema,
        onSubmit: async (values) => {
            const newPartner: Partner = {
                id: values.id!,
                name: values.name!,
                industry: values.industry!,
                address: values.address!,
                long: values.long!,
                lat: values.lat!,
                isActivated: values.isActivated!,
            };

            data = data.map((p) => (p.id === newPartner.id ? { ...newPartner } : p));

            setTableData(data);

            handleToggleEdit();
        },
    });

    return (
        <div className="flex-col">
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
                                name="name"
                                type="text"
                                placeholder="Tên thương hiệu"
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
                                <span className="label-text font-bold">Tên lĩnh vực</span>
                            </div>
                            <input
                                name="industry"
                                type="text"
                                placeholder="Tên lĩnh vực"
                                className="input input-bordered w-full"
                                value={addFormik.values.industry}
                                onChange={addFormik.handleChange}
                            />
                            {addFormik.touched.industry && addFormik.errors.industry && (
                                <div className="form-error-msg">{addFormik.errors.industry}</div>
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
                                name="long"
                                type="text"
                                placeholder="Kinh độ"
                                className="input input-bordered w-full"
                                value={addFormik.values.long}
                                onChange={addFormik.handleChange}
                            />
                            {addFormik.touched.long && addFormik.errors.long && (
                                <div className="form-error-msg">{addFormik.errors.long}</div>
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
                                name="name"
                                type="text"
                                placeholder="Tên thương hiệu"
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
                                <span className="label-text font-bold">Tên lĩnh vực</span>
                            </div>
                            <input
                                name="industry"
                                type="text"
                                placeholder="Tên lĩnh vực"
                                className="input input-bordered w-full"
                                value={editFormik.values.industry}
                                onChange={editFormik.handleChange}
                            />
                            {editFormik.touched.industry && editFormik.errors.industry && (
                                <div className="form-error-msg">{editFormik.errors.industry}</div>
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
                                <div className="form-error-msg">{editFormik.errors.address}</div>
                            )}
                        </label>

                        <label className="form-control w-full mt-3">
                            <div className="label">
                                <span className="label-text font-bold">Kinh độ</span>
                            </div>
                            <input
                                name="long"
                                type="text"
                                placeholder="Kinh độ"
                                className="input input-bordered w-full"
                                value={editFormik.values.long}
                                onChange={editFormik.handleChange}
                            />
                            {editFormik.touched.long && editFormik.errors.long && (
                                <div className="form-error-msg">{editFormik.errors.long}</div>
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
                            data = data.filter((u) => {
                                if (editingPartner) {
                                    return u.id != editingPartner.id;
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
