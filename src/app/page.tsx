import Image from "next/image"
import NavMenu from "./components/navbar/navBar"
import migrateScreenshotData from "./data-migration/screenshotMigration" 

export default function Home() {    
  
  return (
    <div>
      <NavMenu/>
      <Image src="/images/cover image.jpg" alt="pdlInstitute" width={1560} height={600}/>
      <h1 className="text-3xl font-bold  uppercase text-center mt-10 text-orange-800">
        Courses
      </h1>

    </div>
  )
}
