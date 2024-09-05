"use client";

import React, { useEffect, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { useFormik } from "formik";
import * as yup from "yup";
import Table from "@/components/Table";
import { Game } from "@/lib/types/Game";
import gameData from "@/lib/mock_data/games.json";
import Modal from "@/components/Modal";

// duplicate data & get current max ID to generate new iD when adding users
// TODO: REMOVE WHEN CONNECTED TO BACKEND)
let data = [...gameData];

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
    const [editingGame, setEditingGame] = useState<Game>();

    const [editOpen, setEditOpen] = useState(false);
    const handleToggleEdit = () => setEditOpen((prev) => !prev);

    const [tableData, setTableData] = useState(data);

    // update the edit form whenever the selected game changes
    useEffect(() => {
        if (editingGame) {
            editFormik.setValues({
                id: editingGame.id,
                name: editingGame.name,
                type: editingGame.type,
                allowsTrade: editingGame.allowsTrade,
                instructions: editingGame.instructions,
            });
        }
    }, [editingGame]);

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
        columnHelper.accessor((row) => row.allowsTrade, {
            id: "allowsTrade",
            cell: (info) => (
                <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    disabled
                    checked={info.getValue()}
                />
            ),
            header: () => <span>Đổi vật phẩm?</span>,
        }),
        columnHelper.accessor((row) => row.instructions, {
            id: "instructions",
            cell: (info) => <span>{info.getValue()}</span>,
            header: () => <span>Hướng dẫn chơi</span>,
        }),
        columnHelper.accessor((row) => row, {
            id: "edit-del",
            cell: (info) => (
                <button
                    className="btn btn-square btn-sm"
                    onClick={(e) => {
                        e.preventDefault();
                        setEditingGame(info.getValue());
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
            ),
            header: () => <span></span>,
        }),
    ];

    // edit form
    const editFormik = useFormik({
        initialValues: {
            id: editingGame?.id,
            name: editingGame?.name,
            type: editingGame?.type,
            allowsTrade: editingGame?.allowsTrade,
            instructions: editingGame?.instructions,
        },
        validationSchema: editSchema,
        onSubmit: async (values) => {
            const newGame: Game = {
                id: values.id!,
                name: values.name!,
                type: values.type!,
                allowsTrade: values.allowsTrade!,
                instructions: values.instructions!,
            };

            data = data.map((g) => (g.id === newGame.id ? { ...newGame } : g));

            setTableData(data);

            handleToggleEdit();
        },
    });

    return (
        <div className="flex-col">
            <h1>Quản lý trò chơi</h1>

            <div className="card bg-base-100 shadow w-full overflow-x-auto">
                <div className="card-body">
                    <Table columnDef={GameColumns} data={tableData} />
                </div>
            </div>

            {/* edit modal */}
            <Modal open={editOpen}>
                <h3 className="font-bold text-lg">Cập nhật thông tin trò chơi</h3>
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
                                <span className="label-text font-bold">Tên trò chơi</span>
                            </div>
                            <input
                                name="name"
                                type="text"
                                placeholder="Tên trò chơi"
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
                                <span className="label-text font-bold">Loại trò chơi</span>
                            </div>
                            <input
                                name="type"
                                type="text"
                                placeholder="Loại trò chơi"
                                className="input input-bordered w-full"
                                value={editFormik.values.type}
                                onChange={editFormik.handleChange}
                            />
                            {editFormik.touched.type && editFormik.errors.type && (
                                <div className="form-error-msg">{editFormik.errors.type}</div>
                            )}
                        </label>

                        <div className="form-control w-full mt-3">
                            <label className="label cursor-pointer">
                                <span className="label-text font-bold">
                                    Cho phép người chơi trao đổi vật phẩm
                                </span>
                                <input
                                    type="checkbox"
                                    name="allowsTrade"
                                    onChange={editFormik.handleChange}
                                    checked={editFormik.values.allowsTrade}
                                    className="checkbox"
                                />
                            </label>
                        </div>

                        <label className="form-control w-full mt-3">
                            <div className="label">
                                <span className="label-text font-bold">Hướng dẫn chơi</span>
                            </div>
                            <textarea
                                name="instructions"
                                placeholder="Hướng dẫn chơi"
                                className="textarea textarea-bordered textarea-md w-full"
                                value={editFormik.values.instructions}
                                onChange={editFormik.handleChange}
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
        </div>
    );
}
