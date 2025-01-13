
import Container from "../components/Container";
import Footer from "../components/footer/FooterPage";
import InnerBanner from "../components/InnerBanner";
import NavMenu from "../components/navbar/navBar";
import ContactUs from "./ContactForm";


const MainContactPage = () => {

    return ( 
        <div>
            <NavMenu/>
            <InnerBanner/>
            <Container>
                <ContactUs/>
            </Container>
            <Footer/>
        </div>
     );
}
 
export default MainContactPage;