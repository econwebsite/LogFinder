import React from 'react';
import { Table, Tag } from 'antd';

const LogTable = ({ logs }) => {
  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: '15%',
    },
    {
      title: 'IP Address',
      dataIndex: 'clientIP',
      key: 'clientIP',
      width: '12%',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '20%',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: '20%',
      
    },
    {
  title: 'Referral Page',
  dataIndex: 'referrer',
  key: 'referrer',
  width: '33%',
  render: (referrer, record) => {
    const displayText =
      referrer === '-' || referrer === '/' ? 'Home Page' : referrer;

    return record.isLandingPage ? (
      <Tag
        color="green"
        style={{
          maxWidth: '100%',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: 'inline-block',
        }}
      >
        {displayText}
      </Tag>
    ) : (
      <span
        style={{
          maxWidth: '100%',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: 'inline-block',
        }}
      >
        {displayText}
      </span>
    );
  },
},

  ];

  return (
  <Table
  columns={columns}
  dataSource={logs}
  pagination={{ pageSize: 1000 }}
  bordered
  size="middle"
  scroll={{ x: 'max-content', y: 570 }} 
  rowClassName={(record) => (record.isLandingPage ? 'landing-page-row' : '')}
/>

  );
};

export default LogTable;
