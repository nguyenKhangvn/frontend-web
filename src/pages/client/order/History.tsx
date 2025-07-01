import { Tag, Table } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

import { FORMAT_DATE_DISPLAY } from "~/utils/constant";
import "./History.css";
import { useNavigate } from "react-router-dom";
import Order from "~/types/order";
import { paymentApi } from "~/services/axios.payment";
import { useSelector } from "react-redux";
const History = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const user = useSelector((state: any) => state.account.user);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchHistory = async () => {
      const res = await paymentApi.getAll(user.id);
      if (res) {
        setOrderHistory(res);
      }
    };
    fetchHistory();
  }, []);

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: any, index: number) => <>{index + 1}</>,
    },
    {
      title: "Thời gian ",
      dataIndex: "paidAt",
      render: (item: string) => moment(item).format(FORMAT_DATE_DISPLAY),
    },
    {
      title: "Tổng số tiền",
      dataIndex: "amount",
      render: (item: number) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(item),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (item: number) =>
        item === 1 ? (
          <Tag color="green">Đã thanh toán</Tag>
        ) : (
          <Tag color="red">Chưa thanh toán</Tag>
        ),
    },
    {
      title: "Chi tiết",
      key: "action",
      render: (_: any, record: any) => {
        debugger;
        if (!record) {
          return <span>Không có dữ liệu</span>;
        }
        return (
          <a
            onClick={() => {
              navigate(`/orders/${record.orderCode}`);
            }}
            style={{
              color: "#1890ff",
              cursor: "pointer",
            }}
          >
            Xem chi tiết
          </a>
        );
      },
    },
  ];

  return (
    <div>
      <h1 style={{ margin: "15px 0" }}>Lịch sử đặt hàng:</h1>
      <Table columns={columns} dataSource={orderHistory} pagination={false} />
    </div>
  );
};

export default History;
