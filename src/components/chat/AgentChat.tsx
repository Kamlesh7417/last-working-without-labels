import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Agent, AgentMessage } from '../../types/agents';

interface AgentChatProps {
  agent: Agent;
  messages: AgentMessage[];
  onSendMessage: (message: string) => void;
  className?: string;
}

const AgentChat: React.FC<AgentChatProps> = ({
  agent,
  messages,
  onSendMessage,
  className = ''
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const renderMessage = (message: AgentMessage) => {
    switch (message.type) {
      case 'suggestion':
        return (
          <div className="space-y-2">
            <p className="text-sm text-gray-800">{message.content}</p>
            {message.metadata?.suggestions && (
              <div className="flex flex-wrap gap-2">
                {message.metadata.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-full hover:bg-primary-200"
                    onClick={() => setNewMessage(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      case 'action':
        return (
          <div className="space-y-2">
            <p className="text-sm text-gray-800">{message.content}</p>
            {message.metadata?.actions && (
              <div className="flex flex-wrap gap-2">
                {message.metadata.actions.map((action, index) => (
                  <button
                    key={index}
                    className="px-3 py-1 text-sm bg-primary-600 text-white rounded-full hover:bg-primary-700"
                    onClick={() => console.log('Action clicked:', action.value)}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      case 'alert':
        return (
          <div className={`p-3 rounded-lg ${
            message.metadata?.alert?.type === 'warning' ? 'bg-yellow-50 text-yellow-800' :
            message.metadata?.alert?.type === 'error' ? 'bg-red-50 text-red-800' :
            message.metadata?.alert?.type === 'success' ? 'bg-green-50 text-green-800' :
            'bg-blue-50 text-blue-800'
          }`}>
            {message.metadata?.alert?.title && (
              <h4 className="font-medium mb-1">{message.metadata.alert.title}</h4>
            )}
            <p className="text-sm">{message.content}</p>
          </div>
        );
      default:
        return <p className="text-sm text-gray-800">{message.content}</p>;
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white rounded-lg shadow-sm ${className}`}>
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <img
            src={agent.avatar}
            alt={agent.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-medium text-gray-900">{agent.name}</h3>
            <p className="text-sm text-gray-500">{agent.role}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.agentId === agent.id ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.agentId === agent.id
                    ? 'bg-gray-100'
                    : 'bg-primary-600 text-white'
                }`}
              >
                {renderMessage(message)}
                <span className="text-xs opacity-75 mt-1 block">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-600 hover:text-primary-600 rounded-full hover:bg-gray-100">
            <Paperclip className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Send className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default AgentChat;