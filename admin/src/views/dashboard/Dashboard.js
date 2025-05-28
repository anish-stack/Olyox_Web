import React, { useEffect, useState } from 'react';
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CWidgetStatsF,
  CSpinner,
} from '@coreui/react';
import { CChart } from '@coreui/react-chartjs';
import { cilPeople, cilUserFollow, cilMoney, cilWallet, cilBank } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const Dashboard = () => {
  const token = sessionStorage.getItem('token');
  const [loading, setLoading] = useState(false);
  const [providerStats, setProviderStats] = useState({});
  const [userStats, setUserStats] = useState({});

  const fetchProviders = async () => {
    try {
      const { data } = await axios.get('https://www.webapi.olyox.com/api/v1/all_vendor');
      const providers = data.data;

      // Sort providers by newest first
      const sortedByDate = [...providers].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Get today's date range
      const today = new Date();
      const startOfToday = new Date(today.setHours(0, 0, 0, 0));
      const endOfToday = new Date(today.setHours(23, 59, 59, 999));

      // Last 7 days
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);

      // Last 30 days
      const lastMonth = new Date();
      lastMonth.setDate(lastMonth.getDate() - 30);

      // Filters
      const todayJoin = providers.filter(p => new Date(p.createdAt) >= startOfToday && new Date(p.createdAt) <= endOfToday);
      const lastWeekJoin = providers.filter(p => new Date(p.createdAt) >= lastWeek);
      const lastMonthJoin = providers.filter(p => new Date(p.createdAt) >= lastMonth);
      const rechargeDone = providers.filter(p => p.payment_id !== null);

      // Summary counts
      setProviderStats({
        totalProviders: providers.length,
        todayJoinCount: todayJoin.length,
        lastWeekJoinCount: lastWeekJoin.length,
        lastMonthJoinCount: lastMonthJoin.length,
        rechargeDoneCount: rechargeDone.length,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch providers');
    }
  };

  const handleFetchAppUser = async () => {
    try {
      const { data } = await axios.get('https://appapi.olyox.com/api/v1/user/get_all_user');
      const userData = data.data;

      // Get today's date range
      const today = new Date();
      const startOfToday = new Date(today.setHours(0, 0, 0, 0));
      const endOfToday = new Date(today.setHours(23, 59, 59, 999));

      // Last 7 days
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);

      // Last 30 days
      const lastMonth = new Date();
      lastMonth.setDate(lastMonth.getDate() - 30);

      // Helper function to handle date fallback logic (createdAt or otpExpiresAt)
      const getValidDate = (user) => {
        return user.createdAt ? new Date(user.createdAt) : new Date(user.otpExpiresAt);
      };

      // Filters
      const todayJoin = userData.filter(user => getValidDate(user) >= startOfToday && getValidDate(user) <= endOfToday);
      const lastWeekJoin = userData.filter(user => getValidDate(user) >= lastWeek);
      const lastMonthJoin = userData.filter(user => getValidDate(user) >= lastMonth);

      // Stats object
      setUserStats({
        totalUsers: userData.length,
        todayJoinCount: todayJoin.length,
        lastWeekJoinCount: lastWeekJoin.length,
        lastMonthJoinCount: lastMonthJoin.length,
      });
    } catch (error) {
      toast.error('Failed to load user records');
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchProviders(), handleFetchAppUser()])
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  return (
    <>
      <div className="dashboard-container">
        <h2 className="dashboard-title">Welcome to Olyox Dashboard</h2>

        <CRow>
          {/* Provider Stats */}
          <CCol lg={3} sm={6} className="mb-4">
            <CCard>
              <CCardBody>
                <CWidgetStatsF
                  className="mb-3"
                  color="info"
                  value={providerStats.totalProviders}
                  title="Total Providers"
                  icon={<CIcon icon={cilPeople} />}
                />
              </CCardBody>
            </CCard>
          </CCol>

          <CCol lg={3} sm={6} className="mb-4">
            <CCard>
              <CCardBody>
                <CWidgetStatsF
                  className="mb-3"
                  color="success"
                  value={providerStats.todayJoinCount}
                  title="Joined Today"
                  icon={<CIcon icon={cilUserFollow} />}
                />
              </CCardBody>
            </CCard>
          </CCol>

          <CCol lg={3} sm={6} className="mb-4">
            <CCard>
              <CCardBody>
                <CWidgetStatsF
                  className="mb-3"
                  color="warning"
                  value={providerStats.lastWeekJoinCount}
                  title="Joined Last Week"
                  icon={<CIcon icon={cilMoney} />}
                />
              </CCardBody>
            </CCard>
          </CCol>

          <CCol lg={3} sm={6} className="mb-4">
            <CCard>
              <CCardBody>
                <CWidgetStatsF
                  className="mb-3"
                  color="danger"
                  value={providerStats.rechargeDoneCount}
                  title="Providers with Recharge"
                  icon={<CIcon icon={cilWallet} />}
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <CRow>
          {/* User Stats */}
          <CCol lg={3} sm={6} className="mb-4">
            <CCard>
              <CCardBody>
                <CWidgetStatsF
                  className="mb-3"
                  color="info"
                  value={userStats.totalUsers}
                  title="Total Users"
                  icon={<CIcon icon={cilPeople} />}
                />
              </CCardBody>
            </CCard>
          </CCol>

          <CCol lg={3} sm={6} className="mb-4">
            <CCard>
              <CCardBody>
                <CWidgetStatsF
                  className="mb-3"
                  color="success"
                  value={userStats.todayJoinCount}
                  title="Joined Today"
                  icon={<CIcon icon={cilUserFollow} />}
                />
              </CCardBody>
            </CCard>
          </CCol>

          <CCol lg={3} sm={6} className="mb-4">
            <CCard>
              <CCardBody>
                <CWidgetStatsF
                  className="mb-3"
                  color="warning"
                  value={userStats.lastWeekJoinCount}
                  title="Joined Last Week"
                  icon={<CIcon icon={cilMoney} />}
                />
              </CCardBody>
            </CCard>
          </CCol>

          <CCol lg={3} sm={6} className="mb-4">
            <CCard>
              <CCardBody>
                <CWidgetStatsF
                  className="mb-3"
                  color="danger"
                  value={userStats.lastMonthJoinCount}
                  title="Joined Last Month"
                  icon={<CIcon icon={cilBank} />}
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>
    </>
  );
};

export default Dashboard;
