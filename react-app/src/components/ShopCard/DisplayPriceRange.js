import React from 'react'

export default function DisplayPriceRange({priceRange, onClickFunction}) {

    // diff colors by class
    // way to track values
    const onClick = onClickFunction || console.log;

    const style = value => {
        return value <= priceRange ? {color: "var(--textColor)"} : {color: "var(--boxShadowColor)"}
    }

    return (
        <div className='price-range-display'>
            {
                [1,2,3,4,5].map(value => (
                    <button value={value} onClick={(e)=>console.log(e)} key={value}>
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
