"use client";
import Image from "next/image";
import NavMenu from "./navbar/navBar";
import Container from "./Container";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import Footer from "./footer/FooterPage";
import { BASE_API_URL } from "../utils/constant";
import { format } from "date-fns";

interface CourseItems {
  _id: string;
  coName: string;
  coSlug: string;
  coNick: string;
  coShort: string;
  prodType: string;
  coElgType: string;
  coCat: string;
  coElg: string;
  coImg: string;
  coType: string;
  coDesc: string;
  coDon: number;
  durDays: number;
  durHrs: number;
  eligibilityName?: string;
}

interface ICorParams {
  courseById: CourseItems;
}

interface BatchDetailsProps {
  bthName: string;
  bthShift: string;
  bthStart: string;
  bthEnd: string;
  bthLang: string;
  bthMode: string;
  bthLoc?: string;
  formattedStartDate?: string;
  formattedEndDate?: string;
}

interface courseCategoryProps {
  _id: string;
  catName: string;
}

const MarkettingCourseById: React.FC<ICorParams> = ({ courseById }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [courseCategory, setCourseCategory] = useState<courseCategoryProps>({
    _id: "",
    catName: "",
  });

  const [batchDetails, setBatchDetails] = useState<BatchDetailsProps[]>([]);

  useEffect(() => {
    const fetchBatchDetails = async () => {
      try {
        const response = await fetch(
          `${BASE_API_URL}/api/batch-by-marketting-course-id/${courseById._id}/upcoming-batches`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch batch details");
        }

        const data = await response.json();

        if (data.batchByCorId && Array.isArray(data.batchByCorId)) {
          const formattedBatches = data.batchByCorId.map((batch: any) => {
            const startDate = new Date(batch.bthStart);
            const endDate = new Date(batch.bthEnd);

            const formattedStartDate = format(startDate, "do MMM, yyyy");
            const formattedEndDate = format(endDate, "do MMM, yyyy");

            return {
              ...batch,
              formattedStartDate,
              formattedEndDate,
            };
          });

          setBatchDetails(formattedBatches);
        } else {
          setBatchDetails([]);
        }
      } catch (error) {
        console.error("Error fetching batch details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBatchDetails();
  }, []);

  useEffect(() => {
    const fetchCourseCategory = async () => {
      try {
        const response = await fetch(
          `${BASE_API_URL}/api/marketting-course-category/${courseById.coCat}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch course category");
        }
        const data = await response.json();
        setCourseCategory(data.mktCoCategory);
      } catch (error) {
        console.error("Error fetching course category:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourseCategory();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-800">
      <NavMenu />
      <Container>
        <div className="flex flex-col p-9 md:p-0">
          {/* Hero Section */}
          <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden rounded-xl mt-6 shadow-md mb-9">
            <Image
              src={`/api/image-upload?name=${courseById.coImg}`}
              alt="Course Banner"
              fill
              className="object-cover brightness-75 opacity-50"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
              <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg">
                {courseById.coName}
              </h1>
            </div>
          </div>

          {/* Course Details Section */}
          <h2 className="text-2xl font-bold text-orange-600 mb-3">
                Course Overview
          </h2>
          <div className="text-gray-700 text-justify w-full mx-auto mb-3">
            {courseById.coDesc}
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Left Content */}
            <div className="text-left">
              <div className="grid grid-cols-2 gap-4 text-sm md:text-base mt-4 justify-center">
                <div className="bg-orange-100 p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-orange-700">Duration</h3>
                  <p>
                    {courseById.durDays} Days / {courseById.durHrs} Hours
                  </p>
                </div>
                <div className="bg-orange-100 p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-orange-700">Donation</h3>
                  <p>₹{courseById.coDon}</p>
                </div>
                <div className="bg-orange-100 p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-orange-700">Category</h3>
                  <p>{courseCategory.catName}</p>
                </div>
                <div className="bg-orange-100 p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-orange-700">Type</h3>
                  <p>{courseById.coType}</p>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="mt-4">
              <div className="bg-orange-100 p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-orange-700">Elegibility</h3>
                  <p>
                    {courseById.eligibilityName || courseById.coElg} 
                  </p>
                </div>

              <div className="mt-10 text-center">
                <Link
                  href="/contact"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold transition duration-300"
                >
                  Enquire Now
                </Link>
              </div>
            </div>
          </div>

          {/* Upcoming Batches Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-orange-600 mb-6 text-center">
              <FaCalendarAlt className="inline mr-2 mb-1 text-xl" />
              Upcoming Batch Details
            </h2>
            {batchDetails?.length === 0 ? (
              <div className="text-center text-gray-500">
                No Upcoming Batches
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-1 justify-center w-auto">
                {batchDetails.map((batch, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-lg rounded-lg p-6 border border-orange-100 max-w-lg w-full"
                  >
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex flex-col gap-2 items-start">
                        <p>
                          <span className="font-semibold text-orange-600">
                            Batch Name:
                          </span>{" "}
                          {batch.bthName}
                        </p>
                        <p>
                          <span className="font-semibold text-orange-600">
                            Shift:
                          </span>{" "}
                          {batch.bthShift}
                        </p>
                        <p>
                          <span className="font-semibold text-orange-600">
                            Language:
                          </span>{" "}
                          {batch.bthLang}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <p>
                          <span className="font-semibold text-orange-600">
                            Start Date:
                          </span>{" "}
                          {batch.formattedStartDate}
                        </p>
                        <p>
                          <span className="font-semibold text-orange-600">
                            End Date:
                          </span>{" "}
                          {batch.formattedEndDate}
                        </p>
                        <p>
                          <span className="font-semibold text-orange-600">
                            Mode:
                          </span>{" "}
                          {batch.bthMode}
                        </p>
                        {batch.bthMode !== "Online" && batch.bthLoc && (
                          <p>
                            <span className="font-semibold text-orange-600">
                              Location:
                            </span>{" "}
                            {batch.bthLoc}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default MarkettingCourseById;
