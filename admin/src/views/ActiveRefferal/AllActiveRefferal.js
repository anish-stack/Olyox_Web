import React from 'react'
import {
  CTableDataCell,
  CTableRow,
  CSpinner,
  CPagination,
  CPaginationItem,
  CFormSwitch,
  CNavLink,
} from '@coreui/react'
import Table from '../../components/Table/Table'
import axios from 'axios'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'

function AllActiveRefferal() {
  const [referrals, setReferrals] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 10

  const handleFetchReferrals = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get('api/v1/get-all-referral')
      setReferrals(data.data || []) // Ensure default empty array
    } catch (error) {
      console.error('Error fetching referral:', error)
      toast.error('Failed to load referral. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  

  React.useEffect(() => {
    handleFetchReferrals()
  }, [])

  // Calculate paginated data
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentData = referrals.slice(startIndex, startIndex + itemsPerPage)

  // Calculate total pages
  const totalPages = Math.ceil(referrals.length / itemsPerPage)

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const heading = [
    'S.No',
    'Reffered By',
    'Name',
    'Contact Number',
    'State',
    'Is Registered',
    'Is Recharge',
  ]

  return (
    <>
      {loading ? (
        <div className="spin-style">
          <CSpinner color="primary" variant="grow" />
        </div>
      ) : referrals.length === 0 ? (
        <div className="no-data">
          <p>No data available</p>
        </div>
      ) : (
        <Table
          heading="All Active Referrals"
          btnText=""
          btnURL=""
          tableHeading={heading}
          tableContent={currentData.map((item, index) => (
            <CTableRow key={item._id}>
              <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
              <CTableDataCell>
                <a href={`#/vendor/vendor_detail/${item.vendor_id?._id}`}>{item.vendor_id?.name}</a>
              </CTableDataCell>
              <CTableDataCell>{item.name}</CTableDataCell>
              <CTableDataCell>{item.contactNumber}</CTableDataCell>
              <CTableDataCell>{item.state}</CTableDataCell>
              <CTableDataCell>{item.isRegistered ? 'Yes' : 'No'}</CTableDataCell>
              <CTableDataCell>{item.isRecharge ? 'Yes' : 'No'}</CTableDataCell>
            </CTableRow>
          ))}
          pagination={
            <CPagination className="justify-content-center">
              <CPaginationItem
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </CPaginationItem>
              {Array.from({ length: totalPages }, (_, index) => (
                <CPaginationItem
                  key={index}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </CPaginationItem>
              ))}
              <CPaginationItem
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </CPaginationItem>
            </CPagination>
          }
        />
      )}
    </>
  )
}

export default AllActiveRefferal
