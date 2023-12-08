import React from 'react'
import { DAYS, CATEGORIES, formatBusinessHours } from '../../store/utils';

export default function ShopFormHours({businessHours, handleHoursUpdate, errors}) {
  return (
    <section className='shop-form-hours'>
      <h3>3. Add your business hours:</h3>
      <div className='business-hours-form'>
      {DAYS.map(day => (
        <div key={day} className='daily-business-hours'>
          <input
            type="checkbox"
            name={`${day} active`}
            value={businessHours[day].active}
            checked={businessHours[day].active}
            onChange={handleHoursUpdate}
            style={{border: "1px red solid"}}
          />
          {day}:
          <label>
            Open:
            <input
              type="time"
              name={`${day} open`}
              value={businessHours[day].open}
              onChange={handleHoursUpdate}
              disabled={!businessHours[day].active}
              pattern="[0-9]{2}:[0-9]{2}"
            />
          </label>
          <label>
            Close:
            <input
              type="time"
              name={`${day} close`}
              value={businessHours[day].close}
              onChange={handleHoursUpdate}
              disabled={!businessHours[day].active}
              pattern="[0-9]{2}:[0-9]{2}"
            />
          </label>
        </div>
      ))}
      </div>
      {errors.businessHours && <div className='error'>{errors.businessHours}</div>}
    </section>
  )
}
