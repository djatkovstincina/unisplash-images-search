import { useRef, useState, useEffect, useCallback } from 'react';
import './index.css';
import { Form, Alert, Button } from 'react-bootstrap';
import axios from 'axios';

const API_URL = 'https://api.unsplash.com/search/photos'; 
const IMAGES_PER_PAGE = 15;

function App () {
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [totalPages, setTotalPages] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);

  const fetchImages = useCallback(async () => {
    try {
      if (searchInput.current.value) {
        setLoading(true);
        setIsInvalid(false);
        const { data } = await axios.get(
          `${API_URL}?query=${
            searchInput.current.value
          }&page=${
            page
          }&per_page=${
            IMAGES_PER_PAGE
          }&client_id=${
            import.meta.env.VITE_API_KEY
          }`
        );
        console.log('data', data);
        setImages(data.results);
        setTotalPages(data.total_pages);
        setLoading(false);
      } else {
        setIsInvalid(true);
      }
    } catch (error) {
      console.log('Error fetching images', error);
      setLoading(false);
    }
  }, [page]);

  useEffect( () => {
    if (searchInput.current.value) {
      fetchImages();
    }
  }, [fetchImages]);

  const resetSearch = () => {
    setPage(1);
    fetchImages();
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchInput.current.value.trim()) {
      resetSearch();
    } else {
      setIsInvalid(true);
    }
  };

  const handleSelection = (selection) => {
    searchInput.current.value = selection;
    resetSearch();
  };

  return (
    <div className='container'>
      <h1 className='title'>Image Search</h1>
      <div className='search-section'>
        <Form onSubmit={handleSearch}>
          <Form.Control
            type='search'
            placeholder='Type something to search...'
            className='search-input'
            ref={searchInput}
            isInvalid={isInvalid}
          />
          <Form.Control.Feedback type="invalid">
            Please enter a search term.
          </Form.Control.Feedback>
        </Form>
      </div>
      <div className='filters mb-4'>
        <div onClick={() => handleSelection("fishing")}>Fishing</div>
        <div onClick={() => handleSelection("dogs")}>Dogs</div>
        <div onClick={() => handleSelection("cats")}>Cats</div>
        <div onClick={() => handleSelection("shoes")}>Shoes</div>
      </div>
      {loading ? (
        <p className='loading'>Loading...</p>
      ) : (
        <>
          {!images.length && totalPages === 0 && (
            <Alert 
              key='warning'
              variant='warning'
            >
              No images found!
            </Alert>
          )}
          <div className='images'>
            {images.map((image) => (
                <img
                  key={image.id}
                  src={image.urls.small}
                  alt={image.alt_description}
                  className='image'
                  loading="lazy"
                />
              ))
            }
          </div>
          <div className='buttons'>
            {page > 1 && <Button onClick={() => setPage(page - 1)}>Previous</Button>}
            {page < totalPages && <Button onClick={() => setPage(page + 1)}>Next</Button>}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
