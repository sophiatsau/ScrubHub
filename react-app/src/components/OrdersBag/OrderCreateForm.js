import React, {useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useModal } from '../../context/Modal'
import { thunkStartOrder } from '../../store/orders'

export default function OrderCreateForm({critter}) {
  const shop = useSelector(state => state.shops[critter.shopId])
  const [quantity, setQuantity] = useState(1)
  const [orderType, setOrderType] = useState(null)
  const dispatch = useDispatch()
  const {closeModal} = useModal()

  if (!shop) return null;

  const updateQuantity = (e) => {
    setQuantity(Math.floor(e.target.value))
  }

  const updateOrderType = (e) => {
    setOrderType(e.target.value)
  }

  const newPrice = (Math.round(100 * quantity * critter.price) / 100)

  const handleFormSubmit = e => {
    e.preventDefault()

    const formData = {
      shopId: critter.shopId,
      orderType,
      critterId: critter.id,
      quantity,
    }

    dispatch(thunkStartOrder(formData))
    closeModal()
  }

  return (
    <form className="bag-detail-form" onSubmit={handleFormSubmit}>
        <div className='bag-detail-form-content'>
            {critter.previewImageUrl && <img src={critter.previewImageUrl} alt={critter.name}/>}
            <h1>{critter.name} </h1>
            <p className="species" >{critter.species}</p>
            <p>{critter.description}</p>
            <div className='thin-light-border' />
            <label>
                Quantity:
                <input
                    type="number"
                    min={1}
                    max={critter.stock}
                    value={quantity}
                    onChange={updateQuantity}
                />
            </label>
            {
              !shop.pickup && !shop.delivery ?
              <div className='error'>This critter is not available for pickup or delivery at this time.</div>
              :
              <div className="create-order-select-type">
                Order Type:
                {shop.pickup && <>
                  <input
                      id="order-create-form-pickup"
                      type="radio"
                      value="Pickup"
                      onChange={updateOrderType}
                      name="orderType"
                  />
                  <label htmlFor="order-create-form-pickup">
                    Pickup
                  </label>
                </>}
                {shop.delivery && <>
                  <input
                      id="order-create-form-delivery"
                      type="radio"
                      value="Delivery"
                      onChange={updateOrderType}
                      name="orderType"
                  />
                  <label htmlFor="order-create-form-delivery">
                    Delivery
                  </label>
                  </>}
              </div>
            }
            <p className="species" >{critter.stock} left in stock</p>
        </div>
        <button className={`purple-button modal-button ${orderType ? "" : "disabled"}`}>Add to bag: {newPrice.toFixed(2)}</button>
    </form>
  )
}
