import { Row, Col, Rate, Divider, Breadcrumb } from "antd";
import "./ViewDetail.scss";
import ImageGallery from "react-image-gallery";
import { useRef, useState, useEffect } from "react";
import ModalGallery from "./ModalGallery";
import { MinusOutlined, PlusOutlined, HomeOutlined } from "@ant-design/icons";
import { BsCartPlus } from "react-icons/bs";
import ProductLoader from "./ProductLoader";
import { useDispatch, useSelector } from "react-redux";
import {
  CartItem,
  doAddProductAction,
  doSetSelectedProductsAction,
} from "../../../redux/order/orderSlice";
import { Link, useNavigate } from "react-router-dom";
import { getImageUrl } from "../../../config/config";
import ProductReviews from "./ProductReviews"; // Import the new component
import { Flip, toast } from "react-toastify";

interface ViewDetailProps {
  dataProduct: {
    id: string;
    name: string;
    description: string;
    price: number;
    isActive: boolean;
    categoryName: string;
    manufacturerName: string;
    discountName: string | null;
    slug: string;
    quantity: number | null;
    sold: number | null;
    images: {
      id: string;
      productId: string;
      url: string;
      altText: string;
      displayOrder: number;
    }[];
  };
}

const ViewDetail = ({ dataProduct }: ViewDetailProps) => {
  const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const [hasPurchased, setHasPurchased] = useState(false);
  const refGallery = useRef<any>(null);
  const images =
    dataProduct?.images?.map((image) => {
      return {
        original: getImageUrl(image.url),
        thumbnail: getImageUrl(image.url),
        alt: image.altText,
      };
    }) ?? [];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const carts = useSelector((state: any) => state.order.carts) as CartItem[];
  const currentUser = useSelector((state: any) => state.account?.user);

  // Check if user has purchased this product
  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (currentUser?.id && dataProduct?.id) {
        try {
          const response = await fetch(
            `/api/orders/check-purchase/${dataProduct.id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setHasPurchased(data.hasPurchased);
          }
        } catch (error) {
          console.error("Failed to check purchase status:", error);
        }
      }
    };

    checkPurchaseStatus();
  }, [currentUser?.id, dataProduct?.id]);

  const handleOnClickImage = () => {
    setIsOpenModalGallery(true);
    setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0);
    navigate(`/product/${dataProduct.id}`);
  };

  const handleChangeButton = (type: "MINUS" | "PLUS") => {
    if (type === "MINUS") {
      if (currentQuantity - 1 <= 0) return;
      setCurrentQuantity((prev) => prev - 1);
    }
    if (type === "PLUS") {
      if (
        dataProduct.quantity !== null &&
        currentQuantity >= dataProduct.quantity
      )
        return;
      setCurrentQuantity((prev) => prev + 1);
    }
  };

  const handleChangeInput = (value: string) => {
    const parsedValue = parseInt(value, 10);
    if (
      !isNaN(parsedValue) &&
      parsedValue > 0 &&
      (dataProduct.quantity === null || parsedValue <= dataProduct.quantity)
    ) {
      setCurrentQuantity(parsedValue);
    }
  };

  const handleAddToCart = (quantity: number, product: any) => {
    if (product.quantity === 0) {
      toast.error("Sản phẩm đã hết hàng", {
        autoClose: 1000,
        transition: Flip,
      });
      return;
    }

    const productDetail = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      image: product.images || [],
    };

    dispatch(
      doAddProductAction({ quantity, detail: productDetail, id: product.id })
    );
  };

  const handleBuyNow = (quantity: number, product: any) => {
    const productDetail = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      image: product.images || [],
    };

    dispatch(
      doAddProductAction({ quantity, detail: productDetail, id: product.id })
    );
    let updatedProducts;
    const existingProduct = carts.find((item) => item.id === product.id);

    if (existingProduct) {
      updatedProducts = {
        ...existingProduct,
        quantity: existingProduct.quantity + quantity,
      };
    } else {
      updatedProducts = { id: product.id, quantity: quantity };
    }

    dispatch(
      doSetSelectedProductsAction({
        products: [
          {
            id: updatedProducts.id,
            quantity: updatedProducts.quantity,
            detail: productDetail,
          },
        ],
      })
    );
    navigate("/orders");
  };

  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      <div
        className="view-detail-Product"
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          minHeight: "calc(100vh - 150px)",
        }}
      >
        <Breadcrumb
          style={{ margin: "5px 0" }}
          items={[
            {
              title: <HomeOutlined />,
            },
            {
              title: (
                <Link to="/">
                  <span>Trang Chủ</span>
                </Link>
              ),
            },
          ]}
        />
        <div style={{ padding: "20px", background: "#fff", borderRadius: 5 }}>
          {dataProduct && dataProduct.id ? (
            <>
              <Row gutter={[20, 20]}>
                <Col md={10} sm={0} xs={0}>
                  <ImageGallery
                    ref={refGallery}
                    items={images}
                    showPlayButton={false}
                    showFullscreenButton={false}
                    renderLeftNav={() => <></>}
                    renderRightNav={() => <></>}
                    slideOnThumbnailOver={true}
                    onClick={handleOnClickImage}
                  />
                </Col>
                <Col md={14} sm={24}>
                  <Col md={0} sm={24} xs={24}>
                    <ImageGallery
                      ref={refGallery}
                      items={images}
                      showPlayButton={false}
                      showFullscreenButton={false}
                      renderLeftNav={() => <></>}
                      renderRightNav={() => <></>}
                      showThumbnails={false}
                    />
                  </Col>
                  <Col span={24}>
                    <div className="manufacturerName">
                      Nhà cung cấp:{" "}
                      <a href="#">{dataProduct?.manufacturerName}</a>
                    </div>
                    <div className="title">{dataProduct?.name}</div>
                    <div className="rating">
                      <Rate
                        value={5}
                        disabled
                        style={{ color: "#ffce3d", fontSize: 12 }}
                      />
                      <span className="sold">
                        <Divider type="vertical" />
                        Đã bán {dataProduct.sold}
                      </span>
                    </div>
                    <div className="price">
                      <span className="currency">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(dataProduct?.price ?? 0)}
                      </span>
                    </div>
                    <div className="delivery">
                      <div>
                        <span className="left-side">Vận chuyển</span>
                        <span className="right-side">Miễn phí vận chuyển</span>
                      </div>
                    </div>
                    <div className="quantity">
                      <span className="left-side">Số lượng</span>
                      <span className="right-side">
                        <div
                          className="stock-info"
                          style={{
                            marginTop: "8px",
                            color: "#888",
                            marginRight: 10,
                          }}
                        >
                          {dataProduct.quantity === 0 ? (
                            <span className="out-of-stock">Hết hàng</span>
                          ) : dataProduct.quantity !== null ? (
                            <span>{dataProduct.quantity} sản phẩm có sẵn</span>
                          ) : (
                            <span>Không giới hạn số lượng</span>
                          )}
                        </div>
                        <button onClick={() => handleChangeButton("MINUS")}>
                          <MinusOutlined />
                        </button>
                        <input
                          type="number"
                          min="1"
                          max={dataProduct.quantity || undefined}
                          onChange={(event) =>
                            handleChangeInput(event.target.value)
                          }
                          value={currentQuantity}
                        />
                        <button onClick={() => handleChangeButton("PLUS")}>
                          <PlusOutlined />
                        </button>
                      </span>
                    </div>

                    <div className="buy">
                      <button
                        className="cart"
                        onClick={() =>
                          handleAddToCart(currentQuantity, dataProduct)
                        }
                      >
                        <BsCartPlus className="icon-cart" />
                        <span>Thêm vào giỏ hàng</span>
                      </button>

                      <button
                        className="now"
                        onClick={() =>
                          handleBuyNow(currentQuantity, dataProduct)
                        }
                      >
                        Mua ngay
                      </button>
                    </div>
                  </Col>
                </Col>
              </Row>

              {/* Phần mô tả sản phẩm */}
              <div
                style={{
                  marginTop: "20px",
                  padding: "20px",
                  background: "#f9f9f9",
                  borderRadius: "5px",
                }}
              >
                <h3>Mô tả sản phẩm</h3>
                <p style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>
                  {dataProduct.description ||
                    "Không có mô tả cho sản phẩm này."}
                </p>
              </div>

              {/* Add the Product Reviews component */}
              {dataProduct && dataProduct.id && (
                <ProductReviews productId={dataProduct.id} />
              )}
            </>
          ) : (
            <ProductLoader />
          )}
        </div>
      </div>
      <ModalGallery
        isOpen={isOpenModalGallery}
        setIsOpen={setIsOpenModalGallery}
        currentIndex={currentIndex}
        items={images}
        title={dataProduct?.name}
      />
    </div>
  );
};

export default ViewDetail;
