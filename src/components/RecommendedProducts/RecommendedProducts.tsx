import React, { useEffect, useState } from 'react';
import { Row, Col, Rate, Empty, Skeleton, Button } from 'antd';
import { productApi } from '../../services/axios.product';
import { ProductDto } from '../../types/product';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../config/config';
import './RecommendedProducts.scss';

interface RecommendedProductsProps {
    limit?: number;
    title?: string;
}

const RecommendedProducts = ({
    limit = 4,
    title = "Sản phẩm gợi ý cho bạn",
}: RecommendedProductsProps) => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRecommendedProducts = async () => {
        try {
            setLoading(true);
            const response = await productApi.getRecommendedProducts(limit);
            if (response.data) {
                setProducts(response.data);
            }
        } catch (err) {
            console.error("Error fetching recommended products:", err);
            setError("Không thể tải sản phẩm gợi ý. Vui lòng thử lại sau.");
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecommendedProducts();
    }, [limit]);

    const removeVietnameseTones = (str: string) => {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D");
    };

    const handleRedirectProduct = (product: ProductDto) => {
        const name = product.name ?? "";
        const id = product.id ?? "";
        productApi.trackProductClick(id).catch(console.error);
        const slug = removeVietnameseTones(name)
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
        navigate(`/products?slug=${slug}`);
    };

    const renderSkeletons = () => {
        const colSpans = { xs: 24, sm: 12, lg: 8, xl: 6 };
        return Array(limit)
            .fill(0)
            .map((_, index) => (
                <Col {...colSpans} key={`skeleton-${index}`}>
                    <div className="skeleton-wrapper">
                        <Skeleton.Image style={{ width: '100%', height: 160, marginBottom: 8 }} active />
                        <Skeleton active paragraph={{ rows: 2, width: ['80%', '50%'] }} title={false} />
                        <Skeleton active paragraph={{ rows: 1, width: ['30%'] }} title={false} style={{ marginTop: 8 }} />
                    </div>
                </Col>
            ));
    };

    const renderProductCard = (product: ProductDto) => {
        const colSpans = { xs: 24, sm: 12, lg: 8, xl: 6 };
        return (
            <Col {...colSpans} key={`product-${product.id}`}>
                <div className="product-wrapper" onClick={() => handleRedirectProduct(product)}>
                    <div className="product-thumbnail">
                        <img
                            src={getImageUrl(product.images?.[0].url || '')}
                            alt={product.name}
                            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                e.currentTarget.src = "/placeholder-image.jpg";
                            }}
                        />
                        {product.discountPercent > 0 && (
                            <span className="discount-badge">
                                -{product.discountPercent}%
                            </span>
                        )}
                    </div>
                    <div className="product-content">
                        <div className="product-name" title={product.name}>{product.name}</div>
                        <div className="product-price">
                            {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                            }).format(product.price ?? 0)}
                        </div>
                        <div className="product-rating">
                            <Rate
                                value={product.rating || 5}
                                disabled
                                allowHalf
                                style={{ fontSize: 12 }}
                            />
                            <span>Đã bán {product.sold || 0}</span>
                        </div>
                    </div>
                </div>
            </Col>
        );
    };

    return (
        <div className="recommended-products-container">
            <div className="recommended-products-header">
                <h2 className="recommended-products-title">{title}</h2>
            </div>
            {error && (
                <div style={{ color: 'red', marginBottom: 16 }}>
                    {error}
                </div>
            )}
            <Row gutter={[16, 16]}>
                {loading ? renderSkeletons() : products.map(renderProductCard)}
            </Row>
            {!loading && products.length === 0 && !error && (
                <Empty description="Không có sản phẩm gợi ý nào." style={{ marginTop: 24 }} />
            )}
        </div>
    );
};

export default RecommendedProducts;