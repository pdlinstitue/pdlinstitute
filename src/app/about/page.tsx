import NavMenu from "../components/navbar/navBar";
import Image from 'next/image'

const AboutUs = () => {

    return (
        <div>
            <NavMenu/>
            <Image
                alt="pdlinstitute"
                src="/images/inr_bnr.png"
                width={1540}
                height={250}
            />
        </div>
    )
}
export default AboutUs;