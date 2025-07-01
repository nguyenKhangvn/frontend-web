import { useState, useEffect } from "react";
import ChatBotGMN from "../ChatBotGMN/ChatBotGMN";
import ChatBot from "../ChatBot/ChatBot";
import { Radio, Tooltip, Badge, Tabs } from "antd";
import { MessageOutlined, CustomerServiceOutlined, RobotOutlined } from "@ant-design/icons";
import "./ChatContainer.scss";

const ChatContainer = () => {
  const [selectedChatMode, setSelectedChatMode] = useState<'gmn' | 'default'>('gmn');
  const [newMessageCount, setNewMessageCount] = useState({ gmn: 0, default: 0 });

  const items = [
    {
      key: 'gmn',
      label: (
        <Tooltip title="Chat với trợ lý ảo GMN">
          <Badge count={selectedChatMode !== 'gmn' ? newMessageCount.gmn : 0} size="small">
            <span className="tab-label">
              <RobotOutlined /> GMN Assistant
            </span>
          </Badge>
        </Tooltip>
      ),
      children: <ChatBotGMN onNewMessage={() => handleNewMessage('gmn')} />,
    },
    {
      key: 'default',
      label: (
        <Tooltip title="Chat với nhân viên hỗ trợ">
          <Badge count={selectedChatMode !== 'default' ? newMessageCount.default : 0} size="small">
            <span className="tab-label">
              <CustomerServiceOutlined /> Customer Support
            </span>
          </Badge>
        </Tooltip>
      ),
      children: <ChatBot onNewMessage={() => handleNewMessage('default')} />,
    },
  ];

  // Xử lý khi có tin nhắn mới
  const handleNewMessage = (type: 'gmn' | 'default') => {
    if (selectedChatMode !== type) {
      setNewMessageCount(prev => ({
        ...prev,
        [type]: prev[type] + 1
      }));
    }
  };

  // Reset số tin nhắn mới khi chuyển tab
  const handleTabChange = (activeKey: string) => {
    setSelectedChatMode(activeKey as 'gmn' | 'default');
    setNewMessageCount(prev => ({
      ...prev,
      [activeKey]: 0
    }));
  };

  return (
    <div className="chat-container-modern">
      <div className="chat-header-modern">
        <MessageOutlined className="chat-icon" />
        <h2>Trung tâm hỗ trợ</h2>
      </div>
      
      <Tabs
        activeKey={selectedChatMode}
        onChange={handleTabChange}
        items={items}
        type="card"
        className="chat-tabs"
        tabBarGutter={8}
        animated={{ inkBar: true, tabPane: true }}
      />
      
      <div className="chat-footer-modern">
        <span>© 2025 Dịch vụ khách hàng</span>
      </div>
    </div>
  );
};

export default ChatContainer;