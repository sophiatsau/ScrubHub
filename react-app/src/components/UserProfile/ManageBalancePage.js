import React from 'react'
import { useSelector } from 'react-redux'

export default function ManageBalancePage() {
    const sessionUser = useSelector(state => state.session.user)

    const addMoney = 200

    const increaseBalance = console.log

    return (
        <div id="view-current-addresses-container manage-balance-page-container">
            <h1>Your Current Balance: ${sessionUser.balance}</h1>
            <h3 style={{margin: "12px 0"}}>Increase Your Balance:</h3>
            <div id="cool-links-container">
                <a target="_blank" href="https://github.com/sophiatsau">
                    <button className='add-money-button' onClick={increaseBalance}>
                        <div className='amount-added'>+ ${addMoney}</div>
                        <div>Check out my Github</div>
                        <img className="money-button-image" src="https://crittr-images.s3.us-west-1.amazonaws.com/github.png" alt="github icon"/>
                    </button>
                </a>
                <a target="_blank" href="https://www.linkedin.com/in/sophiatsau/">
                    <button className='add-money-button' onClick={increaseBalance}>
                        <div className='amount-added'>+ ${addMoney}</div>
                        <div>Check out my LinkedIn</div>
                        <img className="money-button-image" src="https://crittr-images.s3.us-west-1.amazonaws.com/LinkedIn_icon_circle.svg.png" alt="linkedin icon"/>
                    </button>
                </a>
                <a target="_blank" href="">
                    <button className='add-money-button' onClick={increaseBalance}>
                        <div className='amount-added'>+ ${addMoney}</div>
                        <div>Check out my Portfolio Site</div>
                    </button>
                </a>
                <a target="_blank" href="">
                    <button className='add-money-button' onClick={increaseBalance}>
                        <div className='amount-added'>+ ${addMoney}</div>
                        <div>Listen to music, upload albums, and build personal playlists on a frog-themed Spotify lookalike</div>
                    </button>
                </a>
                <a target="_blank" href="">
                    <button className='add-money-button' onClick={increaseBalance}>
                        <div className='amount-added'>+ ${addMoney}</div>
                        <div>A Meetup clone for cockroaches to establish social groups and create events</div>
                    </button>
                </a>
            </div>
        </div>
    )
}
