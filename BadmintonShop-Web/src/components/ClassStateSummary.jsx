import React, { Component } from 'react';

class ClassStateSummary extends Component {
  render() {
    const { cartCount, unreadCount, sidebarCollapsed } = this.props;
    
    if (sidebarCollapsed) return null;
    
    return (
      <div className="state-summary" style={{ padding: '15px 20px', fontSize: '0.85rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', margin: 'auto 0 0 0' }}>
        <div style={{ marginBottom: '6px', color: 'var(--color-text-primary)' }}><strong>Activity Summary</strong></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span>Cart Items:</span>
            <span style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>{cartCount}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Unread Alerts:</span>
            <span style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>{unreadCount}</span>
        </div>
      </div>
    );
  }
}

export default ClassStateSummary;
