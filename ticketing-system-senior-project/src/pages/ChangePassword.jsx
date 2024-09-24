import React from 'react'

const ChangePassword = () => {
  return (
    <>
    <form>
    <div className="form-group">
      <label htmlFor="formGroupExampleInput">Enter new password</label>
      <input type="text" className="form-control" id="formGroupExampleInput" placeholder="New password" />
    </div>
    <div className="form-group">
      <label htmlFor="formGroupExampleInput2">Enter new password again</label>
      <input type="text" className="form-control" id="formGroupExampleInput2" placeholder="New password" />
    </div>
    <button
        className="btn btn-primary"
        href="/"
      >
        Submit
      </button>
  </form>
  </>
  )
}

export default ChangePassword