"use client";
import { FaPhoneVolume } from "react-icons/fa6";
import { MdOutlineMailOutline } from "react-icons/md";
import { ImLocation2 } from "react-icons/im";
import { BiLogoFacebookCircle } from "react-icons/bi";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { TbBrandYoutube } from "react-icons/tb";
import Link from "next/link";
import { AiFillTwitterCircle } from "react-icons/ai";



const ContactUs = () => {

    return ( 
        <div className="py-20">
           <div className="grid grid-cols-1 gap-6 md:grid-cols-2 w-full p-9">
                <div className="flex flex-col">
                    <div className="flex flex-col gap-3 mb-6">
                        <h1 className="font-bold text-4xl">Let's Talk...</h1>
                        <p className="">
                            Have some big idea or brand to develop and need help? Then reach out   to us, we'd love to hear about your project and provide help.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 mb-6">
                        <h1 className="font-bold text-lg">Call Us:</h1>
                        <div className="flex gap-2 items-center px-3">
                            <FaPhoneVolume size={20} className="text-orange-500"/>
                            <p>+91-7608795412</p>
                        </div>
                        <div className="flex gap-2 items-center px-3">
                            <MdOutlineMailOutline size={24} className="text-orange-500"/>
                            <p>coachdeepak@gmail.com</p>
                        </div>
                        <div className="flex gap-2 items-center px-3">
                            <ImLocation2 size={24} className="text-orange-500"/>
                            <p>Noida Extension, Noida-201301.</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div>
                            <h1 className="font-bold text-lg">Socials:</h1>
                        </div>
                        <div className="flex gap-3">
                            <Link href="/" className="flex border-[1.5px] border-orange-500 items-center bg-white justify-center w-10 h-10 rounded-sm shadow-lg hover:bg-gray-100">
                                <BiLogoFacebookCircle size={30} className="text-orange-500"/>
                            </Link>
                            <Link href="/" className="flex border-[1.5px] border-orange-500 items-center bg-white justify-center w-10 h-10 rounded-sm shadow-lg hover:bg-gray-100">
                                <AiFillTwitterCircle size={30} className="text-orange-500"/>
                            </Link>
                            <Link href="/" className="flex border-[1.5px] border-orange-500 items-center bg-white justify-center w-10 h-10 rounded-sm shadow-lg hover:bg-gray-100">
                                <FaInstagram size={30} className="text-orange-500"/>
                            </Link>
                            <Link href="/" className="flex border-[1.5px] border-orange-500 items-center bg-white justify-center w-10 h-10 rounded-sm shadow-lg hover:bg-gray-100">
                                <TbBrandYoutube size={30} className="text-orange-500"/>
                            </Link>                           
                        </div>
                    </div>
                </div>
                <div>
                    <form className="flex flex-col gap-3">
                        <div className="flex flex-col gap-3">
                            <input type="text" className="inputBox" placeholder="Name"></input>
                            <input type="text" className="inputBox" placeholder="Email"></input>
                            <input type="text" className="inputBox" placeholder="Subject"></input>
                            <textarea rows={6} className="inputBox" placeholder="Message"></textarea>
                        </div>
                        <button type="submit" className="btnLeft">Submit</button>
                    </form>
                </div>
           </div>
        </div>
     );
}
 
export default ContactUs;