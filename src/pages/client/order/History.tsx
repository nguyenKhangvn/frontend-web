import { Tag, Table } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

import { FORMAT_DATE_DISPLAY } from "~/utils/constant";
import { useSelector } from "react-redux";
import { orderApi } from "~/services/axios.order";
import "./History.css";
import { useNavigate } from "react-router-dom";
import Order from "~/types/order";
const History = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const user = useSelector((state: any) => state.account.user);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchHistory = async () => {
      const res = await orderApi.callOrderHistory(user.id);
      if (res && res.data) {
        setOrderHistory(res.data);
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
      dataIndex: "createdAt",
      render: (item: string) => moment(item).format(FORMAT_DATE_DISPLAY),
    },
    {
      title: "Tổng số tiền",
      dataIndex: "totalAmount",
      render: (item: number) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(item),
    },
    {
      title: "Trạng thái",
      render: () => <Tag color={"green"}>Thành công</Tag>,
    },
    {
      title: "Chi tiết",
      key: "action",
      render: (_: any, record: Order) => {
        // debugger;
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
