import DashboardIcon from "@mui/icons-material/Dashboard";
import ChatIcon from "@mui/icons-material/Chat";
import FactoryIcon from "@mui/icons-material/Factory";
import PostAddIcon from "@mui/icons-material/PostAdd";
import DiscountIcon from "@mui/icons-material/Discount";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import CategoryIcon from "@mui/icons-material/Category";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { type Navigation } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import LogoutButton from "../LogOutButton/LogOutButton";
import Avatar from "../Avatar/Avatar";

const NAVIGATION: Navigation = [
  {
    segment: "admin",
    title: "Tổng quan",
    icon: <DashboardIcon />,
  },
  {
    segment: "admin/users",
    title: "Quản lý người dùng",
    icon: <PersonOutlineIcon />,
  },
  {
    segment: "admin/products",
    title: "Quản lý sản phẩm",
    icon: <ProductionQuantityLimitsIcon />,
  },
  {
    segment: "admin/categories",
    title: "Quản lý danh mục",
    icon: <CategoryIcon />,
  },
  {
    segment: "admin/orders",
    title: "Quản lý đơn hàng",
    icon: <AddShoppingCartIcon />,
  },
  {
    segment: "admin/chat",
    title: "Hỗ trợ khách hàng",
    icon: <ChatIcon />,
  },
  {
    segment: "admin/manufactures",
    title: "Quản lý nhà sản xuất",
    icon: <FactoryIcon />,
  },
  {
    segment: "admin/posts",
    title: "Quản lý bài viết",
    icon: <PostAddIcon />,
  },
  {
    segment: "admin/coupons",
    title: "Quản lý mã giảm giá",
    icon: <DiscountIcon />,
  },
  {
    segment: "",
    title: "Quay về trang người dùng",
    icon: <PersonOutlineIcon />,
  },
];


function CustomAppTitle() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 20,
        fontWeight: 600,
      }}
    >
      Trang Quản Lý
    </Box>
  );
}

function AdminLayoutDefault() {
  return (
    <>
      <ReactRouterAppProvider navigation={NAVIGATION}>
        <DashboardLayout
          slots={{
            appTitle: CustomAppTitle,
            sidebarFooter: LogoutButton,
            toolbarActions: Avatar,
          }}
          sx={{
            bgcolor: "#FAFAFB",
            ".MuiBox-root.css-jrtdnu": {
              overflow: "hidden",
            },
          }}
        >
          <Outlet />
        </DashboardLayout>
      </ReactRouterAppProvider>
    </>
  );
}

export default AdminLayoutDefault;
