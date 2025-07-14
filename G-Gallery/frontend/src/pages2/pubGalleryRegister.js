import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import axios from "axios";
import toast from "react-hot-toast";

const GalleryRegister = () => {
    const [username, setUserName] = useState("");
    const [files, setFiles] = useState([]);

    const handleChange = (event) => {
        setUserName(event.target.value)
    }

    const handeFilechange = (event) => {
        let finalFiles = [];
        for (let item of event.target.files) {
            finalFiles.push(item);
        }
        setFiles(finalFiles);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const config = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }

        const formdata = new FormData();
        formdata.append("username", username);
        for (let filesdata of files) {
            formdata.append("userimg", filesdata);
        }

        const response = await axios.post("http://localhost:5000/user/api/galleryregister", formdata, config)
            .then((res) => res)
            .catch((error) => error);

        if (response.status === 200) {
            setUserName("");
            setFiles([]);
            toast.success("Images successfully uploaded!");
        } else {
            toast.error(response?.response?.data?.error || "Upload failed.");
        }
    }

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">📸 Upload Your Album</h2>
            <div className='d-flex justify-content-center'>
                <Card style={{ width: '100%', maxWidth: '500px', padding: '20px', boxShadow: '0 0 15px rgba(0,0,0,0.1)', borderRadius: '15px' }}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label><strong>Album Title</strong></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter a title"
                                value={username}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Select Images</strong></Form.Label>
                            <Form.Control
                                type="file"
                                onChange={handeFilechange}
                                multiple
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className='w-100'>
                            Upload Images
                        </Button>
                    </Form>
                </Card>
            </div>

            {files.length > 0 && (
                <Container className="mt-4">
                    <h5 className="text-center mb-3">🖼️ Image Preview</h5>
                    <div className="d-flex flex-wrap justify-content-center gap-3">
                        {files.map((element, index) => (
                            <Card key={index} style={{ width: '100px', height: "100px", overflow: 'hidden' }}>
                                <Card.Img
                                    variant="top"
                                    src={URL.createObjectURL(element)}
                                    style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                                />
                            </Card>
                        ))}
                    </div>
                </Container>
            )}
        </Container>
    );
}

export default GalleryRegister;
