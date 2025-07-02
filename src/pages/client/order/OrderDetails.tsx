import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Descriptions,
  Table,
  Tag,
  Spin,
  Button,
  message,
  Typography,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { orderApi } from "~/services/axios.order";
import Order from "~/types/order";
import { paymentApi } from "~/services/axios.payment";
import Address from "~/types/address";
import { addressApi } from "~/services/axios.address";
import { useSelector } from "react-redux";
import { CartItem } from "~/redux/order/orderSlice";

const { Title } = Typography;

const OrderDetails: React.FC = () => {
  const { orderCode } = useParams();
  const navigate = useNavigate();
  const address = useSelector(
    (state: any) => state.address.selected
  ) as Address | null;

  const orderItems = useSelector(
    (state: any) => state.order.selectedProducts
  ) as CartItem[];
  const [order, setOrder] = useState<Order | null>(null);
  const [payment, setPayment] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!orderCode) throw new Error("Không có mã đơn hàng");
        setLoading(true);
        const response = await orderApi.getOrderByOrderCode(orderCode);
        const payment = await paymentApi.getPaymentByOrderId(response.id);
        setOrder(response);
        setPayment(payment);
      } catch (err) {
        console.error(err);
        setError("Không thể tải thông tin đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderCode]);

  const renderOrderStatus = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Tag color="default">Chờ xử lý</Tag>;
      case "PROCESSING":
        return (
          <Tag color="processing" icon={<SyncOutlined spin />}>
            Đang xử lý
          </Tag>
        );
      case "SHIPPED":
        return <Tag color="blue">Đã gửi hàng</Tag>;
      case "DELIVERED":
        return (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            Đã giao
          </Tag>
        );
      case "CANCELED":
        return (
          <Tag color="error" icon={<CloseCircleOutlined />}>
            Đã hủy
          </Tag>
        );
      case "RETURNED":
        return <Tag color="purple">Đã trả hàng</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const renderPaymentStatus = (status: number) => {
    switch (status) {
      case 1:
        return (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            Đã thanh toán
          </Tag>
        );
      case 0:
        return (
          <Tag color="warning" icon={<SyncOutlined spin />}>
            Chờ thanh toán
          </Tag>
        );
      case 2:
        return <Tag color="error">Thanh toán thất bại</Tag>;
      case 3:
        return <Tag color="purple">Đã hoàn tiền</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const columns = [
    {
      title: "Sản phẩm",
      key: "productName",
      render: (_: any, record: CartItem) => (
        <div>
          <strong>{record.detail.name}</strong>
          <div style={{ color: "#888" }}>SKU: {record.detail.name}</div>
        </div>
      ),
    },
    {
      title: "Đơn giá",
      key: "price",
      render: (_: any, record: CartItem) =>
        `${record.detail.price.toLocaleString()} VND`,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Thành tiền",
      key: "total",
      render: (_: any, record: CartItem) =>
        `${(record.quantity * record.detail.price).toLocaleString()} VND`,
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px" }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <p>{error || "Không tìm thấy đơn hàng"}</p>
        <Button type="primary" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
      <Button
        icon={<ArrowLeftOutlined />}
        type="text"
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        Quay lại
      </Button>

      <Title level={3}>Chi tiết đơn hàng: {order.orderCode}</Title>

      <Descriptions bordered column={2} style={{ marginBottom: 24 }}>
        <Descriptions.Item label="Trạng thái đơn hàng" span={2}>
          {renderOrderStatus(order.status)}
        </Descriptions.Item>
        <Descriptions.Item label="Mã đơn hàng">
          {order.orderCode}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày đặt">
          {new Date(payment.paidAt).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng tiền">
          {order.totalAmount.toLocaleString()} VND
        </Descriptions.Item>
        <Descriptions.Item label="Ghi chú">
          {order.notes || "Không có"}
        </Descriptions.Item>
        <Descriptions.Item label="Địa chỉ giao hàng" span={2}>
          {address
            ? `${address.ward}, ${address.district}, ${address?.city}, ${address.country ?? "Việt Nam"}`
            : "Không có địa chỉ"}
        </Descriptions.Item>
      </Descriptions>

      {payment && (
        <>
          <Title level={4} style={{ marginTop: 32 }}>
            Thông tin thanh toán
          </Title>
          <Descriptions bordered column={2} style={{ marginBottom: 24 }}>
            <Descriptions.Item label="Phương thức">
              {payment.paymentMethod === "VnPay" ? "VNPay" : "Tiền mặt (COD)"}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {renderPaymentStatus(payment.status)}
            </Descriptions.Item>
            <Descriptions.Item label="Mã giao dịch">
              {payment.transactionId || "Chưa có"}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian thanh toán">
              {payment.paidAt
                ? new Date(payment.paidAt).toLocaleString()
                : "Chưa thanh toán"}
            </Descriptions.Item>
            <Descriptions.Item label="Số tiền">
              {Number(payment.amount).toLocaleString()} VND
            </Descriptions.Item>
          </Descriptions>
        </>
      )}

      <Title level={4}>Danh sách sản phẩm</Title>
      <Table
        columns={columns}
        dataSource={orderItems}
        rowKey="id"
        pagination={false}
      />

      <div style={{ marginTop: 24, textAlign: "right" }}>
        <Button onClick={() => navigate("/history")} style={{ marginRight: 8 }}>
          Danh sách đơn hàng
        </Button>
        {order.status === "PENDING" && (
          <Button
            danger
            onClick={() => message.warning("Chức năng hủy đang phát triển")}
          >
            Hủy đơn hàng
          </Button>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
