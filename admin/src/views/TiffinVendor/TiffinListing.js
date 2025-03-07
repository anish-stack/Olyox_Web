import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const TiffinListing = () => {
  const { id } = useParams();
  const [foodList, setFoodList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Change to desired items per page

  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        `https://demoapi.olyox.com/api/v1/tiffin/get_all_food_listing/${id}`
      );
      console.log('data', data);
      setFoodList(data.data);
    } catch (error) {
      console.log('Internal server error', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // Pagination Logic (Frontend)
  const totalPages = Math.ceil(foodList.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = foodList.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="text-center display-4 mb-3">Menu</h1>
        </div>
      </div>

      <div className="row g-4">
        {currentItems.map((food) => (
          <div key={food._id} className="col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-sm hover-shadow-lg transition-all">
              <div className="position-relative">
                <img
                  src={food.images.url}
                  className="card-img-top"
                  alt={food.food_name}
                  style={{ height: '250px', objectFit: 'cover' }}
                />
                <span className="position-absolute top-0 end-0 m-3 badge bg-success">
                  {food.food_category}
                </span>
              </div>

              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="card-title mb-0">{food.food_name}</h5>
                  <span className="fs-5 fw-bold text-primary">₹{food.food_price}</span>
                </div>

                <p className="card-text text-muted mb-3">{food.description}</p>

                <div className="mb-3">
                  <h6 className="mb-2 text-muted">What's Included:</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {food.what_includes.map((item, index) => (
                      <span key={index} className="badge bg-light text-dark">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {!food.food_availability && (
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                  style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
                >
                  <h3 className="text-white">Currently Unavailable</h3>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {foodList.length === 0 && (
        <div className="text-center py-5">
          <h3 className="text-muted">No food items available</h3>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <button
            className="btn btn-outline-primary me-2"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              className={`btn ${currentPage === index + 1 ? 'btn-primary' : 'btn-outline-primary'} mx-1`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            className="btn btn-outline-primary ms-2"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TiffinListing;
