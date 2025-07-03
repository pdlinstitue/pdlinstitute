"use client";
import React, { useState } from "react";
import Link from "next/link"; 
import Image from "next/image"; 
import Container from "../Container";
import LogMenu from "../submenus/LogMenu";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";



const NavMenu : React.FC = () => { 
        
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);

    return ( 
        <div className='sticky top-0 w-full bg-white z-30 shadow-xl h-auto'>         
             <Container>
                <div className="hidden md:flex  justify-between items-center h-auto p-4">
                    <div > 
                        <Link href="/"> 
                            <Image alt="pdl institute" className="rounded-md" src="/images/pdlLogo.jpg" width={75} height={75}/> 
                        </Link> 
                    </div> 
                    <div className="flex gap-9"> 
                        <Link href="/" className="hover:text-orange-500 text-lg ">HOME</Link> 
                        <Link href="/contact" className="hover:text-orange-500  text-lg ">CONTACT</Link> 
                    </div> 
                    <LogMenu />
                </div>
                <div className="md:hidden relative">
                    {/* Toggle Button */}
                    <div className="flex justify-end p-4 bg-orange-700">
                        <button type="button" onClick={toggleMenu} className="text-white text-3xl">
                            {isOpen ? <HiOutlineX /> : <HiOutlineMenu />}
                        </button>
                    </div>

                    {/* Sliding Menu */}
                    <div
                        className={`fixed top-15 right-0 h-auto w-full  bg-orange-600 z-50 transform transition-transform duration-500 ${
                            isOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                    >
                        <div className="flex flex-col items-center justify-center text-center my-8 px-6">
                            {["/",  "/contact", "/login", "/register"].map((href, idx) => {
                                const labels = ["HOME", "CONTACT", "LOGIN", "REGISTER"];
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        className="text-white rounded-md hover:text-orange-500 hover:bg-white p-3 w-full font-bold transition-colors duration-200 text-lg"
                                        onClick={() => setIsOpen(false)} // Close menu on link click
                                    >
                                        {labels[idx]}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    ); 
} 
export default NavMenu;