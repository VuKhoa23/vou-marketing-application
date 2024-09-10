import React, { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

function Event({ id, name, brand, image, voucher, startDate, endDate, gameType, isFavorite, isHome }) {

    const [isFavorited, setIsFavorited] = useState(isFavorite); // Trạng thái yêu thích
    const token = useSelector((state) => state.auth.accessToken);

    function parseDate(dateString) {
        const [day, month, year] = dateString.split('-');
        return new Date(year, month - 1, day);
    }

    useEffect(() => {
        setIsFavorited(isFavorite);
    }, [isFavorite]);

    const now = new Date();

    // Xác định trạng thái của sự kiện
    let statusBadge;
    if (now < parseDate(startDate)) {
        statusBadge = <div className="badge badge-outline border-blue-500 text-blue-500">Sắp bắt đầu</div>;
    } else if (now > parseDate(endDate)) {
        statusBadge = <div className="badge badge-outline border-gray-500 text-gray-500">Đã kết thúc</div>;
    } else {
        statusBadge = <div className="badge badge-outline border-red-500 text-red-500">Đang diễn ra</div>;
    }

    // Hàm để toggle yêu thích
    const toggleFavorite = () => {
        const newFavoritedState = !isFavorited;
        setIsFavorited(newFavoritedState);


        if (newFavoritedState) {
            console.log("add");
            addToWatchList(token, id);
        } else {
            console.log("remove");
            removeFromWatchList(token, id);
        }
    };


    return (
        <div className="card bg-base-100 w-96 shadow-xl">
            <figure className="w-full h-48 overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover"
                />
            </figure>
            <div className="card-body">
                <p>Thương hiệu: {brand}</p>
                <p>Loại sự kiện: {gameType === 'Lắc xu' ? "Game lắc xu" : "Game Trivia"}</p>
                <p>Số lượng voucher: {voucher}</p>
                <p>
                    Thời gian: {startDate} đến {endDate}
                </p>
                <div className="card-actions flex items-center justify-between space-x-2">
                    {isHome ?
                        <button onClick={toggleFavorite} className="text-red-500 focus:outline-none">
                            {isFavorited ? <FaHeart size={24} /> : <FaRegHeart color='gray' size={24} />}
                        </button>
                        :
                        <Button>
                            {
                                gameType === 'Lắc xu' ?
                                    <NavLink to={`/game/${id}`}>Chơi game</NavLink>
                                    :
                                    <NavLink to={`/trivia/${id}`}>Chơi game</NavLink>
                            }
                        </Button>
                    }
                    {statusBadge}
                </div>
            </div>
        </div>
    );
}

export default Event;

async function addToWatchList(token, eventId) {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/watchlist/add`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                eventId: eventId,
            }),
        });
        if (response.ok) {
            //const data = await response.json();
        } else {
            const errorData = await response.json();
            console.error("Error fetching add to favorite list:", response.status, response.statusText, errorData);
        }
    } catch (error) {
        console.error("Error fetching game ID:", error);
    }
}

async function removeFromWatchList(token, eventId) {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/watchlist/add`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                eventId: eventId,
            }),
        });
        if (response.ok) {
            //const data = await response.json();
        } else {
            const errorData = await response.json();
            console.error("Error fetching add to favorite list:", response.status, response.statusText, errorData);
        }
    } catch (error) {
        console.error("Error fetching game ID:", error);
    }
}
