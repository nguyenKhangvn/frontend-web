import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ViewDetail from "~/pages/client/product/ViewDetail";
import { productApi } from "~/services/axios.product";
import { getImageUrl } from "~/config/config";

const ProductPage = () => {
  const [dataProduct, setDataProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const slug = params.get("slug");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        if (!slug) {
          console.error("Không tìm thấy slug sản phẩm");
          setLoading(false);
          return;
        }

        console.log("Fetching product with slug:", slug);
        const res = await productApi.callFetchProductBySlug(slug);

        if (res && res.data) {
          const raw = res.data;
          raw.items = getImages(raw);
          setDataProduct(raw);
        } else {
          console.error("Không tìm thấy sản phẩm với slug:", slug);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const getImages = (raw: any) => {
    interface Image {
      original: string;
      thumbnail: string;
    }

    const images: Image[] = [];
    if (raw.images && Array.isArray(raw.images)) {
      raw.images.forEach((image: { id: number; url: string }) => {
        images.push({
          original: getImageUrl(image.url),
          thumbnail: getImageUrl(image.url),
        });
      });
    }

    return images;
  };

  return (
    <>
      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <p>Đang tải sản phẩm...</p>
        </div>
      ) : dataProduct ? (
        <ViewDetail dataProduct={dataProduct} />
      ) : (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <p>Không tìm thấy sản phẩm</p>
        </div>
      )}
    </>
  );
};

export default ProductPage;
