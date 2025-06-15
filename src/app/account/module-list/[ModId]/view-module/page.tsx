"use client";
import React, { useEffect, useState, use } from "react";
import { BASE_API_URL } from "@/app/utils/constant";
import Loading from "@/app/account/Loading";
import { useRouter } from "next/navigation";

interface ViewModuleProps {
  modName: string;
  modActions: { name: string; url: string }[];
  updatedBy: string;
}

interface IModuleParams {
  params: Promise<{
    ModId: string;
  }>;
}

const ViewModule: React.FC<IModuleParams> = ({ params }) => { 
  
  const router = useRouter(); 
  const { ModId } = use(params);
  const [isLoading, setIsLoading] = useState(true);    

  const [data, setData] = useState<ViewModuleProps>({
    modName: "",
    modActions: [],
    updatedBy: "",
  });

  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        const res = await fetch(
          `${BASE_API_URL}/api/modules/${ModId}/view-module`,
          { cache: "no-store" }
        );
        const moduleData = await res.json();
        setData(moduleData?.modById);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchModuleData();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex justify-center items-center">
      <form className="formStyle w-[800px]">
        <div className="flex flex-col gap-2">
          <label className="font-bold text-lg">Module Name:</label>
          <input
            type="text"
            className="inputBox"
            name="modName"
            value={data.modName}
            readOnly={true}
          />
        </div>

        {data.modActions.length > 0 && (
          <div className="mt-4">
            <h3 className="font-bold mb-2">Module Actions:</h3>
            <table className="w-full border border-gray-300 text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border-b">Action Name</th>
                  <th className="p-2 border-b">Action URL</th>
                </tr>
              </thead>
              <tbody>
                {data.modActions.map((action, index) => (
                  <tr key={index}>
                    <td className="p-2 border-b">{action.name}</td>
                    <td className="p-2 border-b">{action.url}</td>                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex gap-1 w-full mt-4">          
          <button
            type="button"
            className="btnRight w-full"
            onClick={() => router.push("/account/module-list")}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default ViewModule;