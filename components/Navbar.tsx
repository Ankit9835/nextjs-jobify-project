import React from 'react'
import { UserButton } from '@clerk/nextjs'
import ThemeToogle from './ThemeToogle'
import DropdownLinks from './DropDownLinks'


const Navbar = () => {
  return (
    <nav className='bg-muted py-4 sm:px-16 lg:px-24 px-4 flex items-center justify-between'>
        <div>
          <DropdownLinks />
        </div>
        <div className='flex items-center gap-x-4'>
            < ThemeToogle />
            <UserButton afterSignOutUrl='/' />
        </div>
    </nav>
  )
}

export default Navbar
