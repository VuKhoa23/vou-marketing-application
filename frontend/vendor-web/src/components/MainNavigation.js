import { NavLink } from "react-router-dom";

function MainNavigation() {
    return (
        <div className="navbar bg-blue-500 text-primary-content flex justify-center items-center">
            <div>
                <a className="btn btn-ghost text-xl">daisyUI</a>
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
                <NavLink to='/events' className="btn btn-ghost btn-rectangle">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                            d="M5.5713 14.5L9.46583 18.4141M18.9996 3.60975C17.4044 3.59505 16.6658 4.33233 16.4236 5.07743C16.2103 5.73354 16.4052 7.07735 15.896 8.0727C15.4091 9.02443 14.1204 9.5617 12.6571 9.60697M20 7.6104L20.01 7.61049M19 15.96L19.01 15.9601M7.00001 3.94926L7.01001 3.94936M19 11.1094C17.5 11.1094 16.5 11.6094 15.5949 12.5447M10.2377 7.18796C11 6.10991 11.5 5.10991 11.0082 3.52734M3.53577 20.4645L7.0713 9.85791L14.1424 16.929L3.53577 20.4645Z"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round" />
                    </svg>

                </NavLink>
                <NavLink to='/stats' className="btn btn-ghost btn-rectangle">
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
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>

                </NavLink>
            </div>
            <div className="flex-none">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="Tailwind CSS Navbar component"
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li>
                            <a className="justify-between">
                                Profile
                                <span className="badge">New</span>
                            </a>
                        </li>
                        <li><a>Settings</a></li>
                        <li><a>Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default MainNavigation;