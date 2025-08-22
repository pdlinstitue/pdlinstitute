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
import { ChangeEvent, FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { BASE_API_URL } from "../utils/constant";
import { useRouter } from "next/navigation";

interface EnquiryProps {
  eqrName: string;
  eqrEmail: string;
  eqrPhone: string;
  eqrMessage: string;
  eqrSub: string;
}

const ContactUs = () => {
  const router = useRouter();
  const [eqrData, setEqrData] = useState<EnquiryProps>({
    eqrName: "",
    eqrEmail: "",
    eqrPhone: "",
    eqrMessage: "",
    eqrSub: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setEqrData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_API_URL}/api/enquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eqrName: eqrData.eqrName,
          eqrEmail: eqrData.eqrEmail,
          eqrPhone: eqrData.eqrPhone,
          eqrSub: eqrData.eqrSub,
          eqrMessage: eqrData.eqrMessage,
        }),
      });

      const post = await response.json();
      console.log(post);
      if (post.success === false) {
        toast.error(post.msg);
      } else {
        toast.success(post.msg);
        router.push("/contact");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="py-20">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 w-full p-9">
        <div className="flex flex-col">
          <div className="flex flex-col gap-3 mb-6">
            <h1 className="font-bold text-4xl">Let's Talk...</h1>
            <p>
              Discover your inner light. Connect with us to begin your journey
              toward mindful living and holistic transformation.
            </p>
            <p>
              Awaken your consciousness. Tap into emotional clarity and
              spiritual depth—let’s start your journey together.
            </p>
            <p>
              Seeking inner peace and balance? Reach out today and take the
              first step toward conscious emotional and spiritual evolution.
            </p>
            <p>
              Ready to realign your mind, heart, and soul? Say hello—we’re here
              to guide your transformation with purpose.
            </p>
            <p>
              Begin your path to mindful mastery. Message us to unlock spiritual
              insights and emotional harmony.
            </p>
          </div>
          <div className="flex flex-col gap-3 mb-6">
            <h1 className="font-bold text-lg">Call Us:</h1>
            <div className="flex gap-2 items-center px-3">
              <FaPhoneVolume size={20} className="text-orange-500" />
              <p>+91-6399571515 / 9371536936</p>
            </div>
            <div className="flex gap-2 items-center px-3">
              <MdOutlineMailOutline size={24} className="text-orange-500" />
              <p>contact2pdl@gmail.com</p>
            </div>
            <div className="flex gap-2 items-center px-3">
              <div className="flex flex-col">
                <p className="flex items-center">
                  <ImLocation2 size={24} className="text-orange-500" />
                  <strong>Maharshi Arvind Foundation, </strong>
                </p>
                <p className="px-6">Post:Haturna, Tq: Warud, Dist: Amravati,</p>
                <p className="px-6">Maharashtra - 444906 India.</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="font-bold text-lg">Socials:</h1>
            </div>
            <div className="flex gap-3">
              <Link
                href="/"
                className="flex border-[1.5px] border-orange-500 items-center bg-white justify-center w-10 h-10 rounded-sm shadow-lg hover:bg-gray-100"
              >
                <BiLogoFacebookCircle size={30} className="text-orange-500" />
              </Link>
              <Link
                href="/"
                className="flex border-[1.5px] border-orange-500 items-center bg-white justify-center w-10 h-10 rounded-sm shadow-lg hover:bg-gray-100"
              >
                <AiFillTwitterCircle size={30} className="text-orange-500" />
              </Link>
              <Link
                href="/"
                className="flex border-[1.5px] border-orange-500 items-center bg-white justify-center w-10 h-10 rounded-sm shadow-lg hover:bg-gray-100"
              >
                <FaInstagram size={30} className="text-orange-500" />
              </Link>
              <Link
                href="/"
                className="flex border-[1.5px] border-orange-500 items-center bg-white justify-center w-10 h-10 rounded-sm shadow-lg hover:bg-gray-100"
              >
                <TbBrandYoutube size={30} className="text-orange-500" />
              </Link>
            </div>
          </div>
        </div>
        <div>
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                name="eqrName"
                value={eqrData.eqrName}
                onChange={handleChange}
                className="inputBox"
                placeholder="Full Name"
                required
              ></input>
              <input
                type="email"
                name="eqrEmail"
                value={eqrData.eqrEmail}
                onChange={handleChange}
                className="inputBox"
                placeholder="Email"
                required
              ></input>
              <input
                type="tel"
                name="eqrPhone"
                value={eqrData.eqrPhone}
                onChange={handleChange}
                className="inputBox"
                placeholder="Phone with country code e.g +91"
                required
              ></input>
              <input
                type="text"
                name="eqrSub"
                value={eqrData.eqrSub}
                onChange={handleChange}
                className="inputBox"
                placeholder="Subject"
                required
              ></input>
              <textarea
                rows={6}
                name="eqrMessage"
                value={eqrData.eqrMessage}
                onChange={handleChange}
                className="inputBox"
                placeholder="Message"
                required
              ></textarea>
            </div>
            <button type="submit" className="btnLeft">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
