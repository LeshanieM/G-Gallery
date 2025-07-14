import 'bootstrap/dist/css/bootstrap.min.css';
import Headers from './components/Headers';
import { Toaster } from 'react-hot-toast';
import { Routes, Route } from 'react-router-dom';
import GalleryPublic from './pages2/pubUserGallery';
import GalleryPublicAdmin from './pages2/pubGalleryAdminView';
import GalleryRegister from './pages2/pubGalleryRegister';
import Gallery from './pages2/pubGallery';


function App() {
  return (
    <>
      <Headers />
      <Routes>
        <Route path="/" element={<Gallery />} />
        <Route path="/gallerypublic" element={<GalleryPublic />} />
        <Route path="/publicgalleryregister" element={<GalleryRegister />} />
        <Route path="/gallerypublicadmin" element={<GalleryPublicAdmin />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
