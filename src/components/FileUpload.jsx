import React from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const FileUpload = ({ onFileRead, setLoading, multiple = false }) => {
  const extractEmail = (line) => {
    const emailMatch = line.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i);
    return emailMatch ? emailMatch[0] : 'anonymous';
  };

  const extractReferrer = (line) => {
    const urlMatch = line.match(/(https?:\/\/[^\s]+)/i);
    return urlMatch ? urlMatch[0] : '-';
  };

  const parseLine = (line, index) => {
    try {
      const parts = line.trim().split(/\s+/);
      if (parts.length < 10) return null;

      const timestamp = `${parts[0]} ${parts[1]}`;
     const clientIP = parts[parts.length - 1] || 'unknown';
      const method = parts[3] || '';
      const uri = parts[4] || '';
      const query = parts[5] !== '-' ? `?${parts[5]}` : '';
      const action = `${method} ${uri}${query}`;

      return {
        key: `${timestamp}-${clientIP}-${index}`, 
        timestamp,
        email: extractEmail(line),
        clientIP,
        action,
        referrer: extractReferrer(line),
        formattedDate: dayjs(timestamp, 'YYYY-MM-DD HH:mm:ss').isValid() 
          ? dayjs(timestamp, 'YYYY-MM-DD HH:mm:ss') 
          : dayjs()
      };
    } catch (err) {
      console.error("Skipping malformed line:", line);
      return null;
    }
  };

  const beforeUpload = (file) => {
    setLoading(true);

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target.result;
        if (!content) {
          message.error("Empty file content");
          setLoading(false);
          return;
        }

        const lines = content.split('\n')
          .filter(line => line.trim() !== '' && !line.startsWith('#'));

        const parsedLogs = lines.map((line, index) => parseLine(line, index)).filter(log => log !== null);

        if (parsedLogs.length === 0) {
          message.error("No valid log entries found");
        } else {
          onFileRead(parsedLogs, file);
          message.success(`Processed ${parsedLogs.length} entries from ${file.name}`);
        }
      } catch (err) {
        console.error("File processing error:", err);
        message.error(`Error processing ${file.name}`);
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      message.error("Failed to read file");
      setLoading(false);
    };

    reader.readAsText(file);
    return false;
  };

  return (
    
    <Upload 
      beforeUpload={beforeUpload}
      showUploadList={false}
      accept=".log,.txt"
      multiple={multiple}
    >
      <Button icon={<UploadOutlined />}>
        {multiple ? 'Select Log Files' : 'Select Log File'}
      </Button>
    </Upload>
  );
};

export default FileUpload;