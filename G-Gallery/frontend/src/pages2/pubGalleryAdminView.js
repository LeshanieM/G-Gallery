import React from 'react';
import { 
  Container, 
  Tabs, 
  Tab, 
  Card, 
  Button, 
  Form, 
  Row, 
  Col 
} from 'react-bootstrap';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

const AdminView = ({
  users,
  chartType,
  timeGrouping,
  setChartType,
  setTimeGrouping,
  registrationData,
  imageCountData,
  handleDownloadChartData,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  fileFormat,
  setFileFormat,
  handleGenerateReport,
  reportData
}) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <Container>
      <Tabs defaultActiveKey="analytics" className="mb-4">
        <Tab eventKey="analytics" title="Data Analytics">
          <h1 className="text-center mb-4">Gallery Data Analytics</h1>

          <Row className="mb-4">
            <Col md={6} className="text-center">
              <Form.Group>
                <Form.Label>Chart Type</Form.Label>
                <Form.Select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  style={{ width: '200px', margin: '0 auto' }}
                >
                  <option value="bar">Bar Chart</option>
                  <option value="line">Line Chart</option>
                  <option value="pie">Pie Chart</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6} className="text-center">
              <Form.Group>
                <Form.Label>Time Grouping</Form.Label>
                <Form.Select
                  value={timeGrouping}
                  onChange={(e) => setTimeGrouping(e.target.value)}
                  style={{ width: '200px', margin: '0 auto' }}
                >
                  <option value="daily">Daily</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Card className="mb-4">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h4>Gallery Album Trends</h4>
                <div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() =>
                      handleDownloadChartData(
                        registrationData,
                        'registration_trends'
                      )
                    }
                  >
                    Download Data
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  {chartType === 'bar' && (
                    <BarChart data={registrationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="count"
                        name="User Registrations"
                        fill="#8884d8"
                      />
                    </BarChart>
                  )}
                  {chartType === 'line' && (
                    <LineChart data={registrationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="count"
                        name="User Registrations"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  )}
                  {chartType === 'pie' && (
                    <PieChart>
                      <Pie
                        data={registrationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ date, count }) => `${date}: ${count}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="date"
                      >
                        {registrationData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h4>Users by Image Count</h4>
                <div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() =>
                      handleDownloadChartData(
                        imageCountData,
                        'users_by_image_count'
                      )
                    }
                  >
                    Download Data
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  {chartType === 'bar' && (
                    <BarChart data={imageCountData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="imageCount" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="users"
                        name="Number of Users"
                        fill="#82ca9d"
                      />
                    </BarChart>
                  )}
                  {chartType === 'line' && (
                    <LineChart data={imageCountData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="imageCount" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="users"
                        name="Number of Users"
                        stroke="#82ca9d"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  )}
                  {chartType === 'pie' && (
                    <PieChart>
                      <Pie
                        data={imageCountData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ imageCount, users }) =>
                          `${imageCount}: ${users}`
                        }
                        outerRadius={100}
                        fill="#82ca9d"
                        dataKey="value"
                        nameKey="imageCount"
                      >
                        {imageCountData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="reports" title="Reports">
          <h1 className="text-center mb-4">Gallery Reports</h1>

          <div className="mb-4 text-center">
            <Card className="p-4">
              <h4 className="mb-3">Generate Custom Reports</h4>
              <Form.Label>Start Date:</Form.Label>
              <Form.Control
                type="date"
                style={{
                  width: '200px',
                  margin: '0 auto',
                  marginBottom: '10px',
                }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Form.Label>End Date:</Form.Label>
              <Form.Control
                type="date"
                style={{
                  width: '200px',
                  margin: '0 auto',
                  marginBottom: '10px',
                }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />

              <Form.Label>Report Format:</Form.Label>
              <Form.Select
                style={{
                  width: '200px',
                  margin: '0 auto',
                  marginBottom: '20px',
                }}
                value={fileFormat}
                onChange={(e) => setFileFormat(e.target.value)}
              >
                <option value="csv">CSV</option>
                <option value="pdf">PDF</option>
              </Form.Select>

              <Button variant="primary" onClick={handleGenerateReport}>
                Generate Report
              </Button>
            </Card>
          </div>

          {reportData.length > 0 && (
            <Card>
              <Card.Header>
                <h4>
                  Report Preview ({startDate} to {endDate})
                </h4>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Username</th>
                        <th>Created At</th>
                        <th>Image Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.map((user, index) => (
                        <tr key={index}>
                          <td>{user.username}</td>
                          <td>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            {user.userprofile ? user.userprofile.length : 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AdminView;