import {Navbar} from "./_components/navbar";
import {Sidebar} from "./_components/sidebar";

const DashboardLayout = ({
                           children
                         }: {
  children: React.ReactNode;
}) => {
  return (
    <div className="h-full w-full flex">
      <div className="hidden md:flex h-screen w-[250px] flex-col bg-white">
        <Sidebar/>
      </div>
      <main className="h-full w-full md:w-[calc(100%-250px)] bg-[#F6F7F9] overflow-y-auto">
        <div className="h-[80px] w-full z-50">
          <Navbar/>
        </div>
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;