import { NavbarRoutes } from "@/components/navbar-routes"

import { MobileSidebar } from "./mobile-sidebar"

export const Navbar = () => {
  return (
    <div className="h-full flex items-center">
      <MobileSidebar />
      <NavbarRoutes />
    </div>
  )
}