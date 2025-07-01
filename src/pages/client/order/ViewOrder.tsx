import { Checkbox, Col, Divider, Empty, InputNumber, Row } from "antd";
import { DeleteTwoTone } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  doDeleteItemCartAction,
  doUpdateCartAction,
  doSetSelectedProductsAction,
  CartItem,
} from "../../../redux/order/orderSlice";
import { getImageUrl } from "~/config/config";
import { Check } from "@mui/icons-material";

interface ViewOrderProps {
  setCurrentStep: (step: number) => void;
}

const ViewOrder = ({ setCurrentStep }: ViewOrderProps) => {
  const carts = useSelector((state: any) => state.order.carts) as CartItem[];
  const selectedProducts = useSelector(
    (state: any) => state.order.selectedProducts
  ) as CartItem[];

  const [totalPrice, setTotalPrice] = useState(0);
  const [checkedProductIds, setCheckedProductIds] = useState<string[]>([]);
  const [isAllChecked, setIsAllChecked] = useState(false); // Trạng thái chọn tất cả

  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedProducts && selectedProducts.length > 0) {
      const sum = selectedProducts.reduce(
        (acc: number, item: CartItem) =>
          acc + item.quantity * item.detail.price,
        0
      );
      setTotalPrice(sum);
    } else {
      setTotalPrice(0);
    }
  }, [selectedProducts]);

  useEffect(() => {
    setCheckedProductIds(selectedProducts.map((item) => item.id));
    setIsAllChecked(
      carts.length > 0 &&
        carts.every((item) => checkedProductIds.includes(item.id))
    ); // Cập nhật trạng thái chọn tất cả
  }, [selectedProducts, carts, checkedProductIds]);

  const handleOnChangeInput = (value: number | null, product: CartItem) => {
    if (!value || value < 1) return;
    if (!isNaN(value)) {
      dispatch(
        doUpdateCartAction({
          quantity: value,
          detail: product.detail,
          id: product.id,
        })
      );
      const updatedProducts = selectedProducts.map((item) => {
        if (item.id === product.id) {
          return {
            ...item,
            quantity: value,
          };
        }
        return item;
      });
      dispatch(doSetSelectedProductsAction({ products: updatedProducts }));
    }
  };

  const handleToggleCheck = (product: CartItem) => {
    if (checkedProductIds.includes(product.id)) {
      setCheckedProductIds(
        checkedProductIds.filter((item) => item !== product.id)
      );
      dispatch(
        doSetSelectedProductsAction({
          products: selectedProducts.filter((item) => item.id !== product.id),
        })
      );
    } else {
      setCheckedProductIds([...checkedProductIds, product.id]);
      dispatch(
        doSetSelectedProductsAction({
          products: [...selectedProducts, product],
        })
      );
    }
  };

  const handleToggleAll = (e: any) => {
    const checked = e.target.checked;
    setIsAllChecked(checked);
    if (checked) {
      const allProductIds = carts.map((item) => item.id);
      setCheckedProductIds(allProductIds);
      dispatch(doSetSelectedProductsAction({ products: [...carts] }));
    } else {
      setCheckedProductIds([]);
      dispatch(doSetSelectedProductsAction({ products: [] }));
    }
  };

  return (
    <Row gutter={[20, 20]}>
      <Col md={18} xs={24}>
        {/* Thêm checkbox "Chọn tất cả" */}
        {carts.length > 0 && (
          <div style={{ marginBottom: 10 }}>
            <Checkbox checked={isAllChecked} onChange={handleToggleAll}>
              Chọn tất cả
            </Checkbox>
          </div>
        )}
        {carts?.map((product: any, index: number) => {
          const currentProductPrice = product?.detail?.price ?? 0;
          return (
            <div className="order-product" key={`index-${index}`}>
              <div className="product-content">
                <Checkbox
                  type="checkbox"
                  checked={checkedProductIds.includes(product.id)}
                  onChange={() => handleToggleCheck(product)}
                  style={{ marginRight: 8 }}
                />
                <div className="image-container">
                  <img
                    src={getImageUrl(product?.detail?.image?.[0]?.url)}
                    alt="product Thumbnail"
                  />
                </div>
                <div className="title">{product?.detail?.name}</div>
                <div className="price">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(currentProductPrice)}
                </div>
              </div>
              <div className="action">
                <div className="quantity">
                  <InputNumber
                    min={1}
                    max={product?.detail?.quantity}
                    onChange={(value) => handleOnChangeInput(value, product)}
                    value={product.quantity}
                  />
                </div>
                <div className="sum">
                  Tổng:{" "}
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(currentProductPrice * (product?.quantity ?? 0))}
                </div>
                <DeleteTwoTone
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    dispatch(doDeleteItemCartAction({ id: product.id }))
                  }
                  twoToneColor="#eb2f96"
                />
              </div>
            </div>
          );
        })}
        {carts.length === 0 && (
          <div className="order-product-empty">
            <Empty description="Không có sản phẩm trong giỏ hàng" />
          </div>
        )}
      </Col>
      <Col md={6} xs={24}>
        <div className="order-sum">
          <div className="calculate">
            <span>Tạm tính</span>
            <span>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(totalPrice || 0)}
            </span>
          </div>
          <Divider style={{ margin: "10px 0" }} />
          <div className="calculate">
            <span>Tổng tiền</span>
            <span className="sum-final">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(totalPrice || 0)}
            </span>
          </div>
          <Divider style={{ margin: "10px 0" }} />
          <button
            disabled={checkedProductIds.length === 0}
            onClick={() => {
              const selected = carts.filter((item) =>
                checkedProductIds.includes(item.id)
              );
              dispatch(doSetSelectedProductsAction({ products: selected }));
              setCurrentStep(1);
            }}
          >
            Mua Hàng ({checkedProductIds.length})
          </button>
        </div>
      </Col>
    </Row>
  );
};

export default ViewOrder;
