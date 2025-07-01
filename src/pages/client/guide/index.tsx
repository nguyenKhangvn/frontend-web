import { Card, List, Typography, Divider } from "antd";

const { Title, Paragraph } = Typography;

const Guide = () => {
  const steps = [
    {
      title: "Truy cập website",
      description: (
        <div>
          <Paragraph>
            Vào trang web chính thức tại{" "}
            <a href="/" className="text-blue-500 hover:underline">
              www.hoanggia.com
            </a>
            .
          </Paragraph>
          <Paragraph>
            Lưu ý: Hãy đảm bảo bạn truy cập đúng địa chỉ để tránh các trang giả
            mạo. Sử dụng trình duyệt an toàn và kiểm tra chứng chỉ SSL.
          </Paragraph>
        </div>
      ),
    },
    {
      title: "Tìm kiếm và chọn sản phẩm",
      description: (
        <div>
          <Paragraph>
            Duyệt qua danh mục sản phẩm như Yến Sào, Trầm Hương, hoặc các sản
            phẩm cao cấp khác.
          </Paragraph>
          <Paragraph>
            Sử dụng bộ lọc để tìm sản phẩm theo giá, loại, hoặc đánh giá. Nhấn
            "Thêm vào giỏ hàng" khi tìm được sản phẩm ưng ý.
          </Paragraph>
        </div>
      ),
    },
    {
      title: "Thanh toán",
      description: (
        <div>
          <Paragraph>
            Điền thông tin giao hàng (tên, địa chỉ, số điện thoại) và chọn
            phương thức thanh toán (COD, chuyển khoản ngân hàng, ví điện tử).
          </Paragraph>
          <Paragraph>
            Kiểm tra kỹ thông tin trước khi xác nhận đơn hàng để tránh sai sót.
          </Paragraph>
        </div>
      ),
    },
    {
      title: "Xác nhận đơn hàng",
      description: (
        <div>
          <Paragraph>
            Sau khi đặt hàng, bạn sẽ nhận được xem mã đơn hàng và thông tin giao
            hàng.
          </Paragraph>
          <Paragraph>
            Liên hệ ngay với chúng tôi nếu không nhận được xác nhận trong vòng
            24 giờ.
          </Paragraph>
        </div>
      ),
    },
    {
      title: "Nhận hàng",
      description: (
        <div>
          <Paragraph>
            Sản phẩm sẽ được giao trong 2-5 ngày làm việc, tùy thuộc vào khu vực
          </Paragraph>
          <Paragraph>
            Kiểm tra kỹ sản phẩm khi nhận và liên hệ hotline nếu có vấn đề.
          </Paragraph>
        </div>
      ),
    },
  ];

  return (
    <main
      style={{ padding: "32px 16px", maxWidth: "1200px", margin: "0 auto" }}
    >
      <Title
        level={2}
        style={{ textAlign: "center", color: "#1a1a1a", marginBottom: "24px" }}
      >
        Hướng dẫn mua hàng
      </Title>
      <Card
        bordered={false}
        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderRadius: "8px" }}
      >
        <Title level={4} style={{ color: "#1a1a1a", marginBottom: "16px" }}>
          Các bước đặt hàng tại Yến Sào Trầm Hương Hoàng Gia
        </Title>
        <List
          itemLayout="horizontal"
          dataSource={steps}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "#1890ff",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    {index + 1}
                  </span>
                }
                title={
                  <span style={{ fontWeight: 500, color: "#1a1a1a" }}>
                    {item.title}
                  </span>
                }
                description={item.description}
              />
            </List.Item>
          )}
        />
        <Divider />
        <Paragraph style={{ textAlign: "center", color: "#595959" }}>
          Nếu bạn cần hỗ trợ, vui lòng liên hệ qua hotline{" "}
          <strong>0905 123 456</strong> hoặc email{" "}
          <strong>contact@hoanggia.com</strong>.
        </Paragraph>
      </Card>
    </main>
  );
};

export default Guide;
