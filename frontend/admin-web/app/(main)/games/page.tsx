"use client";

import React, { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { useFormik } from "formik";
import * as yup from "yup";
import Table from "@/components/Table";
import { Game } from "@/lib/types/Game";
import gameData from "@/lib/mock_data/games.json";
import Modal from "@/components/Modal";

// add form validation schema
export const addSchema = yup.object().shape({
    name: yup.string().required("Vui lòng điền Tên trò chơi"),
    type: yup.string().required("Vui lòng điền loại trò chơi"),
    instructions: yup.string().required("Vui lòng điền hướng dẫn chơi"),
});

// edit form validation schema
export const editSchema = yup.object().shape({
    name: yup.string().required("Vui lòng điền Tên trò chơi"),
    type: yup.string().required("Vui lòng điền loại trò chơi"),
    instructions: yup.string().required("Vui lòng điền hướng dẫn chơi"),
});

export default function Games() {
    const [addOpen, setAddOpen] = useState(false);
    const handleToggleAdd = () => setAddOpen((prev) => !prev);

    const [editOpen, setEditOpen] = useState(false);
    const handleToggleEdit = () => setEditOpen((prev) => !prev);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const handleToggleDelete = () => setDeleteOpen((prev) => !prev);

    // define columns for user table
    const columnHelper = createColumnHelper<Game>();

    const GameColumns = [
        columnHelper.accessor((row) => row.id, {
            id: "id",
            cell: (info) => info.getValue(),
            header: () => <span>ID</span>,
        }),
        columnHelper.accessor((row) => row.name, {
            id: "name",
            cell: (info) => <span>{info.getValue()}</span>,
            header: () => <span>Tên trò chơi</span>,
        }),
        columnHelper.accessor((row) => row.type, {
            id: "type",
            cell: (info) => <span>{info.getValue()}</span>,
            header: () => <span>Loại trò chơi</span>,
        }),
        columnHelper.accessor((row) => row.instructions, {
            id: "instructions",
            cell: (info) => <span>{info.getValue()}</span>,
            header: () => <span>Hướng dẫn chơi</span>,
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

    // add form
    const addFormik = useFormik({
        initialValues: {
            name: "",
            type: "",
            instructions: "",
        },
        validationSchema: addSchema,
        onSubmit: async (values) => {
            handleToggleAdd();
        },
    });

    // edit form
    const editFormik = useFormik({
        initialValues: {
            name: "",
            type: "",
            instructions: "",
        },
        validationSchema: editSchema,
        onSubmit: async (values) => {
            handleToggleEdit();
        },
    });

    return (
        <div className="flex-col">
            <h1>Quản lý trò chơi</h1>

            <div className="flex justify-end mb-4">
                <button className="btn btn-primary" onClick={handleToggleAdd}>
                    Thêm trò chơi
                </button>
            </div>

            <div className="card bg-base-100 shadow w-full overflow-x-auto">
                <div className="card-body">
                    <Table columnDef={GameColumns} data={gameData} />
                </div>
            </div>

            {/* add modal */}
            <Modal
                open={addOpen}
                onClose={() => {
                    addFormik.resetForm();
                }}
            >
                <h3 className="font-bold text-lg">Thêm trò chơi</h3>
                <form
                    method="dialog"
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                >
                    <div>
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Tên trò chơi</span>
                            </div>
                            <input
                                name="name"
                                type="text"
                                placeholder="Tên trò chơi"
                                className="input input-bordered w-full max-w-xs"
                                value={addFormik.values.name}
                                onChange={addFormik.handleChange}
                            />
                            {addFormik.touched.name && addFormik.errors.name && (
                                <div className="form-error-msg">{addFormik.errors.name}</div>
                            )}
                        </label>

                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Loại trò chơi</span>
                            </div>
                            <input
                                name="type"
                                type="text"
                                placeholder="Loại trò chơi"
                                className="input input-bordered w-full max-w-xs"
                                value={addFormik.values.type}
                                onChange={addFormik.handleChange}
                            />
                            {addFormik.touched.type && addFormik.errors.type && (
                                <div className="form-error-msg">{addFormik.errors.type}</div>
                            )}
                        </label>

                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Hướng dẫn chơi</span>
                            </div>
                            <textarea
                                name="instructions"
                                placeholder="Hướng dẫn chơi"
                                className="textarea textarea-bordered textarea-md w-full max-w-xs"
                                value={addFormik.values.instructions}
                                onChange={addFormik.handleChange}
                            />
                            {addFormik.touched.instructions && addFormik.errors.instructions && (
                                <div className="form-error-msg">
                                    {addFormik.errors.instructions}
                                </div>
                            )}
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
            <Modal
                open={editOpen}
                onClose={() => {
                    editFormik.resetForm();
                }}
            >
                <h3 className="font-bold text-lg">Cập nhật thông tin trò chơi</h3>
                <form
                    method="dialog"
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                >
                    <div>
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Tên trò chơi</span>
                            </div>
                            <input
                                name="name"
                                type="text"
                                placeholder="Tên trò chơi"
                                className="input input-bordered w-full max-w-xs"
                                value={editFormik.values.name}
                                onChange={editFormik.handleChange}
                            />
                            {editFormik.touched.name && editFormik.errors.name && (
                                <div className="form-error-msg">{editFormik.errors.name}</div>
                            )}
                        </label>

                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Loại trò chơi</span>
                            </div>
                            <input
                                name="type"
                                type="text"
                                placeholder="Loại trò chơi"
                                className="input input-bordered w-full max-w-xs"
                                value={editFormik.values.type}
                                onChange={editFormik.handleChange}
                            />
                            {editFormik.touched.type && editFormik.errors.type && (
                                <div className="form-error-msg">{editFormik.errors.type}</div>
                            )}
                        </label>

                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Hướng dẫn chơi</span>
                            </div>
                            <textarea
                                name="instructions"
                                placeholder="Hướng dẫn chơi"
                                className="textarea textarea-bordered textarea-md w-full max-w-xs"
                                value={addFormik.values.instructions}
                                onChange={addFormik.handleChange}
                            />
                            {editFormik.touched.instructions && editFormik.errors.instructions && (
                                <div className="form-error-msg">
                                    {editFormik.errors.instructions}
                                </div>
                            )}
                        </label>
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
                <h3 className="font-bold text-lg">Xóa trò chơi</h3>
                <p className="py-4">Bạn có chắc chắn muốn xóa trò chơi này?</p>
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
