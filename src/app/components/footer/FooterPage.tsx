"use client";
import { MdFacebook, MdOutlineMailOutline } from "react-icons/md";
import Container from "../Container";
import FooterList from "./FooterList";
import Image from "next/image";
import Link from "next/link";
import { AiFillInstagram, AiFillTwitterCircle, AiFillYoutube } from "react-icons/ai";
import { ImLocation2 } from "react-icons/im";

const Footer : React.FC = () => {

  return (
    <footer className="bg-orange-700 text-white mt-16 p-6 md:p-0">
        <Container>
            <div className="flex flex-col md:flex-row justify-between pt-16 pb-8">
                <FooterList>
                  <h3 className="uppercase text-xl font-bold">About us</h3>
                  <Link href="/">
                    <Image alt="pdlinstitute" className="shadow-xl" src="/images/pdlLogo.jpg" width={120} height={120}/>
                  </Link>
                </FooterList>
                <FooterList>
                  <h3 className="uppercase text-xl font-bold">QUICK LINKS</h3>
                  <Link href="/#" className="text-sm">Donate Us</Link>
                  <Link href="/#" className="text-sm">Refund Policy</Link>
                  <Link href="/#" className="text-sm">Privacy Policy</Link>
                  <Link href="/#" className="text-sm">FAQs</Link>
                </FooterList>
                <FooterList>
                  <h3 className="uppercase text-xl font-bold">CONTACT US</h3>
                  <div className="flex gap-2 items-center">
                      <MdOutlineMailOutline size={28} className="text-white"/>
                      <p>coachdeepak@gmail.com</p>
                  </div>
                  <div className="flex gap-2 items-center">
                      <ImLocation2 size={28} className="text-white"/>
                      <p>Noida Extension, Noida-201301.</p>
                  </div>
                </FooterList>
                <FooterList>
                  <h3 className="uppercase text-xl font-bold">Follow Us</h3>
                  <div className="flex gap-2">
                    <div className="relative w-[40px] h-[40px] p-4 shadow-lg rounded-sm border-[1px] border-white hover:bg-orange-500">
                      <Link href="/#" className="absolute top-2 right-2"><MdFacebook size={24}/></Link>
                    </div>
                    <div className="relative w-[40px] h-[40px] p-4 shadow-lg rounded-sm border-[1px] border-white hover:bg-orange-500">
                      <Link href="/#" className="absolute top-2 right-2"><AiFillTwitterCircle size={24}/></Link>
                    </div>
                    <div className="relative w-[40px] h-[40px] p-4 shadow-lg rounded-sm border-[1px] border-white hover:bg-orange-500">
                      <Link href="/#" className="absolute top-2 right-2"><AiFillInstagram size={24}/></Link>
                    </div>
                    <div className="relative w-[40px] h-[40px] p-4 shadow-lg rounded-sm border-[1px] border-white hover:bg-orange-500">
                      <Link href="/#" className="absolute top-2 right-2"><AiFillYoutube size={24}/></Link>
                    </div>
                  </div>
                </FooterList>
            </div>
        </Container>  
        <div className="h-[20] bg-white text-black p-2 text-center text-xs font-bold">
            <p>&copy; {new Date().getFullYear()} PDL Institute , All rights reserved.</p>
        </div>
    </footer>
  )
}
export default Footer;