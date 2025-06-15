"use client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { BASE_API_URL } from "@/app/utils/constant";
import Loading from "../Loading";

interface NewModuleProps {
  modName: string;
  modActions: { name: string; url: string }[];
  createdBy: string;
}

const AddNewModule: React.FC = () => {

  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [currentAction, setCurrentAction] = useState({ name: "", url: "" });
  const [data, setData] = useState<NewModuleProps>({
    modName: "",
    modActions: [],
    createdBy: "",
  });

  const [loggedInUser, setLoggedInUser] = useState({
    id: "",
    usrName: "",
    usrRole: "",
    isAdmin: "",
  });

  useEffect(() => {
  try {
    const cookie = Cookies.get("loggedInUser");
    if (cookie) {
        const parsed = JSON.parse(cookie);
        setLoggedInUser({
        id: parsed.id || "",
        usrName: parsed.usrName || "",
        usrRole: parsed.usrRole || "",
        isAdmin: parsed.isAdmin || "", 
      });
    }
    } catch (error) {
      console.error("Error parsing loggedInUser cookie:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    if (name === "modName") {
      setData((prev) => ({ ...prev, modName: value }));
    } else {
      setCurrentAction((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddAction = () => {
    if (!currentAction.name.trim() || !currentAction.url.trim()) {
      setErrorMessage("Action name and URL are required.");
      return;
    }

    setData((prev) => ({
      ...prev,
      modActions: [...prev.modActions, currentAction],
    }));

    setCurrentAction({ name: "", url: "" });
  };

  const handleDelete = (index: number) => {
    const updatedActions = data.modActions.filter((_, i) => i !== index);
    setData((prev) => ({ ...prev, modActions: updatedActions }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage("");

    if (!data.modName.trim()) {
      setErrorMessage("Module name is required.");
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_API_URL}/api/modules`, {
        method: "POST",
        body: JSON.stringify({
          ...data,
          createdBy: loggedInUser.id,
        }),
      });

      const post = await response.json();
      if (!post.success) {
        toast.error(post.msg);
      } else {
        toast.success(post.msg);
        router.push("/account/module-list");
      }
    } catch (error) {
      toast.error("Error creating module.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex justify-center items-center w-auto">
      <form onSubmit={handleSubmit} className="formStyle w-[800px]">
        <div className="flex flex-col gap-2">
          <label className="font-bold text-lg">Module Name:</label>
          <input
            type="text"
            className="inputBox"
            name="modName"
            value={data.modName}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center gap-1">
          <div className="flex flex-col gap-2 w-full">
            <label className="font-bold">Action Name:</label>
            <input
              type="text"
              name="name"
              className="inputBox"
              value={currentAction.name}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-1 w-full items-end">
            <div className="flex flex-col gap-2 w-full">
              <label className="font-bold">Action URL:</label>
              <input
                type="text"
                name="url"
                className="inputBox"
                value={currentAction.url}
                onChange={handleChange}
              />
            </div>
            <div>
              <button
                type="button"
                className="btnLeft h-11"
                onClick={handleAddAction}
              >
                +
              </button>
            </div>
          </div>
        </div>
        {data.modActions.length > 0 && (
          <div className="mt-4">
            <h3 className="font-bold mb-2">Module Actions:</h3>
            <table className="w-full border border-gray-300 text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border-b">Action Name</th>
                  <th className="p-2 border-b">Action URL</th>
                  <th className="p-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.modActions.map((action, index) => (
                  <tr key={index}>
                    <td className="p-2 border-b">{action.name}</td>
                    <td className="p-2 border-b">{action.url}</td>
                    <td className="p-2 border-b">
                      <button
                        type="button"
                        className="text-red-600"
                        onClick={() => handleDelete(index)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {errorMessage && (
          <p className="text-red-600 italic text-sm mt-2">{errorMessage}</p>
        )}

        <div className="flex gap-1 w-full mt-4">
          <button type="submit" disabled={isSaving} className="btnLeft w-full">
            {isSaving ? "Saving..." : "Save"}
          </button>
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

export default AddNewModule;
