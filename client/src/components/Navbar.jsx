import React from 'react'
import logo from '../images/coffeeLogo.png'

const Navbar = () => {
    return (
        <nav className='w-full flex justify-center items-center p-4 gradient-bg-nav'>
            <div className='flex-initial justify-center items-center'>
                <h1 className='text-5xl text-white text-gradient py-5 '>Buy Hasher A Coffee</h1>
            </div>
        </nav>
    )
}

export default Navbar