import "./footer.scss";
import YouTubeIcon from "@mui/icons-material/YouTube";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import { GOOGLE_MAPS_EMBED_URL } from "~/config/config";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h4>VỀ YẾN SÀO HOÀNG GIA</h4>
          <p>
            Chuyên cung cấp yến sào nguyên chất, đảm bảo chất lượng và sức khỏe.
          </p>
          <p>Đội ngũ nhân viên tận tâm, chuyên nghiệp.</p>
          <p>
            Địa chỉ: 55 Trần Bình Trọng - Phường Lê Lợi - TP. Quy Nhơn - Bình
            Định
          </p>
          <p>Giám Đốc : 0939.200.779 ( Mr.Phong )</p>
          <p>Kinh Doanh : 0932.900.779 ( Ms.Thi )</p>

          <div className="map-container">
            <iframe
              title="Yến Sào Hoàng Gia Map"
              src={GOOGLE_MAPS_EMBED_URL}
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        <div className="footer-column">
          <h4>HỖ TRỢ KHÁCH HÀNG</h4>
          <ul>
            <li onClick={() => navigate("/guide")}>Hướng dẫn mua hàng</li>
            <li onClick={() => navigate("/return-policy")}>
              Chính sách đổi trả
            </li>
            <li onClick={() => navigate("/privacy-policy")}>
              Chính sách bảo mật
            </li>
            <li onClick={() => navigate("/contact")}>Liên hệ</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>KẾT NỐI</h4>
          <div className="social-icons">
            <a href="#">
              <FacebookIcon />
            </a>
            <a href="#">
              <InstagramIcon />
            </a>
            <a href="#">
              <YouTubeIcon />
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h4>NHẬN ƯU ĐÃI</h4>
          <p>Nhập email để nhận tin khuyến mãi mới nhất.</p>
          <input type="email" placeholder="Email của bạn" />
          <button>Đăng ký</button>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Yến Sào Hoàng Gia. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
