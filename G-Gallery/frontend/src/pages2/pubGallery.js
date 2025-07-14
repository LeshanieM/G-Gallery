import React, { useEffect, useState, useCallback } from 'react';
import { Container, Tabs, Tab, Form, Row, Col, Alert } from 'react-bootstrap';
import { BsFilter } from 'react-icons/bs';
import axios from 'axios';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import UserGallery from './pubUserGallery';
import AdminView from './pubGalleryAdminView';

// Constants for filter options
const FILTER_OPTIONS = [
  { value: 'none', label: 'No Filter' },
  { value: 'grayscale(100%)', label: 'Grayscale' },
  { value: 'blur(3px)', label: 'Blur' },
  { value: 'brightness(150%)', label: 'Brightness' },
  { value: 'contrast(200%)', label: 'Contrast' },
  { value: 'sepia(80%)', label: 'Sepia' },
];

// Constants for report file formats
const FILE_FORMATS = [
  { value: 'csv', label: 'CSV' },
  { value: 'pdf', label: 'PDF' },
];

const Gallery = () => {
  // State management
  const [userdata, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('none');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState([]);
  const [fileFormat, setFileFormat] = useState('csv');
  const [activeTab, setActiveTab] = useState('gallery');
  const [chartType, setChartType] = useState('bar');
  const [timeGrouping, setTimeGrouping] = useState('daily');

  // API endpoint configuration
  const API_ENDPOINTS = {
    users: 'http://localhost:5000/user/api/gallerygetUser',
    images: 'http://localhost:5000/useruploads/',
  };

  // Fetch user data
  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(API_ENDPOINTS.users);
      if (response.status === 200) {
        setUserData(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch user data:', err);
      setError('Failed to load user data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Image processing functions
  const applyImageFilter = async (imageUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');

          ctx.filter = filter;
          ctx.drawImage(img, 0, 0);

          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          }, 'image/jpeg');
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = () => {
        reject(new Error('Image failed to load'));
      };

      img.src = imageUrl;
    });
  };

  // Download handlers
  const handleDownload = async (imageName) => {
    try {
      const url = `${API_ENDPOINTS.images}${imageName}`;
      const blob = await applyImageFilter(url);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${filter}_${imageName}`;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      }, 100);
    } catch (err) {
      console.error('Download failed:', err);
      setError('Failed to download image. Please try again.');
    }
  };

  const handleDownloadAllAsZip = async (imageList) => {
    try {
      const zip = new JSZip();
      const promises = imageList.map(async (imageName) => {
        try {
          const url = `${API_ENDPOINTS.images}${imageName}`;
          const blob = await applyImageFilter(url);
          zip.file(`${filter}_${imageName}`, blob);
        } catch (err) {
          console.error(`Failed to process ${imageName}`, err);
          return null;
        }
      });

      await Promise.all(promises);
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${filter}_images.zip`);
    } catch (err) {
      console.error('Zip creation failed:', err);
      setError('Failed to create zip file. Please try again.');
    }
  };

  // Filter and search functionality
  const filteredUsers = userdata.filter((user) =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Report generation functions
  const validateDateRange = () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return false;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('End date must be after start date');
      return false;
    }

    return true;
  };

  const filterByDateRange = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return userdata.filter((user) => {
      if (!user.createdAt) return false;
      const created = new Date(user.createdAt);
      return created >= start && created <= end;
    });
  };

  const generateCSV = (data) => {
    if (data.length === 0) {
      setError('No data available for the selected date range.');
      return;
    }

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Username,Created At,Image Count\n';

    data.forEach((user) => {
      const imageCount = user.userprofile ? user.userprofile.length : 0;
      csvContent += `${user.username},${user.createdAt},${imageCount}\n`;
    });

    downloadFile(csvContent, `user_report_${startDate}_to_${endDate}.csv`);
  };

  const generatePDF = (data) => {
    if (data.length === 0) {
      setError('No data available for the selected date range.');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`User Report (${startDate} to ${endDate})`, 14, 15);

    const tableData = data.map((user) => [
      user.username,
      user.createdAt,
      user.userprofile ? user.userprofile.length : 0,
    ]);

    if (typeof doc.autoTable === 'function') {
      doc.autoTable({
        head: [['Username', 'Created At', 'Image Count']],
        body: tableData,
        startY: 25,
        margin: { top: 20 },
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [66, 139, 202] },
      });
    } else {
      // Fallback for when autoTable is not available
      let yPosition = 25;
      const rowHeight = 10;
      const colWidth = [80, 80, 40];

      // Draw header
      doc.setFillColor(66, 139, 202);
      doc.rect(14, yPosition, colWidth[0] + colWidth[1] + colWidth[2], rowHeight, 'F');
      doc.setTextColor(255);
      doc.setFontSize(12);
      doc.text('Username', 16, yPosition + 7);
      doc.text('Created At', 16 + colWidth[0], yPosition + 7);
      doc.text('Images', 16 + colWidth[0] + colWidth[1], yPosition + 7);

      // Draw rows
      yPosition += rowHeight;
      doc.setTextColor(0);
      doc.setFontSize(10);

      for (const row of tableData) {
        yPosition += rowHeight;
        doc.text(row[0] || '', 16, yPosition);
        doc.text(row[1] || '', 16 + colWidth[0], yPosition);
        doc.text(row[2].toString() || '0', 16 + colWidth[0] + colWidth[1], yPosition);

        if (yPosition > 270) {
          doc.addPage();
          yPosition = 15;
        }
      }
    }

    doc.save(`user_report_${startDate}_to_${endDate}.pdf`);
  };

  const downloadFile = (content, fileName) => {
    const encodedUri = encodeURI(content);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
  };

  const handleGenerateReport = () => {
    setError(null);
    if (!validateDateRange()) return;

    const filteredData = filterByDateRange();
    setReportData(filteredData);

    if (fileFormat === 'csv') {
      generateCSV(filteredData);
    } else if (fileFormat === 'pdf') {
      generatePDF(filteredData);
    }
  };

  // Data analysis functions
  const calculateRegistrationsByTime = useCallback(() => {
    if (!userdata.length) return [];

    const countsByDate = {};

    userdata.forEach((user) => {
      if (!user.createdAt) return;

      const date = new Date(user.createdAt);
      let timeKey;

      if (timeGrouping === 'daily') {
        timeKey = date.toISOString().split('T')[0];
      } else if (timeGrouping === 'monthly') {
        timeKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      } else if (timeGrouping === 'yearly') {
        timeKey = `${date.getFullYear()}`;
      }

      countsByDate[timeKey] = (countsByDate[timeKey] || 0) + 1;
    });

    return Object.keys(countsByDate)
      .map((date) => ({
        date,
        count: countsByDate[date],
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [userdata, timeGrouping]);

  const calculateUsersByImageCount = useCallback(() => {
    if (!userdata.length) return [];

    const imageCounts = {};

    userdata.forEach((user) => {
      const count = user.userprofile ? user.userprofile.length : 0;
      imageCounts[count] = (imageCounts[count] || 0) + 1;
    });

    return Object.keys(imageCounts).map((count) => ({
      imageCount: count === '0' ? 'No Images' : `${count} Image${count === '1' ? '' : 's'}`,
      users: imageCounts[count],
      value: imageCounts[count],
    }));
  }, [userdata]);

  const registrationData = calculateRegistrationsByTime();
  const imageCountData = calculateUsersByImageCount();

  const handleDownloadChartData = (data, fileName) => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (data === registrationData) {
      csvContent += 'Date,User Count\n';
      data.forEach((item) => {
        csvContent += `${item.date},${item.count}\n`;
      });
    } else if (data === imageCountData) {
      csvContent += 'Image Count Category,Number of Users\n';
      data.forEach((item) => {
        csvContent += `${item.imageCount},${item.users}\n`;
      });
    }

    downloadFile(csvContent, `${fileName}.csv`);
  };

  // Render functions
  const renderGalleryTab = () => (
    <>
      <div className="mb-4 p-3 bg-light rounded-3 shadow-sm">
        <Row className="justify-content-center g-3">
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="Search by username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="shadow-sm"
            />
          </Col>
          <Col md={4}>
            <div className="d-flex align-items-center">
              <BsFilter className="me-2" size={20} />
              <Form.Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="shadow-sm"
              >
                {FILTER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </div>
          </Col>
        </Row>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <UserGallery
          users={filteredUsers}
          filter={filter}
          handleDownload={handleDownload}
          handleDownloadAllAsZip={handleDownloadAllAsZip}
        />
      )}
    </>
  );

  const renderAdminTab = () => (
    <AdminView
      users={userdata}
      chartType={chartType}
      timeGrouping={timeGrouping}
      setChartType={setChartType}
      setTimeGrouping={setTimeGrouping}
      registrationData={registrationData}
      imageCountData={imageCountData}
      handleDownloadChartData={handleDownloadChartData}
      startDate={startDate}
      endDate={endDate}
      setStartDate={setStartDate}
      setEndDate={setEndDate}
      fileFormat={fileFormat}
      setFileFormat={setFileFormat}
      handleGenerateReport={handleGenerateReport}
      reportData={reportData}
      loading={loading}
      error={error}
    />
  );

  return (
    <Container className="py-4">
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
        id="gallery-tabs"
      >
        <Tab eventKey="gallery" title="Gallery" className="pt-3">
          {renderGalleryTab()}
        </Tab>
        <Tab eventKey="admin" title="Admin View" className="pt-3">
          {renderAdminTab()}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Gallery;