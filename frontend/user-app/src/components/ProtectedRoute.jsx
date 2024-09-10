import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { setAuthUser } from "../redux/slices/authSlice";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
    const accessToken = useSelector((state) => state.auth.accessToken);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const storedAccessToken = Cookies.get("userToken");

        if (storedAccessToken && !accessToken) {
            dispatch(setAuthUser({ accessToken: storedAccessToken }));
        } else if (!accessToken) {
            navigate("/login");
        }
    }, [accessToken, dispatch, navigate]);

    if (!accessToken) {
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
