import { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { VscSearchFuzzy } from "react-icons/vsc";
import {
  Divider,
  Badge,
  Drawer,
  message,
  Avatar,
  Popover,
  Empty,
  Dropdown,
  Space,
  List,
  Carousel,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../../../services/axios.auth";
import "./header.scss";
import { doLogoutAction } from "../../../redux/account/accountSlice";
import ManageAccount from "../Account/ManageAccount";
import { CartItem } from "~/redux/order/orderSlice";
import { getImageUrl } from "~/config/config";

const Header = (props: {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openDrawer, setOpenDrawer] = useState(false);
  const isAuthenticated = useSelector(
    (state: any) => state.account.isAuthenticated
  );
  const user = useSelector((state: any) => state.account.user);

  const cartItems = useSelector(
    (state: any) => state.order.carts
  ) as CartItem[];
  const [showManageAccount, setShowManageAccount] = useState(false);

  const handleLogout = async () => {
    await authApi.callLogout();
    dispatch(doLogoutAction());
    message.success("Đăng xuất thành công");
    navigate("/login");
  };

  const isAdminOrStaff = () => {
    return user?.role === "ADMIN" || user?.role === "STAFF";
  };

  const generateMenuItems = () => {
    const adminItem = isAdminOrStaff()
      ? [{ key: "admin", label: <Link to="/admin">Quản trị hệ thống</Link> }]
      : [];

    return [
      ...adminItem,
      {
        key: "account",
        label: (
          <div onClick={() => setShowManageAccount(true)}>
            Quản lý tài khoản
          </div>
        ),
      },
      {
        key: "vouchers",
        label: <Link to="/vouchers">Kho Voucher</Link>,
      },
      {
        key: "history",
        label: <Link to="/history">Lịch sử mua hàng</Link>,
      },
      {
        key: "logout",
        label: <div onClick={handleLogout}>Đăng xuất</div>,
      },
    ];
  };

  // Sử dụng hàm tạo menu items
  const items = generateMenuItems();

  // Tạo nội dung Popover hiển thị giỏ hàng
  const contentPopover = (
    <div
      style={{
        maxHeight: "300px",
        overflowY: "auto",
        width: "400px",
        position: "relative",
      }}
    >
      {cartItems.length > 0 ? (
        <>
          <List
            itemLayout="horizontal"
            dataSource={cartItems}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Carousel
                      autoplay
                      dots={false}
                      arrows
                      style={{ width: 60 }}
                    >
                      {item.detail.image?.map((img: any, idx: number) => (
                        <div key={idx}>
                          <img
                            src={getImageUrl(img.url)}
                            alt={img.altText || "Ảnh sản phẩm"}
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </Carousel>
                  }
                  title={<span>{item.detail.name}</span>}
                  description={
                    <>
                      <span>Số lượng: {item.quantity}</span>
                      <br />
                      <span>
                        Giá:{" "}
                        {(item.detail.price * item.quantity).toLocaleString()}₫
                      </span>
                    </>
                  }
                />
              </List.Item>
            )}
          />
          <div
            style={{
              position: "sticky",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "10px",
              borderTop: "1px solid #f0f0f0",
              backgroundColor: "#fff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>
              Tổng cộng:{" "}
              <strong>
                {cartItems
                  .reduce(
                    (total, item) => total + item.detail.price * item.quantity,
                    0
                  )
                  .toLocaleString()}
                ₫
              </strong>
            </span>
            <button
              onClick={() => navigate("/cart")}
              style={{
                backgroundColor: "#1890ff",
                color: "#fff",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Xem giỏ hàng ({cartItems.length})
            </button>
          </div>
        </>
      ) : (
        <Empty description="Không có sản phẩm trong giỏ hàng" />
      )}
    </div>
  );

  return (
    <>
      <div className="header-container">
        <header className="page-header">
          <div className="page-header__top">
            <div className="page-header__logo">
              <span className="logo">
                <span onClick={() => navigate("/")}>
                  <img
                    src="/logo-new.webp"
                    alt="Logo"
                    style={{ marginRight: 30 }}
                    height={50}
                  />
                </span>
                <VscSearchFuzzy className="icon-search" />
              </span>
              <input
                className="input-search"
                type="text"
                placeholder="Hôm nay bạn muốn ăn gì?"
                value={props.searchTerm}
                style={{
                  width: "100%",
                  borderRadius: "5px",
                  height: "40px",
                  padding: "0 10px",
                }}
                onChange={(e) => props.setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <nav className="page-header__bottom">
            <ul id="navigation" className="navigation">
              <li className="navigation__item">
                <Popover
                  className="popover-carts"
                  placement="topRight"
                  rootClassName="popover-carts"
                  title="Sản phẩm mới thêm"
                  content={contentPopover}
                  arrow={true}
                >
                  <Badge count={cartItems.length ?? 0} size="small" showZero>
                    <FiShoppingCart
                      className="icon-cart"
                      onClick={() => navigate("/cart")}
                    />
                  </Badge>
                </Popover>
              </li>
              <li className="navigation__item mobile">
                <Divider type="vertical" />
              </li>
              <li className="navigation__item mobile">
                {!isAuthenticated ? (
                  <span onClick={() => navigate("/login")}>Đăng nhập</span>
                ) : (
                  <Dropdown
                    key={isAuthenticated}
                    menu={{ items }}
                    trigger={["click"]}
                  >
                    <Space>
                      <Avatar src={user?.avatar} />
                      {user?.fullName}
                    </Space>
                  </Dropdown>
                )}
              </li>
            </ul>
          </nav>
        </header>
      </div>
      <Drawer
        title="Menu chức năng"
        placement="left"
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
      >
        <p onClick={() => setShowManageAccount(true)}>Quản lý tài khoản</p>
        <Divider />
        <p onClick={() => navigate("/vouchers")}>Kho Voucher</p>
        <Divider />
        <p onClick={() => navigate("/history")}>Lịch sử mua hàng</p>
        <Divider />
        <p onClick={handleLogout}>Đăng xuất</p>
        <Divider />
      </Drawer>
      <ManageAccount
        isModalOpen={showManageAccount}
        setIsModalOpen={setShowManageAccount}
      />
    </>
  );
};

export default Header;
