import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const RiderTime = () => {
  const { id } = useParams();
  const [riderTime, setRiderTime] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  const fetchRiderTime = async () => {
    try {
      const { data } = await axios.get(
        `https://www.appapi.olyox.com/api/v1/rides/get_riders_times_by_rider_id/${id}`
      );
      setRiderTime(data.data.reverse());
    } catch (error) {
      console.log('Internal server error', error);
    }
  };

  useEffect(() => {
    fetchRiderTime();
  }, [id]);

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Still Online';
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateTotalDuration = (sessions) => {
    return sessions.reduce((total, session) => total + (session.duration || 0), 0);
  };

  // **Filter Data Based on Selected Date**
  const filteredData = selectedDate
    ? riderTime.filter((record) => record.date.startsWith(selectedDate))
    : riderTime;

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Rider Activity Timeline</h1>

      {/* Date Picker */}
      <div className="mb-4 text-center">
        <label className="me-2 fw-bold">Select Date:</label>
        <input
          type="date"
          className="form-control d-inline-block w-auto"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        {selectedDate && (
          <button
            className="btn btn-danger ms-2"
            onClick={() => setSelectedDate('')}
          >
            Clear
          </button>
        )}
      </div>

      {filteredData.map((dayRecord) => (
        <div key={dayRecord._id} className="card mb-4 shadow-sm">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">{formatDate(dayRecord.date)}</h5>
            <div>
              <span className={`badge ${dayRecord.status === 'online' ? 'bg-success' : 'bg-danger'} me-2`}>
                {dayRecord.status.toUpperCase()}
              </span>
              <span className="badge bg-info">
                Total Duration: {calculateTotalDuration(dayRecord.sessions)} minutes
              </span>
            </div>
          </div>

          <div className="card-body">
            <div className="timeline">
              {dayRecord.sessions.map((session, index) => (
                <div key={session._id} className="border-start border-2 ps-4 pb-4 position-relative">
                  <div className="position-absolute" style={{ left: '-0.5rem', top: '0' }}>
                    <div className="bg-primary rounded-circle" style={{ width: '1rem', height: '1rem' }}></div>
                  </div>

                  <div className="card border-0 shadow-sm">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0">Session {index + 1}</h6>
                        <span className="badge bg-secondary">
                          {session.duration !== null ? `${session.duration} minutes` : 'Ongoing'}
                        </span>
                      </div>

                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="d-flex align-items-center">
                            <div className="bg-success rounded-circle me-2" style={{ width: '8px', height: '8px' }}></div>
                            <small className="text-muted">Online:</small>
                            <span className="ms-2">{formatTime(session.onlineTime)}</span>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="d-flex align-items-center">
                            <div className="bg-danger rounded-circle me-2" style={{ width: '8px', height: '8px' }}></div>
                            <small className="text-muted">Offline:</small>
                            <span className="ms-2">{formatTime(session.offlineTime)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {filteredData.length === 0 && (
        <div className="text-center py-5">
          <div className="alert alert-info">No activity records found for this rider.</div>
        </div>
      )}
    </div>
  );
};

export default RiderTime;
