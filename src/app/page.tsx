import Image from "next/image"
import NavMenu from "./components/navbar/navBar"
import migrateScreenshotData from "./data-migration/screenshotMigration" 
import MarkettingCourses from "./components/MarkettingCourses";
import Footer from "./components/footer/FooterPage";

export default async function Home() {    

  return (
    <div>
      <NavMenu/>
      <Image src="/images/cover image.jpg" alt="pdlInstitute" width={1560} height={600}/>
      <MarkettingCourses />
      <Footer />
    </div>
  )
}
