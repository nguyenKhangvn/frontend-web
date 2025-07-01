import { Button, Checkbox, Col, Drawer, Form, InputNumber, Rate, Row, Divider } from "antd";

interface MobileFilterProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    handleChangeFilter: (changedValues: any, values: any) => void;
    listCategory: { value: string; label: string }[];
    onFinish: (values: any) => void;
    form: any;
}


const MobileFilter  = ({ isOpen, setIsOpen, handleChangeFilter, listCategory, onFinish } : MobileFilterProps) => {
    const [form] = Form.useForm();

    return (
        <Drawer
            title="Lọc sản phẩm"
            placement="right"
            onClose={() => setIsOpen(false)}
            open={isOpen}
        >
            <Form
                onFinish={onFinish}
                form={form}
                onValuesChange={(changedValues, values) => handleChangeFilter(changedValues, values)}
            >
                <Form.Item
                    name="category"
                    label="Danh mục sản phẩm"
                    labelCol={{ span: 24 }}
                >
                    <Checkbox.Group>
                        <Row>
                            {listCategory?.length > 0 ? (
                                listCategory.map((item, index) => (
                                    <Col span={24} key={`index-${index}`} style={{ padding: '7px 0' }}>
                                        <Checkbox value={item.value}>
                                            {item.label}
                                        </Checkbox>
                                    </Col>
                                ))
                            ) : (
                                <Col span={24} style={{ padding: '7px 0' }}>
                                    <span>Không có danh mục nào</span>
                                </Col>
                            )}
                        </Row>
                    </Checkbox.Group>
                </Form.Item>
                <Divider />
                <Form.Item
                    label="Khoảng giá"
                    labelCol={{ span: 24 }}
                >
                    <Row gutter={[10, 10]} style={{ width: "100%" }}>
                        <Col xl={11} md={24}>
                            <Form.Item name={["range", 'from']} rules={[{ type: 'number', min: 0, message: 'Giá trị phải lớn hơn hoặc bằng 0' }]}>
                                <InputNumber
                                    min={0}
                                    placeholder="đ TỪ"
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col xl={2} md={0}>
                            <div> - </div>
                        </Col>
                        <Col xl={11} md={24}>
                            <Form.Item name={["range", 'to']} rules={[{ type: 'number', min: 0, message: 'Giá trị phải lớn hơn hoặc bằng 0' }]}>
                                <InputNumber
                                    min={0}
                                    placeholder="đ ĐẾN"
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <div>
                        <Button
                            onClick={() => {
                                form.submit();
                                setIsOpen(false);
                            }}
                            style={{ width: "100%" }}
                            type="primary"
                        >
                            Áp dụng
                        </Button>
                    </div>
                </Form.Item>
                <Divider />
                <Form.Item
                    label="Đánh giá"
                    labelCol={{ span: 24 }}
                >
                    {[5, 4, 3, 2, 1].map((value) => (
                        <div key={value}>
                            <Rate value={value} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                            <span className="ant-rate-text">{value > 1 ? 'trở lên' : ''}</span>
                        </div>
                    ))}
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default MobileFilter;