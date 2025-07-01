import { Card, Form, Input, Button, Typography, Row, Col } from "antd";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const Contact = () => {
  return (
    <main
      style={{ padding: "32px 16px", maxWidth: "1200px", margin: "0 auto" }}
    >
      <Title
        level={2}
        style={{ textAlign: "center", color: "#1a1a1a", marginBottom: "24px" }}
      >
        Liên hệ với chúng tôi
      </Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card
            bordered={false}
            style={{
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              borderRadius: "8px",
              height: "100%",
            }}
          >
            <Title level={4} style={{ color: "#1a1a1a", marginBottom: "16px" }}>
              Thông tin liên hệ
            </Title>
            <Paragraph style={{ color: "#595959" }}>
              <strong>Địa chỉ:</strong> 55 Trần Bình Trọng - Phường Lê Lợi - TP.
              Quy Nhơn - Bình Định
            </Paragraph>
            <Paragraph style={{ color: "#595959" }}>
              <strong>Hotline:</strong> 0939 200 779 (8:00 - 17:00, Thứ 2 - Thứ
              7)
            </Paragraph>
            <Paragraph style={{ color: "#595959" }}>
              <strong>Email:</strong> contact@hoanggia.com
            </Paragraph>
            <Paragraph style={{ color: "#595959" }}>
              <strong>Thời gian phản hồi:</strong> Trong vòng 24 giờ làm việc
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            bordered={false}
            style={{
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              borderRadius: "8px",
              height: "100%",
            }}
          >
            <Title level={4} style={{ color: "#1a1a1a", marginBottom: "16px" }}>
              Gửi tin nhắn
            </Title>
            <Form layout="vertical">
              <Form.Item
                label="Họ và tên"
                name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập họ và tên!" },
                ]}
              >
                <Input placeholder="Nhập họ và tên" size="large" />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Vui lòng nhập email hợp lệ!",
                  },
                ]}
              >
                <Input placeholder="Nhập email" size="large" />
              </Form.Item>
              <Form.Item
                label="Nội dung"
                name="message"
                rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
              >
                <TextArea placeholder="Nhập nội dung tin nhắn" rows={4} />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  style={{ width: "100%", borderRadius: "8px" }}
                >
                  Gửi tin nhắn
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </main>
  );
};

export default Contact;
