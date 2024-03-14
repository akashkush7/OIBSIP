import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth'
import { useEffect } from 'react';

const Logout = () => {
    const { LogoutUser } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        LogoutUser();
        navigate("/");
    }, []);
    return;
}

export default Logout;