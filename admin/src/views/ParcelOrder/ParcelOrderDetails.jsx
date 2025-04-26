import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CSpinner } from '@coreui/react';
import dayjs from 'dayjs';

const ParcelOrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`https://www.appapi.olyox.com/api/v1/parcel/get_parcel_order/${id}`);
      setOrder(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="spin-style"><CSpinner color="primary" variant="grow" /></div>;
  }

  if (!order) {
    return <p>No order found.</p>;
  }

  return (
    <div className="container">
      <h3>Parcel Order Details</h3>
      <hr />
      <p><strong>Ride ID:</strong> {order.ride_id}</p>
      <p><strong>Customer Name:</strong> {order.customerId?.name}</p>
      <p><strong>Phone:</strong> {order.phone}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Pickup Address:</strong> {order.locations?.pickup?.address}</p>
      <p><strong>Dropoff Address:</strong> {order.locations?.dropoff?.address}</p>
      <p><strong>Apartment:</strong> {order.apartment}</p>
      <p><strong>Saved As:</strong> {order.savedAs}</p>
      <p><strong>Vehicle:</strong> {order.vehicle_id?.title}</p>
      <p><strong>Fare:</strong> ₹{order.fares?.payableAmount}</p>
      <p><strong>Booking Date:</strong> {dayjs(order.createdAt).format('DD-MM-YYYY HH:mm')}</p>
      <hr />
      <h5>Delivery Status</h5>
      <p><strong>Parcel Picked:</strong> {order.is_parcel_picked ? 'Yes' : 'No'}</p>
      <p><strong>Parcel Delivered:</strong> {order.is_parcel_delivered ? 'Yes' : 'No'}</p>
      <p><strong>Driver Reached Pickup:</strong> {order.is_driver_reached ? 'Yes' : 'No'}</p>
      <p><strong>Driver Reached Dropoff:</strong> {order.is_driver_reached_at_deliver_place ? 'Yes' : 'No'}</p>
    </div>
  );
};

export default ParcelOrderDetails;
