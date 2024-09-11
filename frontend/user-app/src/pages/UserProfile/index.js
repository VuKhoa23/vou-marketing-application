import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Event from '../Home/components/Event';
import ProtectedRoute from '../../components/ProtectedRoute';

const Profile = () => {
    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.auth.accessToken);
    const [favoriteEvents, setFavoriteEvents] = useState([]);
    // const dispatch = useDispatch();

    console.log(user);

    useEffect(() => {
        async function fetchFavoriteEvents(token) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/watchlist`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setFavoriteEvents(data.data);
                } else {
                    console.error("Error fetching favorite list:", response.status, response.statusText);
                }
            } catch (error) {
                console.error("Error fetching game ID:", error);
            }
        }

        fetchFavoriteEvents(token);
    }, [])

    return (
        <ProtectedRoute>
            <div className='grid grid-cols-12 gap-x-10 m-12'>
                <div className='col-span-4'>
                    <h3 className="font-bold text-xl">Tài khoản</h3>
                    <div>
                        <img className="rounded-full h-2/5 w-2/5 my-6" alt="user-avatar" src={user.image_url} />

                        <label className="form-control w-full mt-3">
                            <div className="label">
                                <span className="label-text font-bold">Tên đăng nhập</span>
                            </div>
                            <input
                                name="username"
                                type="text"
                                placeholder="Tên đăng nhập"
                                className="input input-bordered w-full"
                                value={user.username}
                                readOnly
                            />
                        </label>

                        <label className="form-control w-full mt-3">
                            <div className="label">
                                <span className="label-text font-bold">Số điện thoại</span>
                            </div>
                            <input
                                name="phone"
                                type="text"
                                placeholder="Số điện thoại"
                                className="input input-bordered w-full"
                                value={user.phone}
                                readOnly
                            />
                        </label>

                        <label className="form-control w-full mt-3">
                            <div className="label">
                                <span className="label-text font-bold">Giới tính</span>
                                <span className="label-text">{user.gender === "male" ? "Nam" : "Nữ"}</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div className='col-span-4'>
                    <h3 className="font-bold text-xl">Voucher của tôi</h3>
                </div>
                <div className='col-span-4 border-4'>
                    <h3 className="font-bold text-xl">Sự kiện yêu thích</h3>
                    <ul className='flex flex-wrap justify-center space-x-4 md:space-x-6 lg:space-x-8 mb-10'>
                        {favoriteEvents.map((event) => {
                            return (
                                <li key={event.event.Id} className='m-4 hover:shadow-lg'>
                                    <Event
                                        id={event.event.Id}
                                        image={event.event.ImageURL}
                                        name={event.event.Name}
                                        startDate={formatDate(event.event.StartDate)}
                                        endDate={formatDate(event.event.EndDate)}
                                        brand={event.event.brand.username}
                                        voucher={event.voucher.voucherQuantities}
                                        gameType={getGameType(event.event)}
                                        isHome={false}
                                    />
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </ProtectedRoute >
    );
};

export default Profile;

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

function getGameType(event) {
    let gameType = "";

    if (event.shaking) {
        gameType += "Lắc xu";
    }

    if (event.trivia) {
        if (gameType !== "") {
            gameType += ", ";
        }
        gameType += "Trivia (câu hỏi trắc nghiệm)";
    }

    return gameType;
}