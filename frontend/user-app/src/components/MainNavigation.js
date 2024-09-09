import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

function MainNavigation() {
    const [isScrolled, setIsScrolled] = useState(false);

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
            <div className="flex-none">
                <div className="dropdown dropdown-end ">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="Tailwind CSS Navbar component"
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 text-slate-800 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li>
                            <NavLink to="/profile" className="justify-between">
                                Profile
                            </NavLink>
                        </li>
                        <li><a href="/login">Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default MainNavigation;
