"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Container from './Container';
import { BASE_API_URL } from '../utils/constant';
import { useRouter } from 'next/navigation';

interface CourseItems {
  _id?: string;
  coName: string;
  coNick: string;
  coSlug: string;
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

interface CategoryItem {
  _id: string;
  catName: string;
}

const MarkettingCourses: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [category, setCategory] = useState<string>("Basic Education-1");
  const [categoryList, setCategoryList] = useState<CategoryItem[] | null>([]);
  const [activeCourses, setActiveCourses] = useState<CourseItems[] | null>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();

  const handleViewDetails = (courseSlug: string) => {
    router.push(`/course-page/${courseSlug}`);
  };

  const handleSelectCategory = (catItem: string) => {
    setCategory(catItem);
    setIsOpen(false);
  };

  useEffect(() => {
    async function fetchCourseData() {
      try {
        const res = await fetch(`${BASE_API_URL}/api/marketting-courses`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch course data");

        const coData = await res.json();
        const updatedCoList = coData?.coList.map((item: any) => ({
          ...item,
          coCat: item.coCat.catName,
        }));

        if (category !== "All Courses") {
          const filtered = updatedCoList.filter((course: any) => course.coCat === category);
          setActiveCourses(filtered.length > 0 ? filtered : []);
        } else {
          setActiveCourses(updatedCoList);
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCourseData();
  }, [category]);

  useEffect(() => {
    async function fetchCategoryData() {
      try {
        const res = await fetch(`${BASE_API_URL}/api/categories`, {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch category data");

        const data = await res.json();
        setCategoryList(data.catList);
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    }

    fetchCategoryData();
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
    <div>
      <Container>
        <h1 className="text-3xl font-bold text-orange-600 my-6 text-center">
          Mind Development Training
        </h1>

        {/* Custom Dropdown with Arrow + Hover + Animation */}
        <div className="relative inline-block mb-6 w-60">
          <div
            className="border border-gray-300 rounded-md p-3 bg-white text-gray-700 shadow-lg w-full cursor-pointer flex justify-between items-center transition duration-200"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>{category || "--- Select Category ---"}</span>
            <svg
              className={`w-4 h-4 transform transition-transform duration-300 ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {isOpen && (
            <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto transition duration-300">
              <li
                className="px-4 py-2 cursor-pointer hover:bg-orange-500 hover:text-white transition duration-200"
                onClick={() => handleSelectCategory("All Courses")}
              >
                All Courses
              </li>
              {categoryList?.map((cat) => (
                <li
                  key={cat._id}
                  className="px-4 py-2 cursor-pointer hover:bg-orange-500 hover:text-white transition duration-200"
                  onClick={() => handleSelectCategory(cat.catName)}
                >
                  {cat.catName}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9">
          {activeCourses && activeCourses.length > 0 ? (
            activeCourses.map((course: any) => (
              <div
                key={course._id}
                className="flex flex-col border p-9 rounded-lg shadow-lg transition-all duration-500 ease-in-out hover:shadow-2xl hover:scale-105 cursor-pointer"
              >
                <Image
                  src={course.coImg}
                  alt={course.coName}
                  width={300}
                  height={160}
                  className="w-full object-cover bg-gray-200 rounded-md"
                />
                <h2 className="text-xl font-semibold text-center bg-gray-200 p-2">{course.coName}</h2>
                <p className="text-gray-700 text-sm my-2">{course.coShort}</p>
                <div className="flex text-sm items-center justify-between">
                  <p className="text-gray-600">
                    <span className="font-semibold">Category:</span> {course.coCat}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Type:</span> {course.coType}
                  </p>
                </div>
                <div className="flex text-sm items-center justify-between">
                  <p className="text-gray-600">
                    <span className="font-semibold">Duration:</span> {course.durDays} days
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Minutes:</span> {course.durHrs} minutes/day
                  </p>
                </div>
                <div className="flex text-sm items-center justify-between">
                  <p className="text-gray-600">
                    <span className="font-semibold">Eligibility:</span> {course.eligibilityName}
                  </p>
                  <p className="text-orange-500 font-bold">
                    <span className="font-semibold">Price: ₹</span> {course.coDon}
                  </p>
                </div>
                <button
                  type="button"
                  className="btnLeft w-full mt-1"
                  onClick={() => handleViewDetails(course.coSlug)}
                >
                  View Details
                </button>
              </div>
            ))
          ) : (
            <div className="flex text-gray-500 text-xl py-6 italic">
              Oops! No courses in this category.
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default MarkettingCourses;
