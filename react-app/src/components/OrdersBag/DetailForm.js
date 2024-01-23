import React from 'react'

export default function DetailForm({detail}) {
  return (
    <form>
        <h1>Update your Order</h1>
        <label>
            Quantity:
            <input type="number"/>
        </label>
        <button>Update</button>
    </form>
  )
}
