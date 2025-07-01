import React, { useState, useEffect, useRef } from "react";
import { chatGeminiService } from "~/services/axios.chatGMN";
import { Input, Button, Avatar, Spin } from "antd";
import { SendOutlined, UserOutlined, RobotOutlined } from "@ant-design/icons";
import "./ChatBotGMN.scss";

// Định nghĩa interface cho props
interface ChatBotGMNProps {
  onNewMessage?: () => void;
}

const ChatBotGMN: React.FC<ChatBotGMNProps> = ({ onNewMessage }) => {
  const [userMessage, setUserMessage] = useState(""); // Tin nhắn của người dùng
  const [chatHistory, setChatHistory] = useState<{ user: string; bot: string }[]>([]); // Lịch sử chat
  const [loading, setLoading] = useState(false); // Trạng thái loading khi chờ phản hồi từ bot
  
  // Ref để cuộn xuống cuối cuộc trò chuyện
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!userMessage.trim()) return;
    
    const userText = userMessage;
    setChatHistory((prev) => [...prev, { user: userText, bot: "..." }]); // Hiển thị tin nhắn của người dùng
    setUserMessage(""); // Xóa nội dung input
    setLoading(true);

    try {
      const response = await chatGeminiService.askGemini(userText);
      const reply =
        response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Xin lỗi, tôi không hiểu.";
      
      setChatHistory((prev) => {
        const updatedHistory = [...prev];
        updatedHistory[updatedHistory.length - 1].bot = reply;
        return updatedHistory;
      });
      
      // Thông báo có tin nhắn mới cho ChatContainer
      if (onNewMessage) {
        onNewMessage();
      }
      
    } catch (error) {
      console.error("Lỗi API Gemini:", error);
      setChatHistory((prev) => {
        const updatedHistory = [...prev];
        updatedHistory[updatedHistory.length - 1].bot = "Lỗi kết nối AI!";
        return updatedHistory;
      });
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi nhấn Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chatbot-gmn-container">
      <div className="chat-messages">
        {chatHistory.length === 0 ? (
          <div className="welcome-message">
            <RobotOutlined className="welcome-icon" />
            <h3>Xin chào! Tôi là trợ lý ảo GMN</h3>
            <p>Bạn có thể hỏi tôi bất cứ điều gì và tôi sẽ cố gắng giúp đỡ bạn.</p>
          </div>
        ) : (
          chatHistory.map((chat, index) => (
            <div key={index} className="chat-message-group">
              <div className="user-message">
                <Avatar icon={<UserOutlined />} className="user-avatar" />
                <div className="message-content">{chat.user}</div>
              </div>
              <div className="bot-message">
                <Avatar icon={<RobotOutlined />} className="bot-avatar" />
                <div className="message-content">
                  {chat.bot === "..." ? (
                    <Spin size="small" />
                  ) : (
                    <div className="bot-text">{chat.bot}</div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input-container">
        <Input.TextArea
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nhập câu hỏi của bạn..."
          autoSize={{ minRows: 1, maxRows: 4 }}
          disabled={loading}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={sendMessage}
          loading={loading}
          disabled={!userMessage.trim()}
        >
          Gửi
        </Button>
      </div>
    </div>
  );
};

export default ChatBotGMN;