import ViewOrder from "./ViewOrder";
import { Breadcrumb, Button, Result, Steps } from "antd";
import "./order.scss";
import { useState } from "react";
import Payment from "~/pages/client/payment/Payment";
import { SmileOutlined, HomeOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const OrderPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      <div
        className="order-container"
        style={{ maxWidth: 1440, margin: "0 auto" }}
      >
        <Breadcrumb
          style={{ margin: "5px 0" }}
          items={[
            {
              title: <HomeOutlined />,
            },
            {
              title: (
                <Link to={"/"}>
                  <span>Trang Chủ</span>
                </Link>
              ),
            },
          ]}
        />
        <div className="order-steps">
          <Steps
            size="small"
            current={currentStep}
            items={[
              {
                title: "Đơn hàng",
              },
              {
                title: "Đặt hàng",
              },
              {
                title: "Thanh toán",
              },
            ]}
          />
        </div>
        {currentStep === 0 && <ViewOrder setCurrentStep={setCurrentStep} />}
        {currentStep === 1 && <Payment setCurrentStep={setCurrentStep} />}
        {currentStep === 2 && (
          <Result
            icon={<SmileOutlined />}
            title="Đơn hàng đã được đặt thành công!"
            extra={
              <Button type="primary" onClick={() => navigate("/history")}>
                Xem lịch sử
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
};

export default OrderPage;
