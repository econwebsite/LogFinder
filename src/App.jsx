import React, { useState } from 'react';
import { Layout, Typography, Input, DatePicker, Spin, Button, Tag, message, Row, Col } from 'antd';
import FileUpload from './components/FileUpload';
import LogTable from './components/LogTable';
import dayjs from 'dayjs';
import 'antd/dist/reset.css';
import './App.css';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Search } = Input;

function App() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileLogMap, setFileLogMap] = useState({});

  const handleFileRead = (newLogs, file) => {
    const logsWithFormattedDate = newLogs.map(log => ({
      ...log,
      formattedDate: dayjs(log.timestamp, 'YYYY-MM-DD HH:mm:ss').isValid()
        ? dayjs(log.timestamp, 'YYYY-MM-DD HH:mm:ss')
        : dayjs(),
      isLandingPage: log.referrer && !log.referrer.includes(log.action.split(' ')[1])
    }));

    const sortedLogs = [...logsWithFormattedDate].sort((a, b) => 
      (b.isLandingPage - a.isLandingPage) || 
      (a.timestamp.localeCompare(b.timestamp))
    );

    setLogs(prevLogs => [...prevLogs, ...sortedLogs]);
    setFilteredLogs(prevLogs => [...prevLogs, ...sortedLogs]);
    setFileLogMap(prev => ({
      ...prev,
      [file.name]: sortedLogs
    }));
    setLoading(false);
  };

  const removeFile = (fileName) => {
    const logsToRemove = fileLogMap[fileName] || [];
    const logIdsToRemove = new Set(logsToRemove.map(log => log.key));
    
    setLogs(prev => prev.filter(log => !logIdsToRemove.has(log.key)));
    setFilteredLogs(prev => prev.filter(log => !logIdsToRemove.has(log.key)));
    
    const newFileLogMap = {...fileLogMap};
    delete newFileLogMap[fileName];
    setFileLogMap(newFileLogMap);
    
    message.success(`Removed ${logsToRemove.length} entries from ${fileName}`);
  };

  const applyFilters = (term = searchTerm, range = dateRange) => {
    let result = [...logs];

    if (term) {
      result = result.filter(log => 
        log.email.toLowerCase().includes(term.toLowerCase()) ||
        log.clientIP.toLowerCase().includes(term.toLowerCase())
      );
    }

    if (range && range.length === 2) {
      const [start, end] = range;
      result = result.filter(log => {
        try {
          return log.formattedDate.isAfter(start.startOf('second')) &&
                 log.formattedDate.isBefore(end.endOf('second'));
        } catch {
          return true;
        }
      });
    }

    setFilteredLogs(result);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(value, dateRange);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    applyFilters(searchTerm, dates);
  };

  const disabledDate = (current) => {
    return current && current > dayjs().endOf('day');
  };

  const clearAllData = () => {
    setLogs([]);
    setFilteredLogs([]);
    setFileLogMap({});
    setSearchTerm('');
    setDateRange([]);
    message.success('Cleared all log data');
  };

  return (
    <Layout style={{ minHeight: '100vh', background: 'white' }}>
      <Header style={{ background: '#1b66da', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title style={{ color: '#fff', margin: 0 }} level={2}>
          Log File Viewer
        </Title>
        {logs.length > 0 && (
          <Button type="primary" danger onClick={clearAllData}>
            Clear All Data
          </Button>
        )}
      </Header>
      <Content style={{ padding: '20px' }}>
        <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <FileUpload onFileRead={handleFileRead} setLoading={setLoading} multiple />
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', maxWidth: '60%' }}>
              {Object.keys(fileLogMap).map(fileName => (
                <Tag
                  key={fileName}
                  closable
                  onClose={(e) => {
                    e.preventDefault();
                    removeFile(fileName);
                  }}
                  style={{ 
                    margin: 0, 
                    padding: '4px 8px',
                    background: '#e6f7ff',
                    border: '1px solid #91d5ff',
                    color: '#1890ff'
                  }}
                >
                  {fileName.length > 20 ? `${fileName.substring(0, 15)}...` : fileName}
                </Tag>
              ))}
            </div>
          </div>

          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
              <Spin size="large" />
            </div>
          )}

          {!loading && logs.length > 0 && (
            <>
              <Row gutter={16} align="middle" style={{ marginBottom: '16px' }}>
                <Col span={12}>
                  <Search
                    placeholder="Search by email or IP address"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    allowClear
                    enterButton
                    style={{ width: '100%' }}
                  />
                </Col>
                <Col span={12}>
                  <RangePicker
                    showTime={{ format: 'HH:mm:ss' }}
                    format="YYYY-MM-DD HH:mm:ss"
                    onChange={handleDateRangeChange}
                    disabledDate={disabledDate}
                    style={{ width: '100%' }}
                  />
                </Col>
              </Row>

              <div style={{ marginTop: '8px', marginBottom: '16px' }}>
                <Text type="secondary">
                  Showing {filteredLogs.length} of {logs.length} log entries
                </Text>
              </div>

              <div className="table-container">
                <LogTable logs={filteredLogs} />
              </div>
            </>
          )}
        </div>
      </Content>
    </Layout>
  );
}

export default App;