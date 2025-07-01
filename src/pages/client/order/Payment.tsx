import {
  Col,
  Divider,
  Form,
  Radio,
  Row,
  message,
  notification,
  Input,
  Select,
  Button,
  Modal,
  Card,
  List,
  Checkbox,
} from "antd";
import {
  DeleteTwoTone,
  LoadingOutlined,
  PlusOutlined,
  CheckCircleFilled,
  PercentageOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  doDeleteItemCartAction,
  doPlaceOrderAction,
  doSelectVoucherAction,
} from "~/redux/order/orderSlice";
import { doSetSelectedAddressAction } from "~/redux/address/addressSlice";
import { orderApi } from "~/services/axios.order";
import { getImageUrl } from "~/config/config";
import { addressApi } from "~/services/axios.address";
import { paymentApi } from "~/services/axios.payment";
import { couponApi } from "~/services/axios.coupon";
import moment from "moment";
import Coupon from "~/types/coupon";
import "./Payment.css";
import Address from "~/types/address";
import { productApi } from "~/services/axios.product";

const { TextArea } = Input;

interface PaymentProps {
  setCurrentStep: (step: number) => void;
}

const formatAddress = (address: Address): string => {
  const parts = [
    address.streetAddress,
    address.ward,
    address.district,
    address.city,
    address.country,
  ].filter(Boolean);
  return parts.join(", ");
};

const Payment: React.FC<PaymentProps> = ({ setCurrentStep }) => {
  const dispatch = useDispatch();
  const selectedProducts = useSelector(
    (state: any) => state.order.selectedProducts
  );
  const user = useSelector((state: any) => state.account.user);
  const [totalPrice, setTotalPrice] = useState(0);
  const [shippingFee] = useState(30000); // Phí vận chuyển cố định 30k
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();
  const [addressForm] = Form.useForm();

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [shippingAddresses, setShippingAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  const [provinces, setProvinces] = useState<{ code: string; name: string }[]>(
    []
  );
  const [districts, setDistricts] = useState<{ code: string; name: string }[]>(
    []
  );
  const [wards, setWards] = useState<{ code: string; name: string }[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | undefined>();
  const [selectedDistrict, setSelectedDistrict] = useState<
    string | undefined
  >();
  const [isAddressDefault, setIsAddressDefault] = useState(false);
  const [isAddressDefaultBilling, setIsAddressDefaultBilling] = useState(false);

  // State cho voucher
  const [savedVouchers, setSavedVouchers] = useState<Coupon[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<Coupon | null>(null);
  const [isVoucherModalVisible, setIsVoucherModalVisible] = useState(false);
  // Tính tổng giá và áp dụng giảm giá
  useEffect(() => {
    if (selectedProducts && selectedProducts.length > 0) {
      const sum = selectedProducts.reduce(
        (acc: number, item: any) => acc + item.quantity * item.detail.price,
        0
      );
      setTotalPrice(sum);

      // Áp dụng giảm giá từ voucher
      if (selectedVoucher) {
        if (sum < selectedVoucher.minimumSpend) {
          message.warning(
            `Đơn hàng chưa đạt giá trị tối thiểu ${selectedVoucher.minimumSpend}k để sử dụng voucher!`
          );
          setSelectedVoucher(null);
          setDiscountAmount(0);
          setFinalPrice(sum + shippingFee); // Bao gồm phí vận chuyển
        } else {
          let discount = 0;

          if (selectedVoucher.discountType === "PERCENTAGE") {
            discount = (sum * selectedVoucher.value) / 100;
            const maxDiscount = selectedVoucher.value * 1000; // Giảm tối đa
            discount = Math.min(discount, maxDiscount);
          } else {
            discount = selectedVoucher.value * 1000; // Giảm giá cố định
          }
          setDiscountAmount(discount);
          setFinalPrice(sum + shippingFee - discount); // Bao gồm phí vận chuyển
        }
      } else {
        setDiscountAmount(0);
        setFinalPrice(sum + shippingFee); // Bao gồm phí vận chuyển
      }
    } else {
      setTotalPrice(0);
      setDiscountAmount(0);
      setFinalPrice(0);
    }
  }, [selectedProducts, selectedVoucher, shippingFee]);

  // Lấy danh sách voucher đã lưu
  useEffect(() => {
    const fetchSavedVouchers = async () => {
      if (!user?.id) return;
      try {
        const response = await couponApi.getSavedCoupons(user.id);
        setSavedVouchers(response.data);
      } catch {
        message.error("Không thể tải danh sách voucher đã lưu!");
      }
    };

    fetchSavedVouchers();
  }, [user?.id]);

  // Lấy danh sách địa chỉ giao hàng
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user?.id) return;

      try {
        const response = await addressApi.getByUserId(user.id);
        if (response) {
          const addresses: Address[] = response.map((addr: any) => ({
            id: addr.id || addr.Id,
            userId: addr.userId || addr.UserId,
            receiverName: addr.receiverName || addr.ReceiverName,
            receiverPhone: addr.receiverPhone || addr.ReceiverPhone,
            streetAddress: addr.streetAddress || addr.StreetAddress,
            ward: addr.ward || addr.Ward,
            district: addr.district || addr.District,
            city: addr.city || addr.City,
            country: addr.country || addr.Country || "Vietnam",
            postalCode: addr.postalCode || addr.PostalCode,
            isDefaultShipping: addr.isDefaultShipping || addr.IsDefaultShipping,
            isDefaultBilling: addr.isDefaultBilling || addr.IsDefaultBilling,
          }));

          setShippingAddresses(addresses);
          const defaultAddress = addresses.find(
            (addr) => addr.isDefaultShipping
          );
          setSelectedAddress(defaultAddress || addresses[0] || null);
          dispatch(
            doSetSelectedAddressAction({
              city: defaultAddress?.city,
              district: defaultAddress?.district,
              ward: defaultAddress?.ward,
            })
          );
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        notification.error({
          message: "Lỗi lấy địa chỉ",
          description: "Không thể lấy danh sách địa chỉ, vui lòng thử lại sau",
        });
      }
    };

    fetchAddresses();
  }, []);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await addressApi.getProvinces();
        if (data) setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

  const handleCityChange = async (cityCode: string) => {
    setSelectedCity(cityCode);
    setSelectedDistrict(undefined);
    setWards([]);
    addressForm.setFieldsValue({ district: undefined, ward: undefined });

    try {
      const data = await addressApi.getDistrictsByProvince(cityCode);
      if (data) setDistricts(data);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const handleDistrictChange = async (districtCode: string) => {
    setSelectedDistrict(districtCode);
    addressForm.setFieldsValue({ ward: undefined });

    try {
      const data = await addressApi.getWardsByDistrict(districtCode);
      if (data) setWards(data);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  const showAddressModal = () => {
    setIsAddressModalVisible(true);
  };

  const handleAddressModalCancel = () => {
    setIsAddressModalVisible(false);
    setIsAddingNewAddress(false);
    addressForm.resetFields();
  };

  const handleNewAddressClick = () => {
    setIsAddingNewAddress(true);
    setIsAddressModalVisible(true);
    addressForm.resetFields();
    addressForm.setFieldsValue({
      receiverName: user?.fullName || "",
      receiverPhone: user?.phone || "",
      country: "Vietnam",
    });
  };

  const handleSelectAddress = (address: Address) => {
    setSelectedAddress(address);
    dispatch(
      doSetSelectedAddressAction({
        city: address?.city,
        district: address?.district,
        ward: address?.ward,
      })
    );
    setIsAddressModalVisible(false);
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      await addressApi.setDefaultAddress(addressId);
      const updatedAddresses = shippingAddresses.map((addr) => ({
        ...addr,
        isDefaultShipping: addr.id === addressId,
      }));
      setShippingAddresses(updatedAddresses);
      if (selectedAddress?.id === addressId) {
        setSelectedAddress({ ...selectedAddress, isDefaultShipping: true });
      }
      message.success("Đã thiết lập địa chỉ mặc định");
    } catch (error) {
      console.error("Error setting default address:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể thiết lập địa chỉ mặc định",
      });
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await addressApi.delete(addressId);
      const updatedAddresses = shippingAddresses.filter(
        (addr) => addr.id !== addressId
      );
      setShippingAddresses(updatedAddresses);
      if (selectedAddress?.id === addressId) {
        const defaultAddress = updatedAddresses.find(
          (addr) => addr.isDefaultShipping
        );
        setSelectedAddress(defaultAddress || updatedAddresses[0] || null);
      }
      message.success("Đã xóa địa chỉ");
    } catch (error) {
      console.error("Error deleting address:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể xóa địa chỉ",
      });
    }
  };

  const handleAddAddress = async () => {
    try {
      const values = await addressForm.validateFields();
      const cityName = provinces.find((c) => c.code === values.city)?.name;
      const districtName = districts.find(
        (d) => d.code === values.district
      )?.name;
      const wardName = wards.find((w) => w.code === values.ward)?.name;

      const newAddress: Address = {
        userId: user?.id,
        receiverName: values.receiverName,
        receiverPhone: values.receiverPhone,
        streetAddress: values.streetAddress,
        city: cityName || values.city,
        district: districtName || values.district,
        ward: wardName || values.ward,
        country: values.country || "Vietnam",
        postalCode: values.postalCode,
        isDefaultShipping:
          values.isDefaultShipping || shippingAddresses.length === 0,
        isDefaultBilling: values.isDefaultBilling || false,
      };

      const response = await addressApi.create(newAddress);
      if (response) {
        const savedAddress = response;
        const updatedAddresses = [...shippingAddresses, savedAddress];
        setShippingAddresses(updatedAddresses);
        setSelectedAddress(savedAddress);
        setIsAddingNewAddress(false);
        setIsAddressModalVisible(false);
        addressForm.resetFields();
        message.success("Đã thêm địa chỉ mới");
      }
    } catch (error) {
      console.error("Error adding address:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể thêm địa chỉ mới",
      });
    }
  };

  // Hiển thị modal chọn voucher
  const showVoucherModal = () => {
    setIsVoucherModalVisible(true);
  };

  const handleVoucherModalCancel = () => {
    setIsVoucherModalVisible(false);
  };

  // Chọn voucher
  const handleSelectVoucher = (voucher: Coupon) => {
    setSelectedVoucher({
      ...voucher,
      discountType: voucher.discountType === 0 ? "PERCENTAGE" : "FIXED_AMOUNT",
    });
    setIsVoucherModalVisible(false);
    message.success(`Đã áp dụng voucher ${voucher.code}`);
  };

  // Hủy chọn voucher
  const handleRemoveVoucher = () => {
    setSelectedVoucher(null);
    setDiscountAmount(0);
    setFinalPrice(totalPrice + shippingFee); // Bao gồm phí vận chuyển
    message.info("Đã hủy voucher");
  };

  const onFinish = async () => {
    if (!selectedAddress || !selectedAddress.id) {
      notification.error({
        message: "Thiếu thông tin",
        description: "Vui lòng chọn địa chỉ giao hàng",
      });
      return;
    }

    setIsSubmit(true);
    const orderItems = selectedProducts.map((item: any) => ({
      productId: item.detail.id,
      productName: item.detail.mainText,
      quantity: item.quantity,
      price: item.detail.price,
    }));

    if (selectedVoucher) {
      dispatch(doSelectVoucherAction(selectedVoucher));
    }

    const orderCode = `ORDER-${Date.now()}`;

    const orderData = {
      orderCode: orderCode,
      userId: user?.id,
      shippingAddressId: selectedAddress.id,
      billingAddressId: selectedAddress.isDefaultBilling
        ? selectedAddress.id
        : undefined,
      totalAmount: finalPrice,
      notes: form.getFieldValue("notes"),
      orderItems: orderItems,
      status: "PENDING",
      paymentMethod: paymentMethod,
    };

    try {
      if (paymentMethod === "vnpay") {
        const paymentData = {
          orderCode: orderCode,
          fullName: user?.fullName,
          description: "Thanh toán đơn hàng",
          amount: finalPrice,
          createdDate: moment().format("YYYY-MM-DDTHH:mm:ss"),
        };

        const vnPayUrl = await paymentApi.createVnPayPayment(paymentData);
        if (vnPayUrl?.url) {
          window.location.href = vnPayUrl.url;
        } else {
          notification.error({
            message: "Lỗi",
            description: "Không thể tạo đơn hàng VNPay",
          });
        }
      }
      const res = await orderApi.createOrder(orderData);
      if (paymentMethod !== "vnpay") {
        if (selectedVoucher) {
          await couponApi.useAndDelete(selectedVoucher.id);
        }
        console.log("Đăth hàng thành công:", res);
        for (const item of orderItems) {
          await productApi.updateProductQuantity(item.productId, item.quantity); // Số lượng cần giảm
        }
        await paymentApi.createPayment(orderCode);
      }
      if (res?.data) {
        message.success("Đặt hàng thành công!");
        dispatch(doPlaceOrderAction({ orderItems, totalAmount: finalPrice }));
        setCurrentStep(2);
      } else {
        notification.error({
          message: "Đã có lỗi xảy ra",
          description: res?.message || "Không thể đặt hàng",
        });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: "Không thể kết nối đến máy chủ",
      });
    } finally {
      setIsSubmit(false);
    }
  };

  const handleAddressDefault = () => {
    setIsAddressDefault((prev) => !prev);
  };
  const handleAddressDefaultBilling = () => {
    setIsAddressDefaultBilling((prev) => !prev);
  };

  return (
    <Row gutter={[20, 20]}>
      <Col md={16} xs={24}>
        {/* Shipping Address Card */}
        <Card className="address-card" title="Địa chỉ giao hàng">
          {selectedAddress ? (
            <div className="selected-address">
              <div className="address-header">
                <span className="name">
                  <strong>{selectedAddress.receiverName} | </strong>
                </span>
                <span className="phone">
                  <strong>{selectedAddress.receiverPhone}</strong>
                </span>
                <div className="address">
                  <span className="address-home">Nhà</span>
                  {formatAddress(selectedAddress)}
                </div>
              </div>
              <Button type="link" onClick={showAddressModal}>
                Thay đổi
              </Button>
            </div>
          ) : (
            <div className="no-address">
              <p>Bạn chưa có địa chỉ giao hàng</p>
              <Button type="primary" onClick={handleNewAddressClick}>
                Thêm địa chỉ giao hàng
              </Button>
            </div>
          )}
        </Card>

        <Form form={form} layout="vertical">
          <Form.Item name="notes" label="Ghi chú đơn hàng">
            <TextArea
              rows={3}
              placeholder="Thêm ghi chú cho đơn hàng nếu cần"
            />
          </Form.Item>
        </Form>

        {/* Product List */}
        {selectedProducts?.map((product: any, index: number) => {
          const currentProductPrice = product?.detail?.price ?? 0;
          return (
            <div
              className="order-product"
              key={`product-${product.id || index}`}
            >
              <div className="product-content">
                <img
                  src={getImageUrl(product?.detail?.image?.[0]?.url)}
                  alt="product Thumbnail"
                />
                <div className="title">{product?.detail?.name}</div>
                <div className="price">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(currentProductPrice)}
                </div>
              </div>
              <div className="action">
                <div className="quantity">Số lượng: {product?.quantity}</div>
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
      </Col>
      <Col md={8} xs={24}>
        <div className="order-sum">
          {/* Voucher Selection */}
          <div className="voucher-section">
            <div className="voucher-header">
              <span>
                <PercentageOutlined
                  style={{ marginRight: 8, color: "#F28C38" }}
                />
                Voucher Giảm Giá
              </span>
              <button
                className="select-voucher-button"
                onClick={showVoucherModal}
              >
                {selectedVoucher ? "Thay đổi" : "Chọn voucher"}
              </button>
            </div>
            {selectedVoucher && (
              <div className="selected-voucher-card">
                <div className="voucher-info">
                  <span className="voucher-discount">
                    {selectedVoucher.discountType === "PERCENTAGE"
                      ? `Giảm ${selectedVoucher.value}% (Tối đa ${selectedVoucher.value * 1000}k)`
                      : `Giảm ${selectedVoucher.value}k`}
                  </span>
                  <span className="voucher-condition">
                    Đơn tối thiểu {selectedVoucher.minimumSpend}k
                  </span>
                </div>
                <CloseCircleOutlined
                  className="remove-voucher-icon"
                  onClick={handleRemoveVoucher}
                />
              </div>
            )}
          </div>
          <Divider style={{ margin: "5px 0" }} />

          <div className="info">
            <div className="method">
              <div>Hình thức thanh toán</div>
              <Radio.Group
                onChange={(e) => setPaymentMethod(e.target.value)}
                value={paymentMethod}
              >
                <Radio value="cod">Thanh toán khi nhận hàng</Radio>
                <Radio value="vnpay">Thanh toán qua VNPay</Radio>
              </Radio.Group>
            </div>
          </div>
          <Divider style={{ margin: "5px 0" }} />
          <div className="calculate">
            <div className="calculate-row">
              <span>Tổng tiền hàng:</span>
              <span>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(totalPrice || 0)}
              </span>
            </div>
            <div className="calculate-row">
              <span>Tổng tiền phí vận chuyển:</span>
              <span>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(shippingFee)}
              </span>
            </div>
            <div className="calculate-row">
              <span>Tổng tiền giảm giá:</span>
              <span className="discount-text">
                -{" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(discountAmount || 0)}
              </span>
            </div>
            <div className="calculate-row">
              <span>Tổng thanh toán:</span>
              <span className="sum-final">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(finalPrice || 0)}
              </span>
            </div>
          </div>
          <Divider style={{ margin: "5px 0" }} />
          <button onClick={onFinish} disabled={isSubmit || !selectedAddress}>
            {isSubmit && (
              <span>
                <LoadingOutlined />
              </span>
            )}
            Đặt Hàng ({selectedProducts?.length ?? 0})
          </button>
        </div>
      </Col>

      {/* Address Selection Modal */}
      <Modal
        title={
          isAddingNewAddress ? "Thêm địa chỉ mới" : "Chọn địa chỉ giao hàng"
        }
        open={isAddressModalVisible}
        onCancel={handleAddressModalCancel}
        footer={null}
        width={700}
      >
        {!isAddingNewAddress ? (
          <>
            <List
              dataSource={shippingAddresses}
              renderItem={(address) => (
                <List.Item
                  key={address.id}
                  actions={[
                    <Button
                      type="link"
                      onClick={() => handleSelectAddress(address)}
                      disabled={selectedAddress?.id === address.id}
                    >
                      {selectedAddress?.id === address.id ? "Đã chọn" : "Chọn"}
                    </Button>,
                    !address.isDefaultShipping && (
                      <Button
                        type="link"
                        onClick={() => handleSetDefaultAddress(address.id!)}
                      >
                        Đặt làm mặc định
                      </Button>
                    ),
                    <Button
                      danger
                      type="link"
                      onClick={() => handleDeleteAddress(address.id!)}
                    >
                      Xóa
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      address.isDefaultShipping ? (
                        <CheckCircleFilled
                          style={{ color: "#52c41a", fontSize: "20px" }}
                        />
                      ) : null
                    }
                    title={
                      <div>
                        <span className="receiver-name">
                          {address.receiverName}
                        </span>
                        <span className="receiver-phone">
                          {" "}
                          | {address.receiverPhone}
                        </span>
                        {address.isDefaultShipping && (
                          <span className="default-tag"> [Mặc định]</span>
                        )}
                      </div>
                    }
                    description={formatAddress(address)}
                  />
                </List.Item>
              )}
            />
            <div style={{ marginTop: 16, textAlign: "center" }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleNewAddressClick}
              >
                Thêm địa chỉ mới
              </Button>
            </div>
          </>
        ) : (
          <Form form={addressForm} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Tên người nhận"
                  name="receiverName"
                  initialValue={user?.fullName}
                  rules={[
                    {
                      required: true,
                      message: "Tên người nhận không được để trống!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập tên người nhận" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Số điện thoại người nhận"
                  name="receiverPhone"
                  initialValue={user?.phone}
                  rules={[
                    {
                      required: true,
                      message: "Số điện thoại không được để trống!",
                    },
                    {
                      pattern: /^[0-9]{10,11}$/,
                      message: "Số điện thoại không hợp lệ!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="Tỉnh/Thành phố"
                  name="city"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn tỉnh/thành phố!",
                    },
                  ]}
                >
                  <Select
                    placeholder="Chọn tỉnh/thành phố"
                    onChange={handleCityChange}
                    options={provinces.map((city) => ({
                      value: city.code,
                      label: city.name,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Quận/Huyện"
                  name="district"
                  rules={[
                    { required: true, message: "Vui lòng chọn quận/huyện!" },
                  ]}
                >
                  <Select
                    placeholder="Chọn quận/huyện"
                    onChange={handleDistrictChange}
                    disabled={!selectedCity}
                    options={districts.map((district) => ({
                      value: district.code,
                      label: district.name,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Phường/Xã"
                  name="ward"
                  rules={[
                    { required: true, message: "Vui lòng chọn phường/xã!" },
                  ]}
                >
                  <Select
                    placeholder="Chọn phường/xã"
                    disabled={!selectedDistrict}
                    options={wards.map((ward) => ({
                      value: ward.code,
                      label: ward.name,
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Địa chỉ chi tiết"
              name="streetAddress"
              rules={[
                {
                  required: true,
                  message: "Địa chỉ chi tiết không được để trống!",
                },
              ]}
            >
              <Input placeholder="Số nhà, tên đường, khu vực" />
            </Form.Item>

            <Form.Item label="Mã bưu điện (tùy chọn)" name="postalCode">
              <Input placeholder="Nhập mã bưu điện nếu có" />
            </Form.Item>

            <Form.Item label="Quốc gia" name="country" initialValue="Vietnam">
              <Input disabled />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="isDefaultShipping" valuePropName="checked">
                  <Checkbox
                    value={isAddressDefault}
                    onChange={handleAddressDefault}
                  >
                    Đặt làm địa chỉ giao hàng mặc định
                  </Checkbox>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="isDefaultBilling" valuePropName="checked">
                  <Checkbox
                    value={isAddressDefaultBilling}
                    onChange={() => handleAddressDefaultBilling()}
                  >
                    Đặt làm địa chỉ thanh toán mặc định
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>

            <div style={{ textAlign: "right" }}>
              <Button
                onClick={handleAddressModalCancel}
                style={{ marginRight: 8 }}
              >
                Hủy
              </Button>
              <Button type="primary" onClick={handleAddAddress}>
                Thêm địa chỉ
              </Button>
            </div>
          </Form>
        )}
      </Modal>

      {/* Voucher Selection Modal */}
      <Modal
        title="Chọn Voucher Giảm Giá"
        open={isVoucherModalVisible}
        onCancel={handleVoucherModalCancel}
        footer={null}
        width={700}
      >
        <div className="voucher-modal-list">
          {savedVouchers.length > 0 ? (
            savedVouchers.map((voucher) => {
              const isActive =
                voucher.isActive &&
                new Date(voucher.endTime || "") > new Date();
              const discountText =
                voucher.discountType === "PERCENTAGE"
                  ? `Giảm ${voucher.value}% (Tối đa ${voucher.value * 1000}k)`
                  : `Giảm ${voucher.value}k`;
              const canApply = isActive && totalPrice >= voucher.minimumSpend;

              return (
                <div
                  key={voucher.id}
                  className={`voucher-card-modal ${
                    canApply ? "voucher-active" : "voucher-inactive"
                  }`}
                >
                  <div className="voucher-left-modal">
                    <div className="voucher-icon-modal">🎟️</div>
                    <div className="voucher-category-modal">
                      {voucher.code || "Tổng Hợp"}
                    </div>
                  </div>
                  <div className="voucher-middle-modal">
                    <div className="voucher-discount-modal">{discountText}</div>
                    <div className="voucher-condition-modal">
                      Đơn tối thiểu {voucher.minimumSpend}k
                    </div>
                    <div className="voucher-expiry-modal">
                      HSD:{" "}
                      {voucher.endTime
                        ? new Date(voucher.endTime).toLocaleDateString("vi-VN")
                        : "N/A"}
                      {!isActive && (
                        <span className="expired-tag"> (Hết hạn)</span>
                      )}
                      {isActive && totalPrice < voucher.minimumSpend && (
                        <span className="not-eligible-tag">
                          {" "}
                          (Chưa đủ điều kiện)
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="voucher-right-modal">
                    <Button
                      className="apply-voucher-button"
                      onClick={() => handleSelectVoucher(voucher)}
                      disabled={!canApply}
                    >
                      Áp dụng
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-vouchers">
              <p>Bạn chưa có voucher nào!</p>
            </div>
          )}
        </div>
      </Modal>
    </Row>
  );
};

export default Payment;
