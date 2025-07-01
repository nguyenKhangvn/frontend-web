import { useState, useEffect, useRef } from "react";
import {
  Row,
  Col,
  Rate,
  Input,
  Button,
  Upload,
  Divider,
  Card,
  Avatar,
  message,
  Spin,
} from "antd";
import { StarOutlined, UserOutlined, UploadOutlined } from "@ant-design/icons";
import { UploadFile, UploadProps } from "antd/es/upload/interface";
import { useSelector } from "react-redux";
import { getImageUrl } from "../../../config/config";
import dayjs from "dayjs";
import "./ProductReviews.scss";
import { Review, CreateReviewRequest } from "../../../types/review";
import { reviewApi } from "~/services/axios.review";
import {
  HubConnectionBuilder,
  LogLevel,
  HubConnection,
} from "@microsoft/signalr";
const { TextArea } = Input;

const ProductReviews = ({ productId }: { productId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [isPurchased, setIsPurchased] = useState<boolean>(false);
  const currentUser = useSelector((state: any) => state.account?.user);
  const isLoggedIn = !!currentUser?.id;
  const connectionRef = useRef<HubConnection | null>(null);
  const initialLoadCompleteRef = useRef<boolean>(false);

  const [initReview, setInitReview] = useState<CreateReviewRequest>({
    userId: currentUser?.id || "",
    productId,
    stars: 5,
    comment: "",
    imageFile: undefined,
    videoFile: undefined,
  });

  // Cập nhật userId khi currentUser thay đổi
  useEffect(() => {
    setInitReview((prev) => ({
      ...prev,
      userId: currentUser?.id || "",
    }));
  }, [currentUser]);

  // Kết nối SignalR
  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_URL}/reviewHub`, {
        accessTokenFactory: () => localStorage.getItem("access_token") || "",
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    // Store connection in ref to access it later
    connectionRef.current = connection;

    connection.on("ReceiveReview", (review: Review) => {
      console.log("Received new review:", review);
      // Only add the review if it doesn't already exist in the list
      setReviews((prev) => {
        if (prev.some((r) => r.id === review.id)) {
          return prev;
        }
        return [review, ...prev];
      });
    });

    connection.on("UpdateReviewStats", ({ averageRating, totalReviews }) => {
      setAverageRating(averageRating || 0);
      setTotalReviews(totalReviews || 0);
    });

    connection
      .start()
      .then(() => {
        console.log("SignalR connected");
        connection.invoke("JoinProductReviews", productId);
      })
      .catch((err) => console.error("SignalR connection error:", err));

    return () => {
      if (connectionRef.current) {
        connectionRef.current
          .invoke("LeaveProductReviews", productId)
          .then(() => {
            connectionRef.current?.stop();
          });
      }
    };
  }, [productId]);

  // Lấy dữ liệu review và trạng thái mua hàng
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          reviewsResponse,
          averageRatingResponse,
          totalReviewsResponse,
          isPurchasedResponse,
        ] = await Promise.all([
          reviewApi.getByProductId(productId),
          reviewApi.getAverageRatingByProductId(productId),
          reviewApi.getTotalReviewsByProductId(productId),
          isLoggedIn
            ? reviewApi.isOrderCompletedForProduct(currentUser.id, productId)
            : Promise.resolve(false),
        ]);

        setReviews(reviewsResponse || []);
        setAverageRating(averageRatingResponse || 0);
        setTotalReviews(totalReviewsResponse || 0);
        setIsPurchased(isPurchasedResponse || false);
        initialLoadCompleteRef.current = true;
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        message.error("Không thể tải đánh giá hoặc trạng thái mua hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId, currentUser?.id, isLoggedIn]);

  // Xử lý thay đổi file
  const handleFileChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    const imageFiles = newFileList.filter((file) =>
      file.type?.startsWith("image/")
    );
    const videoFiles = newFileList.filter((file) =>
      file.type?.startsWith("video/")
    );

    const filteredList = [
      ...(imageFiles.length > 0 ? [imageFiles[imageFiles.length - 1]] : []),
      ...(videoFiles.length > 0 ? [videoFiles[videoFiles.length - 1]] : []),
    ];

    setFileList(filteredList);

    // Lưu file vào initReview
    const imageFile =
      imageFiles.length > 0
        ? imageFiles[imageFiles.length - 1].originFileObj
        : undefined;
    const videoFile =
      videoFiles.length > 0
        ? videoFiles[videoFiles.length - 1].originFileObj
        : undefined;

    setInitReview((prev) => ({
      ...prev,
      imageFile: imageFile,
      videoFile: videoFile,
    }));
  };

  // Kiểm tra file trước khi upload
  const beforeUpload = (file: UploadFile) => {
    const isImage = file.type?.startsWith("image/");
    const isVideo = file.type?.startsWith("video/");

    if (!isImage && !isVideo) {
      message.error("Chỉ có thể tải lên file ảnh hoặc video!");
      return false;
    }

    const supportedImageTypes = ["image/jpeg", "image/png", "image/gif"];
    const supportedVideoTypes = ["video/mp4", "video/mpeg", "video/webm"];

    if (isImage && !supportedImageTypes.includes(file.type!)) {
      message.error(
        "Định dạng ảnh không được hỗ trợ! Chỉ hỗ trợ JPEG, PNG, GIF."
      );
      return false;
    }

    if (isVideo && !supportedVideoTypes.includes(file.type!)) {
      message.error(
        "Định dạng video không được hỗ trợ! Chỉ hỗ trợ MP4, MPEG, WebM."
      );
      return false;
    }

    const isLessThan10MB = (file.size || 0) / 1024 / 1024 < 10;
    if (!isLessThan10MB) {
      message.error("File phải nhỏ hơn 10MB!");
      return false;
    }

    return false; // Ngăn tự động upload
  };

  // Hàm gửi review
  const handleFormSubmit = async () => {
    if (!isLoggedIn) {
      message.warning("Vui lòng đăng nhập để gửi đánh giá");
      return;
    }

    if (!isPurchased) {
      message.warning("Bạn phải mua sản phẩm này để gửi đánh giá");
      return;
    }

    if (!initReview.stars) {
      message.warning("Vui lòng chọn số sao đánh giá");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("UserId", currentUser.id);
      formData.append("ProductId", productId);
      formData.append("Stars", String(initReview.stars));
      if (initReview.comment) {
        formData.append("Comment", initReview.comment);
      }
      if (initReview.imageFile) {
        formData.append("ImageFile", initReview.imageFile);
      }
      if (initReview.videoFile) {
        formData.append("VideoFile", initReview.videoFile);
      }

      await reviewApi.create(formData);
      message.success("Đánh giá đã được gửi thành công!");

      // Reset form
      setInitReview({
        userId: currentUser.id,
        productId,
        stars: 5,
        comment: "",
        imageFile: undefined,
        videoFile: undefined,
      });
      setFileList([]);
    } catch (error: any) {
      console.error("Lỗi khi gửi đánh giá:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Không thể gửi đánh giá. Vui lòng thử lại.";
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="product-reviews">
      <Divider orientation="left">Đánh Giá Khách Hàng</Divider>

      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card className="review-summary">
            <Row align="middle" gutter={16}>
              <Col span={8} className="rating-overview">
                <div className="average-rating">{averageRating.toFixed(1)}</div>
                <Rate disabled value={averageRating} />
                <div className="review-count">{totalReviews} đánh giá</div>
              </Col>
              <Col span={16}>
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = reviews.filter((r) => r.stars === stars).length;
                  const percentage = totalReviews
                    ? (count / totalReviews) * 100
                    : 0;
                  return (
                    <div key={stars} className="rating-bar">
                      <span>
                        {stars} <StarOutlined />
                      </span>
                      <div className="progress-bar">
                        <div
                          className="progress"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span>{count}</span>
                    </div>
                  );
                })}
              </Col>
            </Row>
          </Card>
        </Col>

        {isLoggedIn ? (
          isPurchased ? (
            <Col span={24}>
              <Card title="Viết Đánh Giá" className="review-form">
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", marginBottom: 8 }}>
                    Đánh giá sao <span style={{ color: "red" }}>*</span>
                  </label>
                  <Rate
                    value={initReview.stars}
                    onChange={(value) =>
                      setInitReview((prev) => ({ ...prev, stars: value }))
                    }
                  />
                  {initReview.stars === 0 && (
                    <div style={{ color: "red", marginTop: 4 }}>
                      Vui lòng chọn số sao
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", marginBottom: 8 }}>
                    Bình luận
                  </label>
                  <TextArea
                    rows={4}
                    value={initReview.comment}
                    onChange={(e) =>
                      setInitReview((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", marginBottom: 8 }}>
                    Tải lên ảnh
                  </label>
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={handleFileChange}
                    beforeUpload={beforeUpload}
                    maxCount={2}
                  >
                    {fileList.length < 2 && (
                      <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>Tải lên</div>
                      </div>
                    )}
                  </Upload>
                  <div className="upload-hint">
                    Bạn có thể tải lên một ảnh (tối đa 10MB mỗi file)
                  </div>
                </div>

                <Button
                  type="primary"
                  onClick={handleFormSubmit}
                  loading={submitting}
                  disabled={
                    !isLoggedIn || !isPurchased || initReview.stars === 0
                  }
                >
                  Gửi Đánh Giá
                </Button>
              </Card>
            </Col>
          ) : (
            <Col span={24}>
              <Card>
                <div className="no-purchase-notice">
                  Bạn cần mua sản phẩm này để có thể gửi đánh giá.
                </div>
              </Card>
            </Col>
          )
        ) : (
          <Col span={24}>
            <Card>
              <div className="login-notice">
                Vui lòng đăng nhập để gửi đánh giá.
              </div>
            </Card>
          </Col>
        )}

        <Col span={24}>
          <div className="review-list">
            {loading ? (
              <div className="loading-reviews">
                <Spin tip="Đang tải đánh giá..." />
              </div>
            ) : reviews.length > 0 ? (
              reviews.map((review) => (
                <Card key={review.id} className="review-item">
                  <div className="review-header">
                    <Avatar icon={<UserOutlined />} src={review.userAvatar} />
                    <div className="user-info">
                      <div className="username">{review.userName}</div>
                      <div className="review-date">
                        {dayjs(review.createdAt).format("MMMM D, YYYY")}
                      </div>
                    </div>
                    <div className="review-rating">
                      <Rate disabled value={review.stars} />
                    </div>
                  </div>

                  {review.comment && (
                    <div className="review-comment">{review.comment}</div>
                  )}

                  <div className="review-media">
                    {review.imageUrl && (
                      <div className="review-image">
                        <img src={review.imageUrl} alt="Ảnh đánh giá" />
                      </div>
                    )}

                    {review.videoUrl && (
                      <div className="review-video">
                        <video controls>
                          <source src={getImageUrl(review.videoUrl)} />
                          Trình duyệt của bạn không hỗ trợ thẻ video.
                        </video>
                      </div>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <div className="no-reviews">
                Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm
                này!
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ProductReviews;
