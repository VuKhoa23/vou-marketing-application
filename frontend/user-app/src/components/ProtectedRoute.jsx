import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { setAuthUser, setDestination } from "../redux/slices/authSlice";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
    const accessToken = useSelector((state) => state.auth.accessToken);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        const storedAccessToken = Cookies.get("userToken");

        if (storedAccessToken && !accessToken) {
            dispatch(setAuthUser({ accessToken: storedAccessToken }));
        } else if (!accessToken) {
            dispatch(setDestination(location.pathname));
            navigate("/login");
        }
    }, [accessToken, dispatch, location.pathname, navigate]);

    if (!accessToken) {
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
