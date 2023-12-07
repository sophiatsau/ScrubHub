import React from 'react';
import { CATEGORIES } from '../../store/utils';


export default function ShopFormCategories({categories, errors, handleCategoryUpdate}) {
  return (
    <section className="choose-categories-form-section">
        <h3>4. Select categories for your shop:</h3>
        <div id="choose-categories-form">
        {CATEGORIES.map(cat => (
          <label key={cat} className='choose-categories-input'>
            <input
              type="checkbox"
              name={`${cat}`}
              onChange={handleCategoryUpdate}
              checked={categories.has(cat)}
              />
            {cat}
          </label>
        ))}
        </div>
        {errors.categories && <div className='error'>{errors.categories}</div>}
    </section>
  )
}
