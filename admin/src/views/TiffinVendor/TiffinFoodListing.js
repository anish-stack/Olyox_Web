import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const TiffinFoodListing = () => {
  const { id } = useParams()
  const [foodList, setFoodList] = useState([])

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3100/api/v1/tiffin/get_all_package_listing/${id}`)
      console.log("data", data)
      setFoodList(data.data)
    } catch (error) {
      console.log("Internal server error", error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  const renderMealItems = (items) => {
    return items.map((item, index) => (
      <div key={item._id} className="d-flex justify-content-between align-items-center mb-2">
        <span>{item.name}</span>
        <span className="badge bg-primary">₹{item.price}</span>
      </div>
    ))
  }

  return (
    <div className="container py-5">
      <h1 className="text-center mb-5">Tiffin Food Packages</h1>
      <div className="row g-4">
        {foodList.map((package_) => (
          <div key={package_._id} className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm">
              {package_.images?.url && (
                <img 
                  src={package_.images.url} 
                  className="card-img-top" 
                  alt={package_.packageName || 'Food Package'}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">
                  {package_.packageName || 'Food Package'}
                  {package_.isThisTopPackage && (
                    <span className="badge bg-warning ms-2">Top Package</span>
                  )}
                </h5>
                <div className="mb-3">
                  <span className="badge bg-success me-2">
                    {package_.preferences.isVeg ? 'Veg' : 'Non-Veg'}
                  </span>
                  <span className="badge bg-info me-2">
                    {package_.preferences.spiceLevel} spice
                  </span>
                  <span className="badge bg-secondary">
                    {package_.duration} days
                  </span>
                </div>

                {package_.meals.breakfast.enabled && (
                  <div className="mb-3">
                    <h6 className="border-bottom pb-2">Breakfast</h6>
                    {renderMealItems(package_.meals.breakfast.items)}
                  </div>
                )}

                {package_.meals.lunch.enabled && (
                  <div className="mb-3">
                    <h6 className="border-bottom pb-2">Lunch</h6>
                    {renderMealItems(package_.meals.lunch.items)}
                  </div>
                )}

                {package_.meals.dinner.enabled && (
                  <div className="mb-3">
                    <h6 className="border-bottom pb-2">Dinner</h6>
                    {renderMealItems(package_.meals.dinner.items)}
                  </div>
                )}

                <div className="d-flex justify-content-between align-items-center mt-4">
                  <h5 className="mb-0">Total Price: ₹{package_.totalPrice}</h5>
                  {/* <button className="btn btn-primary">
                    Subscribe Now
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TiffinFoodListing