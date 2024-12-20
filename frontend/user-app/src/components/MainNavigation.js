import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, setAuthUser } from '../redux/slices/authSlice';
import { FaBell } from 'react-icons/fa';
import { setUserInfo } from '../redux/slices/userSlice';
import Cookies from "js-cookie";

function MainNavigation() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const accessToken = useSelector((state) => state.auth.accessToken);
    const user = useSelector((state) => state.user);
    const [request, setRequest] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [fetched, setFetched] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    useEffect(() => {
        async function getRequest(token) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/get-turn-request`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log(data)

                    const filteredData = data.filter(item => item.state === false);
                    console.log("Filtered data:", filteredData);

                    setRequest(filteredData);
                } else {
                    const errorData = await response.json();
                    console.error("Error get request:", response.status, response.statusText, errorData);
                }
            } catch (error) {
                console.error("Error fetching game ID:", error);
            }
        }
        getRequest(accessToken);
    }, [accessToken])

    const toggleDropdown = () => {
        setIsDropdownOpen(prevState => !prevState);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    const handleAccept = (id) => {
        setRequest((prevRequests) => prevRequests.filter((req) => req.id !== id));
        console.log(`Chấp nhận yêu cầu từ ${id}`);
        // Logic khác xử lý khi chấp nhận yêu cầu
        acceptRequest(accessToken, parseInt(id, 10));
    };

    useEffect(() => {
        if (!fetched) {
            dispatch(setAuthUser(Cookies.get("userToken")));
            fetchUserInfo(Cookies.get("userToken"));
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div
            className={`sticky top-0 z-50 navbar ${isScrolled ? 'bg-blue-500 bg-opacity-60' : 'bg-blue-500'} text-primary-content flex justify-center items-center transition-all duration-300 ease-in-out`}
        >
            <div>
                <a href="/" className="btn btn-ghost text-xl">VOU User Client</a>
            </div>
            <div className="flex justify-center items-center flex-1 space-x-4">
                <NavLink to='/' className="btn btn-ghost btn-rectangle">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                </NavLink>
            </div>
            {accessToken ? (
                <>
                    <div>
                        <div className="dropdown dropdown-end mr-2">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="rounded-lg">
                                    <FaBell size={30} />
                                </div>
                                {request.length > 0 && (
                                    <span className="absolute top-0 right-0 rounded-full bg-red-500 text-white text-xs px-2 py-1">
                                        {request.length}
                                    </span>
                                )}
                            </div>
                            <ul
                                tabIndex={0}
                                className="dropdown-content bg-base-100 text-slate-800 rounded-box z-[1] mt-3 w-52 shadow">
                                {request.map((req) => (
                                    <li key={req.id} className="flex flex-col justify-between items-center p-2 border-b round-lg">
                                        <span>{`${req.id}/Có người xin 1 lượt chơi game lắc xu từ bạn`}</span>
                                        <div>
                                            <button
                                                className="btn btn-xs btn-success mr-2"
                                                onClick={() => handleAccept(req.id)}
                                            >
                                                Chấp nhận
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="flex-none">
                        <div className="dropdown dropdown-end ">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar" onClick={toggleDropdown}>
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="Tailwind CSS Navbar component"
                                        src={user.image_url} />
                                </div>
                            </div>
                            {isDropdownOpen && (
                                <ul
                                    tabIndex={0}
                                    className="menu menu-sm dropdown-content bg-base-100 text-slate-800 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                                >
                                    <li>
                                        <NavLink to='/profile' className="justify-between" onClick={closeDropdown}>
                                            Hồ sơ
                                        </NavLink>
                                    </li>
                                    <li><button onClick={handleLogout}>Đăng xuất</button></li>
                                </ul>
                            )}
                        </div>
                    </div>

                </>
            )
                :
                <Link to="/login" className="btn btn-ghost btn-rectangle">Đăng nhập</Link>}

        </div >
    );

    async function fetchUserInfo(token) {
        try {
            const response = await fetch(`http://localhost/api/user/info`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const userData = await response.json();

                dispatch(setUserInfo({
                    id: userData.id,
                    username: userData.username,
                    phone: userData.phone,
                    gender: userData.gender,
                    image_url: userData.image_url
                }));

                setFetched(true);
            } else {
                console.log("Error retrieving user info.");
            }
        } catch (error) {
            console.log("Error retrieving user info:" + error);
        }
    };
}

export default MainNavigation;

async function acceptRequest(token, requestId) {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/accept-turn-request`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: requestId
            })
        });
        if (response.ok) {

        } else {
            const errorData = await response.json();
            console.error("Error accept request:", response.status, response.statusText, errorData);
        }
    } catch (error) {
        console.error("Error fetching game ID:", error);
    }
}
