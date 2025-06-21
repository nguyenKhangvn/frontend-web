import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Typography,
  Empty,
  InputNumber,
  message,
  Space,
  Carousel,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  doDeleteItemCartAction,
  doSetSelectedProductsAction,
  doUpdateCartAction,
} from "~/redux/order/orderSlice";
import { CartItem } from "~/redux/order/orderSlice";
import { getImageUrl } from "~/config/config";
const { Title, Text } = Typography;

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(
    (state: any) => state.order.carts
  ) as CartItem[];

  const selectedCartItem = useSelector(
    (state: any) => state.order.selectedProducts
  ) as CartItem[];
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const handleSelectAllToggle = () => {
    if (isAllSelected) {
      setSelectedRowKeys([]);
    } else {
      setSelectedRowKeys(cartItems.map((item: any) => item.id));
    }
    setIsAllSelected(!isAllSelected);
    dispatch(doSetSelectedProductsAction({ products: cartItems }));
  };

  const handleRemove = (id: string) => {
    dispatch(doDeleteItemCartAction({ id }));

    message.success("Đã xóa sản phẩm khỏi giỏ hàng");
  };

  const handleQuantityChange = (id: string, newQuantity: number | null) => {
    if (!newQuantity || newQuantity < 1) return;

    const product = cartItems.find((item) => item.id === id);
    if (!product) {
      return;
    }
    dispatch(
      doUpdateCartAction({ id, quantity: newQuantity, detail: product.detail })
    );
  };

  const handleRemoveSelected = () => {
    selectedRowKeys.forEach((key) => {
      dispatch(doDeleteItemCartAction({ id: key }));
    });

    setSelectedRowKeys([]);
    message.success("Đã xóa các sản phẩm đã chọn");
  };

  const handleBuy = () => {
    const selectedItems = cartItems.filter((item: any) =>
      selectedRowKeys.includes(item.id)
    );

    if (selectedItems.length === 0) {
      message.warning("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
      return;
    }

    // Lưu danh sách sản phẩm được chọn vào Redux store để xử lý sau

    // Chuyển đến trang đặt hàng
    navigate("/orders");
  };

  const columns: ColumnsType<CartItem> = [
    {
      title: "Ảnh",
      key: "image",
      render: (_, record) => {
        const images = record.detail.image || []; // Lấy danh sách ảnh từ sản phẩm

        return (
          <Carousel autoplay dots={false} arrows style={{ width: 60 }}>
            {images.map((img: any, idx: number) => (
              <div key={idx}>
                <img
                  src={getImageUrl(img.url)}
                  alt={img.altText || "Ảnh sản phẩm"}
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    borderRadius: "4px"
                  }}
                  loading="lazy"
                />
              </div>
            ))}
          </Carousel>
        );
      },
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (_, record) => record.detail.name || "Sản phẩm không xác định",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (_, record) => `${record.detail?.price?.toLocaleString() || 0}₫`,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity: number, record: CartItem) => (
        <InputNumber
          min={1}
          max={record.detail.quantity}
          value={quantity}
          onChange={(value) => handleQuantityChange(record.id, value)}
        />
      ),
    },
    {
      title: "Tổng",
      key: "total",
      render: (_, record: CartItem) =>
        `${(record.detail.price * record.quantity).toLocaleString()}₫`,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record: CartItem) => (
        <Button danger onClick={() => handleRemove(record.id)}>
          Xóa
        </Button>
      ),
    },
  ];

  const rowSelection: TableRowSelection<CartItem> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
      setIsAllSelected(newSelectedRowKeys.length === cartItems.length);
      const selectedProducts = cartItems.filter((item) =>
        newSelectedRowKeys.includes(item.id)
      );
      dispatch(doSetSelectedProductsAction({ products: selectedProducts }));
    },
  };

  useEffect(() => {
    const selectedItems = cartItems.filter((item) =>
      selectedRowKeys.includes(item.id)
    );
    const total = selectedItems.reduce((sum: number, item: CartItem) => {
      const price = item.detail.price || 0;
      return sum + price * item.quantity;
    }, 0);
    setTotalPrice(total);
  }, [cartItems, selectedRowKeys]);

  return (
    <div className="cart-container" style={{ padding: "20px" }}>
      <Title level={2}>Giỏ hàng</Title>
      {cartItems.length > 0 ? (
        <>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={cartItems}
            rowKey="id"
            pagination={false}
            bordered
          />
          <div
            style={{
              textAlign: "right",
              marginTop: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <Space wrap>
              <Button
                onClick={handleSelectAllToggle}
                style={{ width: "100px" }}
              >
                {isAllSelected ? "Bỏ chọn" : "Chọn tất cả"}
              </Button>
              <Button
                danger
                disabled={selectedRowKeys.length === 0}
                onClick={handleRemoveSelected}
              >
                Xóa đã chọn
              </Button>
            </Space>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Text strong style={{ fontSize: 16 }}>
                Tổng cộng: {totalPrice.toLocaleString()}₫
              </Text>
              <Button
                type="primary"
                disabled={selectedRowKeys.length === 0}
                onClick={handleBuy}
              >
                Mua hàng
              </Button>
            </div>
          </div>
        </>
      ) : (
        <Empty description="Không có sản phẩm trong giỏ hàng" />
      )}
    </div>
  );
};

export default Cart;
