import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { thunkUpdateBalance } from '../../store/session'

export default function ManageBalancePage() {
    const sessionUser = useSelector(state => state.session.user)
    const dispatch = useDispatch()

    const addMoney = 200

    const increaseBalance = async e => {
        await dispatch(thunkUpdateBalance(addMoney))
    }

    return (
        <div id="view-current-addresses-container manage-balance-page-container">
            <h1>Your Current Balance: ${sessionUser.balance}</h1>
            <h3 style={{margin: "12px 0"}}>Increase Your Balance:</h3>
            <div id="cool-links-container">
                <a rel="noreferrer" target="_blank" href="https://github.com/sophiatsau">
                    <button className='add-money-button' onClick={increaseBalance}>
                        <div className='amount-added'>+ ${addMoney}</div>
                        <div>Check out my Github</div>
                        <img className="money-button-image" src="https://crittr-images.s3.us-west-1.amazonaws.com/github.png" alt="github icon"/>
                    </button>
                </a>
                <a rel="noreferrer" target="_blank" href="https://www.linkedin.com/in/sophiatsau/">
                    <button className='add-money-button' onClick={increaseBalance}>
                        <div className='amount-added'>+ ${addMoney}</div>
                        <div>Check out my LinkedIn</div>
                        <img className="money-button-image" src="https://crittr-images.s3.us-west-1.amazonaws.com/LinkedIn_icon_circle.svg.png" alt="linkedin icon"/>
                    </button>
                </a>
                <a rel="noreferrer" target="_blank" href="https://sophiatsau.github.io/">
                    <button className='add-money-button' onClick={increaseBalance}>
                        <div className='amount-added'>+ ${addMoney}</div>
                        <div>Check out my Portfolio Site</div>
                        <img className="money-button-image" src="https://crittr-images.s3.us-west-1.amazonaws.com/browser-icon-bold.png" alt="portfolio icon"/>
                    </button>
                </a>
                <a rel="noreferrer" target="_blank" href="https://spotifrog.onrender.com/">
                    <button className='add-money-button' onClick={increaseBalance}>
                        <div className='amount-added'>+ ${addMoney}</div>
                        <div>Listen to music, upload albums, and build playlists on a frog-themed Spotify lookalike</div>
                        <img className="money-button-image" src="https://spotifrogmp3.s3.us-west-1.amazonaws.com/IMG_0034-1.png" alt="spotifrog icon"/>
                    </button>
                </a>
                <a rel="noreferrer" target="_blank" href="https://infestation.onrender.com/">
                    <button className='add-money-button' onClick={increaseBalance}>
                        <div className='amount-added'>+ ${addMoney}</div>
                        <div>A Meetup clone for cockroaches to establish social groups and create events</div>
                        <img className="money-button-image" src="https://64.media.tumblr.com/3cb9180466d6edf0203d313e97c04cdb/40017b7f673771aa-60/s2048x3072/b3536f24eff16ec0595e0ab4e5789634cf1b518e.jpg" alt="infestation icon"/>
                    </button>
                </a>
            </div>
        </div>
    )
}
