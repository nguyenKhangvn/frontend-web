import { useEffect, useState, useRef } from 'react'; // Thêm useRef
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Spin, Alert } from 'antd';
import { authApi } from '~/services/axios.auth';
import { doLoginAction } from '~/redux/account/accountSlice';

const LoginCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [error, setError] = useState<string | null>(null);

    // SỬA ĐỔI 2: Dùng useRef để tránh useEffect chạy lại không cần thiết
    const effectRan = useRef(false);

    useEffect(() => {
        // Chỉ chạy logic khi component được mount lần đầu
        if (effectRan.current === false) {
            const params = new URLSearchParams(location.search);
            const code = params.get('code');
            const errorMessage = params.get('error');

            if (code) {
                authApi.callGoogleCallback(code)
                    .then(res => {
                        if (res?.data) {
                            localStorage.setItem('access_token', res.data.accessToken);
                            if (res.data.user) {
                                localStorage.setItem('user_info', JSON.stringify(res.data.user));
                            }
                            dispatch(doLoginAction({
                                accessToken: res.data.accessToken,
                                userInfo: res.data.user
                            }));
                            // SỬA ĐỔI 1: Dùng replace: true để dọn dẹp URL
                            navigate('/', { replace: true });
                        }
                    })
                    .catch(err => {
                        console.error('Google callback error:', err);
                        const displayError = err.response?.data?.message || 'Đăng nhập với Google thất bại';
                        setError(displayError);
                        setTimeout(() => navigate('/login', { replace: true }), 3000);
                    });
            } else if (errorMessage) {
                setError(errorMessage);
                setTimeout(() => navigate('/login', { replace: true }), 3000);
            } else {
                navigate('/login', { replace: true });
            }

            // Đánh dấu effect đã chạy
            return () => {
                effectRan.current = true;
            };
        }
    }, [location, navigate, dispatch]); // Bỏ isProcessing ra khỏi dependency array

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Alert message="Lỗi xác thực" description={error} type="error" showIcon />
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <h2 className="mb-5">Đang xử lý đăng nhập...</h2>
            <Spin size="large" />
        </div>
    );
};

export default LoginCallback;