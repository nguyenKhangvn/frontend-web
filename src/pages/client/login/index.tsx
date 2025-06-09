import { Button, Form, Input, message, notification } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { doLoginAction } from "~/redux/account/accountSlice";
import { authApi } from "~/services/axios.auth";
import { GoogleOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import "./login.scss";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmit, setIsSubmit] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get("code");

    if (code) {
      setIsGoogleLoading(true);
      authApi
        .callGoogleCallback(code)
        .then((res) => {
          localStorage.setItem("access_token", res.data.accessToken);
          dispatch(
            doLoginAction({
              accessToken: res.data.accessToken,
              userInfo: res.data.user,
            })
          );
          message.success("Đăng nhập bằng Google thành công!");
          navigate("/");
        })
        .catch(() => {
          notification.error({
            message: "Đăng nhập thất bại",
            description: "Xác thực Google không thành công. Vui lòng thử lại.",
            duration: 5,
          });
        })
        .finally(() => {
          setIsGoogleLoading(false);
        });
    }
  }, [location.search, dispatch, navigate]);

  const GOOGLE_LOGIN_URL = `${import.meta.env.VITE_API_URL}/api/v1/ecommerce/auth/login-google`;
  const REDIRECT_URI = `${import.meta.env.VITE_REDIRECT_URI}/login`;

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    const loginUrl = `${GOOGLE_LOGIN_URL}?redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    window.location.href = loginUrl;
  };


  const onFinish = async (values: { email: string; password: string }) => {
    const { email, password } = values;
    setIsSubmit(true);
    try {
      const res = await authApi.callLogin(email, password);
      // debugger
      if (res?.data) {
        localStorage.setItem("access_token", res.data.accessToken);
        dispatch(
          doLoginAction({
            accessToken: res.data.accessToken,
            userInfo: res.data.user,
          })
        );
        message.success("Đăng nhập thành công!");
        navigate("/");
      }
    } catch (error) {
      notification.error({
        message: "Đăng nhập thất bại",
        description:
          (error as any)?.response?.data?.message ||
          "Email hoặc mật khẩu không đúng",
        duration: 5,
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Đăng Nhập</h1>
          <p className="login-subtitle">
            Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục.
          </p>
        </div>


   

        <Form
          name="login-form"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          size="large"
          className="login-form"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Email không được để trống!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              prefix={<MailOutlined className="input-icon" />}
              placeholder="Email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Mật khẩu không được để trống!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="input-icon" />}
              placeholder="Mật khẩu"
            />
          </Form.Item>

          <div className="login-options">
            <Link to="/forgot-password" className="forgot-password">
              Quên mật khẩu?
            </Link>
          </div>

          <Form.Item className="login-button-container">
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmit}
              className="login-button"
              block
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <div className="login-divider">
          <span>hoặc đăng nhập với email</span>
        </div>
        
        <div className="login-social">
          <Button
            className="google-login-btn"
            onClick={handleGoogleLogin}
            loading={isGoogleLoading}
            icon={<GoogleOutlined />}
            size="large"
          >
            Đăng nhập với Google
          </Button>
        </div>

        <div className="login-footer">
          <p>
            Chưa có tài khoản?{" "}
            <Link to="/register" className="register-link">
              Đăng ký ngay
            </Link>
          </p>
          <p className="test-account">
            Tài khoản test: <strong>***</strong> /{" "}
            <strong>abc</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
