import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CNavLink,
} from '@coreui/react'

function Form({ heading, btnText, btnURL, formContent, onSubmit, customBackHandler }) {
  return (
    <CCol xs={12}>
      <CCard className="mb-4">
        <CCardHeader
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h3 className="m-0">{heading}</h3>
          {customBackHandler ? (
            <CButton
              color="light"
              className="btn btn-ghost-primary active p-1 px-2"
              onClick={customBackHandler}
            >
              {btnText}
            </CButton>
          ) : (
            <CNavLink
              className="btn btn-ghost-primary active p-1 px-2"
              href={`#${btnURL}`}
              active
            >
              {btnText}
            </CNavLink>
          )}
        </CCardHeader>
        <CCardBody>
          <CForm className="row g-3" onSubmit={onSubmit}>
            {formContent}
          </CForm>
        </CCardBody>
      </CCard>
    </CCol>
  )
}

export default Form
