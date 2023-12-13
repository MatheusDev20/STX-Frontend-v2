import React from 'react'
import { Navigation } from './Navigation'
import { Link } from 'react-router-dom'
import { Logo } from '../Logo'

export const Sidebar = (): React.JSX.Element => {
  return (
    <aside
      className={`flex md:w-[200px] w-[80px] border-solid border-neutral border-r-[0.4px] flex-col gap-2 h-screen justify-between bg-base-300`}
    >
      <div className="relative">
        <header className="flex items-center justify-center py-12 ">
          <Link to="/app/home">
            <Logo />
          </Link>
        </header>
        <Navigation />
      </div>
      {/* <ThemeSwitch /> */}
    </aside>
  )
}
