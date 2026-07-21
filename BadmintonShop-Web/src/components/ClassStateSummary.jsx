import React, { Component } from 'react';

class ClassStateSummary extends Component {
  render() {
    const { cartCount, unreadCount, sidebarCollapsed } = this.props;
    
    if (sidebarCollapsed) return null;
    
    return (
      <div className="state-summary" style={{ padding: '15px 20px', fontSize: '0.85rem', color: '#9ca3af', borderTop: '1px solid #374151', borderBottom: '1px solid #374151', margin: 'auto 0 0 0' }}>
        <div style={{ marginBottom: '6px', color: '#f3f4f6' }}><strong>Activity Summary</strong></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span>Cart Items:</span>
            <span style={{ fontWeight: 'bold', color: '#3b82f6' }}>{cartCount}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Unread Alerts:</span>
            <span style={{ fontWeight: 'bold', color: '#ef4444' }}>{unreadCount}</span>
        </div>
      </div>
    );
  }
}

export default ClassStateSummary;
