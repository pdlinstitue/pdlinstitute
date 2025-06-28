import Image from "next/image";
import Container from "../components/Container";
import NavMenu from "../components/navbar/navBar";
import ContactUs from "./ContactForm";
import Footer from "../components/footer/FooterPage";


const MainContactPage = () => {

    return ( 
        <div>
            <NavMenu/>              
            <Image
                alt="pdlinstitute"
                src="/images/inr_bnr.png"
                width={1540}
                height={250}
            />    
            <Container>
                <ContactUs/>
            </Container>
            <Footer />
        </div>
    );
}
 
export default MainContactPage;