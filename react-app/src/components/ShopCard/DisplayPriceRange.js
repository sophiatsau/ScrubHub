import React from 'react'

export default function DisplayPriceRange({priceRange, onClickFunction, name=""}) {
console.log("🚀 ~ file: DisplayPriceRange.js:4 ~ DisplayPriceRange ~ priceRange:", priceRange)

    // diff colors by class
    // way to track values
    const onClick = onClickFunction || console.log;

    const style = value => {
        return value <= priceRange ? {color: "var(--textColor)", pointerEvents:"none"} : {color: "var(--boxShadowColor)", pointerEvents:"none"}
    }

    return (
        <div className='price-range-display'>
            {
                [1,2,3,4,5].map(value => (
                    <button type="button" value={value} onClick={onClick}>
                        <i
                            className={"fa-solid fa-dollar-sign"}
                            style={style(value)}
                        />
                    </button>
                ))
            }
        </div>
    )
}
