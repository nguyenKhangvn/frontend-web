import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert, Button, Card, Descriptions, Spin } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import "./PaymentResponse.css";
import VnPayResponse from "~/types/payment";
import { paymentApi } from "~/services/axios.payment";
import { useDispatch, useSelector } from "react-redux";
import couponApi from "~/services/axios.coupon";
import {
  CartItem,
  doDeleteVoucherSelectedAction,
} from "~/redux/order/orderSlice";
import { productApi } from "~/services/axios.product";
import { notification } from "antd";
import Coupon from "~/types/coupon";

const PaymentResponse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [response, setResponse] = useState<VnPayResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const selectedVoucher = useSelector(
    (state: any) => state.order.selectedCoupon
  ) as Coupon;
  const selectedProducts = useSelector(
    (state: any) => state.order.selectedProducts
  ) as CartItem[];

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    // Kiểm tra các tham số bắt buộc từ VNPay
    if (!queryParams.has("vnp_ResponseCode")) {
      setError("Thiếu tham số phản hồi từ VNPay");
      setLoading(false);
      return;
    }

    const uniqueProducts = Array.from(
      new Map(selectedProducts.map((p) => [p.detail.id, p])).values()
    );

    // Gửi request đến backend để xác thực
    const verifyPayment = async () => {
      try {
        const res = await paymentApi.ProcessPaymentResponse(
          Object.fromEntries(queryParams)
        );
        setResponse({
          success: res.success,
          paymentMethod: queryParams.get("vnp_CardType") || "",
          orderDescription: queryParams.get("vnp_OrderInfo") || "",
          orderCode: queryParams.get("vnp_TxnRef") || "",
          paymentId: queryParams.get("vnp_TransactionNo") || "",
          transactionId: queryParams.get("vnp_TransactionNo") || "",
          vnPayResponseCode: queryParams.get("vnp_ResponseCode") || "",
          vnPayTransactionStatus:
            queryParams.get("vnp_TransactionStatus") || "",
        });

        // Handle voucher and inventory updates if payment is successful
        if (queryParams.get("vnp_TransactionStatus") === "00") {
          // Update voucher if used
          if (selectedVoucher) {
            await couponApi.useAndDelete(selectedVoucher.id);
            dispatch(doDeleteVoucherSelectedAction());
          }

          // Update product quantities
          for (const product of uniqueProducts) {
            console.log(
              `Updating product ${product.id} with quantity ${product.quantity}`
            );
            try {
              await productApi.updateProductQuantity(
                product.detail.id,
                product.quantity
              );
            } catch (err) {
              console.error(
                `Failed to update quantity for product ${product.detail.id}`,
                err
              );
              notification.error({
                message: "Lỗi cập nhật kho",
                description: `Không thể cập nhật số lượng cho sản phẩm ${product.detail.name}`,
              });
            }
          }
        }
      } catch (err) {
        setError("Xác thực thanh toán thất bại");
        console.error("Xác thực thanh toán thất bại", err);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [location.search]);

  if (loading) {
    return <Spin tip="Đang xử lý kết quả thanh toán..." size="large" />;
  }

  if (error) {
    return (
      <Alert
        message="Lỗi"
        description={error}
        type="error"
        showIcon
        action={
          <Button type="primary" onClick={() => navigate("/")}>
            <HomeOutlined /> Về trang chủ
          </Button>
        }
      />
    );
  }

  return (
    <div className="payment-response-container">
      <Card
        title={
          response?.vnPayTransactionStatus === "00"
            ? "Thanh toán thành công"
            : "Thanh toán thất bại"
        }
        style={{ maxWidth: 800, margin: "20px auto" }}
        headStyle={{
          backgroundColor:
            response?.vnPayTransactionStatus === "00" ? "#52c41a" : "#f5222d",
          color: "white",
        }}
      >
        {response?.vnPayTransactionStatus === "00" ? (
          <Alert
            message="Cảm ơn bạn đã thanh toán!"
            type="success"
            showIcon
            icon={<CheckCircleOutlined />}
          />
        ) : (
          <Alert
            message={`Thanh toán không thành công (Mã lỗi: ${response?.vnPayResponseCode})`}
            type="error"
            showIcon
            icon={<CloseCircleOutlined />}
          />
        )}

        <Descriptions bordered column={1} style={{ marginTop: 20 }}>
          <Descriptions.Item label="Mã đơn hàng">
            {response?.orderCode}
          </Descriptions.Item>
          <Descriptions.Item label="Phương thức thanh toán">
            {response?.paymentMethod || "Không xác định"}
          </Descriptions.Item>
          <Descriptions.Item label="Mô tả">
            {response?.orderDescription}
          </Descriptions.Item>

          {response?.success && (
            <>
              <Descriptions.Item label="Mã giao dịch VNPay">
                {response?.transactionId}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian">
                {new Date().toLocaleString()}
              </Descriptions.Item>
            </>
          )}
        </Descriptions>

        <div style={{ marginTop: 24, textAlign: "center" }}>
          {response?.vnPayTransactionStatus === "00" ? (
            <Button
              type="primary"
              onClick={() => navigate(`/orders/${response.orderCode}`)}
            >
              Xem đơn hàng
            </Button>
          ) : (
            <Button type="dashed" danger onClick={() => navigate("/cart")}>
              Thử lại thanh toán
            </Button>
          )}

          <Button style={{ marginLeft: 8 }} onClick={() => navigate("/")}>
            <HomeOutlined /> Trang chủ
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PaymentResponse;
