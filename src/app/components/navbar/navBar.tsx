import Link from "next/link"; 
import Image from "next/image"; 
import Container from "../Container";
import LogMenu from "../submenus/LogMenu";


const NavMenu : React.FC = () => 
    { 
        return ( 
        <div className='sticky top-0 w-full bg-white z-30 shadow-xl h-auto'>         
             <Container>
                <div className="flex justify-between items-center h-auto p-4">
                    <div> 
                        <Link href="/"> 
                            <Image alt="pdl institute" src="/images/pdlLogo.jpg" width={75} height={75}/> 
                        </Link> 
                    </div> 
                    <div className="flex gap-9"> 
                        <Link href="/" className="hover:text-orange-500 hover:font-bold ">HOME</Link> 
                        <Link href="/about" className="hover:text-orange-500 hover:font-bold ">ABOUT</Link> 
                        <Link href="/courses" className="hover:text-orange-500 hover:font-bold ">COURSES</Link> 
                        <Link href="/contact" className="hover:text-orange-500 hover:font-bold ">CONTACT</Link> 
                    </div> 
                    <LogMenu />
                </div>
             </Container>
        </div>
    ); 
} 
export default NavMenu;