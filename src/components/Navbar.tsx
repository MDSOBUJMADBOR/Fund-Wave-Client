"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiHome } from "react-icons/hi2";
import { HiMenu, HiX } from "react-icons/hi";
import { useState } from "react";
// import { authClient, useSession } from "@/lib/auth-client";

const navLinks = [
  {
    title: "Explore Campaigns",
    href: "/",
  },
  {
    title: "How it Works",
    href: "/howitworks",
  },
  {
    title: "About Us",
    href: "/about",
  },  
  {
    title: "Contact",
    href: "/contact",
  },
];

export default function Navbar() {
    const [open, setOpen] = useState(false); 
  const pathname = usePathname();

// const { data: session } = useSession(); 
// const role = (session?.user as any)?.role;
// console.log(role,'role');

//   const userData = authClient.useSession();  
// const user = userData.data?.user;  
// console.log(user?.name,'user');

if(pathname.includes('/dashboard')){
  return null; 
}


const handleSignOut = async () => {
  await authClient.signOut();
};



  return (
    <header className="border-b border-gray-200 sticky top-0 bg-white z-50 w-full  shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <HiHome className="text-3xl text-[#8200db]" />
          <h1 className="text-2xl font-bold">
            <span className="text-gray-900">Fund</span>
            <span className="text-[#8200db]">Wave</span>
          </h1>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-4">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;

              return (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className={`rounded-md px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-[#8200db] text-white"
                        : "text-black hover:bg-[#e0dce2] hover:text-[#a273c4]"
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>


<div className="flex gap-2">
     <Link href="/login">
        <button className="rounded-md border border-blue-600 px-5 py-2 text-blue-600 hover:bg-blue-50 cursor-pointer">
          login
        </button>
      </Link>
 <Link href="/register">
        <button className="rounded-md border border-blue-600 px-5 py-2 text-blue-600 hover:bg-blue-50 cursor-pointer">
          register
        </button>
      </Link>
<a
  href="https://github.com/MDSOBUJMADBOR/Fund-Wave-Client"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-block rounded-md  px-5 py-2 text-white bg-[#8200db] font-semibold"
>
  Join as Developer
</a>
</div>






        {/* Buttons */}
       {/* <div className="hidden items-center gap-4 md:flex">
  {user ? (
    <>
      <span className="font-medium text-gray-700">
        Hi, {user.name}
      </span>

      <Link href={`/dashboard/${role}/overview`}>
        <button className="rounded-md bg-green-600 px-5 py-2 text-white hover:bg-green-700 cursor-pointer">
          Dashboard
        </button>
      </Link>

      <Link href="/profile">
        <button className="rounded-md border border-blue-600 px-5 py-2 text-blue-600 hover:bg-blue-50 cursor-pointer">
          Profile
        </button>
      </Link>

      <button
        onClick={handleSignOut}
        className="rounded-md bg-red-600 px-5 py-2 text-white hover:bg-red-700 cursor-pointer"
      >
        Logout
      </button>
    </>
  ) : (
    <>
      <Link href="/signin">
        <button className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 cursor-pointer">
          Login
        </button>
      </Link>

      <Link href="/signup">
        <button className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 cursor-pointer">
          Register
        </button>
      </Link>
    </>
  )}
</div> */}









        {/* Mobile Button */}
        <button
          onClick={() => setOpen(!open)}
          className="text-3xl md:hidden"
        >
          {open ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t bg-white md:hidden">
          <div className="space-y-3 px-6 py-6">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-md px-4 py-2 transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {item.title}
                </Link>
              );
            })}

       {/* {user ? (
  <div className="mt-4 flex flex-col gap-3">
    <div className="rounded-md bg-gray-100 p-3">
      <p className="font-semibold">{user.name}</p>
      <p className="text-sm text-gray-500">{user.email}</p>
    </div>

    <Link
      href={`/dashboard/${role}/overview`}
      onClick={() => setOpen(false)}
    >
      <button className="w-full rounded-md bg-green-600 py-2 text-white cursor-pointer">
        Dashboard
      </button>
    </Link>

    <Link href="/profile" onClick={() => setOpen(false)}>
      <button className="w-full rounded-md border border-blue-600 py-2 text-blue-600 cursor-pointer">
        Profile
      </button>
    </Link>

    <button
      onClick={handleSignOut}
      className="w-full rounded-md bg-red-600 py-2 text-white cursor-pointer"
    >
      Logout
    </button>
  </div>
) : (
  <div className="mt-4 flex flex-col gap-3">
    <Link href="/signin">
      <button className="w-full rounded-md bg-blue-600 py-2 text-white cursor-pointer">
        Login
      </button>
    </Link>

    <Link href="/signup">
      <button className="w-full rounded-md bg-blue-600 py-2 text-white cursor-pointer">
        Register
      </button>
    </Link>
  </div>
)} */}



          </div>
        </div>
      )}
    </header>
  );
}