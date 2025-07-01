import LayoutClient from "~/layout/client/LayoutDefault/LayoutDefault";
import Home from "../../pages/client/home";
import ProductPage from "~/pages/client/product";
import OrderPage from "~/pages/client/order";
import History from "~/pages/client/order/History";
import PaymentResponse from "~/pages/client/order/PaymentResponse";
import Cart from "~/pages/client/cart/cart";
import OrderDetails from "~/pages/client/order/OrderDetails";
import Vouchers from "~/pages/client/voucher";
import Guide from "~/pages/client/guide";
import Contact from "~/pages/client/contact";
import PrivacyPolicy from "~/pages/client/privacyPolicy";
import ReturnPolicy from "~/pages/client/returnPolicy";
const clientRoutes = {
  path: "/",
  element: <LayoutClient />,
  children: [
    { path: "", element: <Home /> },
    { path: "products", element: <ProductPage /> },
    { path: "orders", element: <OrderPage /> },
    { path: "orders/:orderCode", element: <OrderDetails /> },
    { path: "history", element: <History /> },
    { path: "orders/payment/response", element: <PaymentResponse /> },
    { path: "cart", element: <Cart /> },
    { path: "vouchers", element: <Vouchers /> },
    { path: "guide", element: <Guide /> },
    { path: "return-policy", element: <ReturnPolicy /> },
    { path: "privacy-policy", element: <PrivacyPolicy /> },
    { path: "contact", element: <Contact /> },
  ],
};

export default clientRoutes;
