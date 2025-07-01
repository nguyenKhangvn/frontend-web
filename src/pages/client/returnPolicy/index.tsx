import { Card, List, Typography, Divider } from "antd";

const { Title, Paragraph } = Typography;

const ReturnPolicy = () => {
  const conditions = [
    "Sản phẩm còn nguyên vẹn, chưa qua sử dụng, còn nguyên tem mác và hóa đơn mua hàng.",
    "Thời gian đổi trả: Trong vòng 7 ngày kể từ ngày nhận hàng (tính theo dấu bưu điện hoặc biên nhận giao hàng).",
    "Sản phẩm lỗi do nhà sản xuất (ví dụ: hư hỏng, thiếu phụ kiện) hoặc lỗi trong quá trình vận chuyển.",
    "Không áp dụng đổi trả cho các sản phẩm khuyến mãi, giảm giá đặc biệt, hoặc sản phẩm đã được sử dụng.",
  ];

  const process = [
    "Liên hệ với chúng tôi qua hotline <strong>0905 123 456</strong> hoặc email <strong>contact@hoanggia.com</strong> để thông báo yêu cầu đổi trả.",
    "Cung cấp thông tin đơn hàng (mã đơn, ngày đặt hàng) và lý do đổi trả kèm hình ảnh sản phẩm nếu có.",
    "Gửi sản phẩm về địa chỉ: <strong>123 Lê Lợi, Quy Nhơn, Bình Định</strong>. Vui lòng đóng gói cẩn thận để tránh hư hỏng thêm.",
    "Chúng tôi sẽ kiểm tra và xử lý yêu cầu trong vòng 3-5 ngày làm việc. Sản phẩm thay thế hoặc hoàn tiền sẽ được thực hiện ngay sau khi xác nhận.",
  ];

  return (
    <main
      style={{ padding: "32px 16px", maxWidth: "1200px", margin: "0 auto" }}
    >
      <Title
        level={2}
        style={{ textAlign: "center", color: "#1a1a1a", marginBottom: "24px" }}
      >
        Chính sách đổi trả
      </Title>
      <Card
        bordered={false}
        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderRadius: "8px" }}
      >
        <Title level={4} style={{ color: "#1a1a1a", marginBottom: "16px" }}>
          Điều kiện đổi trả
        </Title>
        <List
          dataSource={conditions}
          renderItem={(item) => (
            <List.Item>
              <Paragraph style={{ color: "#595959" }}>
                <span style={{ color: "#1890ff" }}>•</span> {item}
              </Paragraph>
            </List.Item>
          )}
        />
        <Divider />
        <Title level={4} style={{ color: "#1a1a1a", marginBottom: "16px" }}>
          Quy trình đổi trả
        </Title>
        <List
          dataSource={process}
          renderItem={(item, index) => (
            <List.Item>
              <Paragraph style={{ color: "#595959" }}>
                <span style={{ fontWeight: 500, marginRight: "8px" }}>
                  {index + 1}.
                </span>
                <span dangerouslySetInnerHTML={{ __html: item }} />
              </Paragraph>
            </List.Item>
          )}
        />
        <Divider />
        <Paragraph style={{ color: "#595959" }}>
          <strong>Lưu ý:</strong> Chi phí vận chuyển đổi trả do khách hàng chi
          trả, trừ trường hợp lỗi từ phía chúng tôi. Vui lòng liên hệ để được
          hướng dẫn chi tiết.
        </Paragraph>
      </Card>
    </main>
  );
};

export default ReturnPolicy;
