import React from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { BsDownload, BsImages } from 'react-icons/bs';

const UserGallery = ({ 
  users, 
  filter, 
  handleDownload, 
  handleDownloadAllAsZip 
}) => {
  return (
    <Container>
      <h1 className="text-center mb-4">Image Gallery</h1>
      
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {users.length > 0 ? (
          users.map((user, index) => (
            <div key={index} className="col">
              <Card className="h-100 shadow-sm border-0">
                <Card.Body className="pb-2">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Card.Title className="mb-0 text-truncate">
                      {user.username}
                    </Card.Title>
                    <span className="badge bg-primary">
                      {user.userprofile?.length || 0} images
                    </span>
                  </div>
                  
                  {user.userprofile && user.userprofile.length > 0 ? (
                    <div className="d-flex flex-wrap gap-2 justify-content-center">
                      {user.userprofile.map((image, idx) => (
                        <div
                          key={idx}
                          className="position-relative"
                          style={{
                            width: '100%',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <div
                            className="bg-light"
                            style={{
                              aspectRatio: '1/1',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <img
                              className="img-fluid"
                              style={{
                                maxHeight: '200px',
                                width: 'auto',
                                filter: filter,
                                transition: 'filter 0.3s ease',
                              }}
                              src={`http://localhost:5000/useruploads/${image}`}
                              alt={`${user.username}'s image ${idx + 1}`}
                            />
                          </div>
                          <div className="p-2 bg-white">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="w-100"
                              onClick={() => handleDownload(image)}
                            >
                              <BsDownload className="me-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <BsImages size={32} className="text-muted mb-2" />
                      <p className="text-muted mb-0">No images uploaded</p>
                    </div>
                  )}
                </Card.Body>
                {user.userprofile && user.userprofile.length > 0 && (
                  <Card.Footer className="bg-white border-0 pt-0">
                    <Button
                      variant="primary"
                      className="w-100"
                      onClick={() => handleDownloadAllAsZip(user.userprofile)}
                    >
                      <BsDownload className="me-1" />
                      Download All as ZIP
                    </Button>
                  </Card.Footer>
                )}
              </Card>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <BsImages size={48} className="text-muted mb-3" />
            <h4 className="text-muted">No users found</h4>
          </div>
        )}
      </div>
    </Container>
  );
};

export default UserGallery;