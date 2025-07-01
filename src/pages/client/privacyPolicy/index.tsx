import { Card, Typography, Divider } from "antd";

const { Title, Paragraph } = Typography;

const PrivacyPolicy = () => {
  return (
    <main
      style={{ padding: "32px 16px", maxWidth: "1200px", margin: "0 auto" }}
    >
      <Title
        level={2}
        style={{ textAlign: "center", color: "#1a1a1a", marginBottom: "24px" }}
      >
        Chính sách bảo mật
      </Title>
      <Card
        bordered={false}
        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderRadius: "8px" }}
      >
        <Title level={4} style={{ color: "#1a1a1a", marginBottom: "16px" }}>
          1. Thu thập thông tin
        </Title>
        <Paragraph style={{ color: "#595959" }}>
          Chúng tôi thu thập thông tin cá nhân bao gồm:
          <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
            <li>
              Họ tên, số điện thoại, email, địa chỉ giao hàng để xử lý đơn hàng.
            </li>
            <li>
              Thông tin thanh toán (không lưu trữ thông tin thẻ ngân hàng).
            </li>
            <li>
              Dữ liệu truy cập website (cookies, địa chỉ IP) để cải thiện trải
              nghiệm người dùng.
            </li>
          </ul>
          Thông tin được thu thập khi bạn đặt hàng, đăng ký tài khoản, hoặc liên
          hệ với chúng tôi.
        </Paragraph>
        <Divider />
        <Title level={4} style={{ color: "#1a1a1a", marginBottom: "16px" }}>
          2. Sử dụng thông tin
        </Title>
        <Paragraph style={{ color: "#595959" }}>
          Thông tin của bạn được sử dụng để:
          <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
            <li>Xử lý và giao hàng đúng thời gian.</li>
            <li>Cải thiện trải nghiệm người dùng trên website.</li>
            <li>Gửi thông tin khuyến mãi, ưu đãi (nếu bạn đồng ý nhận).</li>
            <li>Hỗ trợ khách hàng khi có thắc mắc hoặc khiếu nại.</li>
          </ul>
        </Paragraph>
        <Divider />
        <Title level={4} style={{ color: "#1a1a1a", marginBottom: "16px" }}>
          3. Bảo vệ thông tin
        </Title>
        <Paragraph style={{ color: "#595959" }}>
          Chúng tôi áp dụng các biện pháp bảo mật tiên tiến:
          <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
            <li>Mã hóa dữ liệu bằng giao thức SSL/TLS.</li>
            <li>Kiểm soát truy cập nội bộ nghiêm ngặt.</li>
            <li>Lưu trữ dữ liệu trên các máy chủ bảo mật cao.</li>
          </ul>
          Dữ liệu của bạn chỉ được lưu trữ trong thời gian cần thiết hoặc theo
          quy định pháp luật.
        </Paragraph>
        <Divider />
        <Title level={4} style={{ color: "#1a1a1a", marginBottom: "16px" }}>
          4. Chia sẻ thông tin
        </Title>
        <Paragraph style={{ color: "#595959" }}>
          Chúng tôi cam kết:
          <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
            <li>
              Không bán hoặc chia sẻ thông tin cá nhân với bên thứ ba vì mục
              đích thương mại.
            </li>
            <li>
              Chỉ chia sẻ với đối tác vận chuyển để giao hàng hoặc theo yêu cầu
              pháp luật.
            </li>
          </ul>
        </Paragraph>
        <Divider />
        <Paragraph style={{ textAlign: "center", color: "#595959" }}>
          Nếu có thắc mắc về chính sách bảo mật, vui lòng liên hệ qua email{" "}
          <strong>contact@hoanggia.com</strong> hoặc hotline{" "}
          <strong>0939 200 779</strong>.
        </Paragraph>
      </Card>
    </main>
  );
};

export default PrivacyPolicy;
