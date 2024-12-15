import Link from "next/link";
import React from "react";

type Props = {};

const Navbar = async (props: Props) => {
  return (
    <header className="fixed right-0 left-0 top-0 py-4 bg-black40 backdrop-blur-lg z-[100] fkex items-center border-b-[1px] border-neutral-900 justify-between">
      <aside className="flex items-center gap-[2px] container mx-auto">
        <h1 className="text-3xl font-semibold leading-tighter">ora</h1>
      </aside>
      <nav className="absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%] hidden md:block">
        <ul className="flex items-center gap-4 line-none">
          <li>
            <Link href={"#"}>Products</Link>
          </li>
          <li>
            <Link href={"#"}>Pricing</Link>
          </li>
          <li>
            <Link href={"#"}>Clients</Link>
          </li>
          <li>
            <Link href={"#"}>Resources</Link>
          </li>
          <li>
            <Link href={"#"}>Documentation</Link>
          </li>
          <li>
            <Link href={"#"}>Enterprise</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
