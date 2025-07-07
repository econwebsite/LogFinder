import React from 'react';
import { Table, Tag } from 'antd';

const LogTable = ({ logs }) => {
  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: '15%',
      // sorter: (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
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
      title: 'Landing Page',
      dataIndex: 'referrer',
      key: 'referrer',
      width: '33%',
      render: (referrer, record) =>
        record.isLandingPage ? (
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
            {referrer}
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
            {referrer}
          </span>
        ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={logs}
      pagination={{ pageSize: 10 }}
      bordered
      size="middle"
      scroll={{ x: 'max-content' }}
      rowClassName={(record) => (record.isLandingPage ? 'landing-page-row' : '')}
    />
  );
};

export default LogTable;
