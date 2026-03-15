import React from 'react';
import { useToggle } from 'react-use';
import { useNotification } from '../../hooks/useNotification';

const NotificationCenter: React.FC = () => {
  const [isOpen, toggle] = useToggle(false);
  const { notifications, unreadCount, markNotificationAsRead } = useNotification();

  return (
    <div className="notification-center">
      <button className="notification-badge" onClick={toggle}>
        🔔
        {unreadCount > 0 && (
          <span className="notification-count">{unreadCount}</span>
        )}
      </button>
      
      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-dropdown-header">
            通知 ({notifications.length})
          </div>
          
          {notifications.length === 0 ? (
            <div className="loading-text">暂无通知</div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${notification.read ? '' : 'unread'}`}
                onClick={() => markNotificationAsRead(notification.id)}
              >
                <span className={`notification-type ${notification.type}`}>
                  {notification.type}
                </span>
                <div className="notification-message">{notification.message}</div>
                <div className="notification-timestamp">
                  {new Date(notification.timestamp).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
