"use client";
import { BASE_API_URL } from "@/app/utils/constant";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Loading from "../Loading";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

interface RoleListProps {
  _id: string;
  roleType: string;
}

interface ModuleListProps {
  _id: string;
  modName: string;
}

interface PermissionLabelProps {
  _id: string;
  name: string;
  label: string;
}

interface PermitAllowedProps {
  rolId: string;
  modId: string;
  modAtnIds: string[];
  createdBy: string;
  updatedBy: string;
}

const PermissionList: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [roleList, setRoleList] = useState<RoleListProps[]>([]);
  const [moduleList, setModuleList] = useState<ModuleListProps[]>([]);
  const [permissionLabels, setPermissionLabels] = useState<
    PermissionLabelProps[]
  >([]);
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [permitAllowed, setPermitAllowed] = useState<PermitAllowedProps>({
    rolId: "",
    modId: "",
    modAtnIds: [],
    createdBy: "",
    updatedBy: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activity, setActivity] = useState("-");
  const [loggedInUser, setLoggedInUser] = useState({
    result: {
      _id: "",
      usrName: "",
      usrRole: "",
    },
  });

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [roleRes, moduleRes] = await Promise.all([
          fetch(`${BASE_API_URL}/api/role-list`),
          fetch(`${BASE_API_URL}/api/modules`),
        ]);

        const roles = await roleRes.json();
        const modules = await moduleRes.json();

        setRoleList(roles?.rolList || []);
        setModuleList(modules?.modules || []);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setIsLoading(false);
      }

      const userId = Cookies.get("loggedInUserId") || "";
      const userName = Cookies.get("loggedInUserName") || "";
      const userRole = Cookies.get("loggedInUserRole") || "";
      setLoggedInUser({
        result: { _id: userId, usrName: userName, usrRole: userRole },
      });
    }

    fetchInitialData();
  }, []);

  useEffect(() => {
    async function fetchPermission() {
      if (!permitAllowed.rolId || !permitAllowed.modId) return;

      try {
        const response = await fetch(
          `${BASE_API_URL}/api/permissions?rolId=${permitAllowed.rolId}&modId=${permitAllowed.modId}`
        );
        const data = await response.json();
        const permission = data?.pmtList?.[0];

        if (permission) {
          setPermitAllowed((prev) => ({
            ...prev,
            modAtnIds: permission.modAtnIds || [],
            createdBy: permission.createdBy || "",
            updatedBy: permission.updatedBy || "",
          }));
        } else {
          setPermitAllowed((prev) => ({
            ...prev,
            modAtnIds: [],
            createdBy: "",
            updatedBy: "",
          }));
        }
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    }

    async function fetchPermissionLabels() {
      if (!permitAllowed.modId) return;
      try {
        const response = await fetch(
          `${BASE_API_URL}/api/modules/${permitAllowed.modId}/view-module`
        );
        const data = await response.json();
        setPermissionLabels(data.modById?.modActions || []);
      } catch (error) {
        console.error("Error fetching action labels:", error);
      }
    }

    fetchPermission();
    fetchPermissionLabels();
  }, [permitAllowed.rolId, permitAllowed.modId]);

  useEffect(() => {
    if (permissionLabels.length > 0 && permitAllowed.modId) {
      const allSelected =
        permitAllowed.modAtnIds?.length === permissionLabels.length;
      setIsCheckedAll(allSelected);
    }
  }, [permissionLabels, permitAllowed]);

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setPermitAllowed((prev) => ({
      ...prev,
      [name]: value,
      modAtnIds: [],
    }));

    setIsCheckedAll(false);

    if (name === "modId") {
      const selected = moduleList.find((mod) => mod._id === value);
      setActivity(selected?.modName || "-");
    }
  };

  const handleCheckAll = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsCheckedAll(checked);

    if (checked) {
      setPermitAllowed((prev) => ({
        ...prev,
        modAtnIds: permissionLabels.map((perm) => perm._id),
      }));
    } else {
      setPermitAllowed((prev) => ({
        ...prev,
        modAtnIds: [],
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage("");

    try {
      if (!permitAllowed.rolId) return setErrorMessage("Role is required.");
      if (!permitAllowed.modId) return setErrorMessage("Module is required.");

      const response = await fetch(`${BASE_API_URL}/api/permissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...permitAllowed,
          createdBy: loggedInUser.result._id,
          updatedBy: loggedInUser.result._id,
        }),
      });

      const result = await response.json();
      toast[result.success ? "success" : "error"](result.msg);
    } catch {
      toast.error("Failed to save permission.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <form onSubmit={handleSubmit} className="formStyle w-full">
      <div className="grid grid-cols-2 gap-1">
        <div className="flex flex-col gap-2">
          <label className="font-semibold uppercase">Roles:</label>
          <select
            name="rolId"
            className="inputBox text-center"
            value={permitAllowed.rolId}
            onChange={handleSelectChange}
          >
            <option value="">--- Select Role ---</option>
            {roleList.map((role) => (
              <option key={role._id} value={role._id}>
                {role.roleType}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold uppercase">Modules:</label>
          <select
            name="modId"
            className="inputBox text-center"
            value={permitAllowed.modId}
            onChange={handleSelectChange}
          >
            <option value="">--- Select Module ---</option>
            {moduleList.map((mod) => (
              <option key={mod._id} value={mod._id}>
                {mod.modName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <h1 className="text-center text-xl p-3 bg-gray-200 font-semibold uppercase">
        Module - {activity}
      </h1>

      <div className="flex flex-col gap-3 mt-6">
        <div className="grid grid-cols-2 gap-4">
          {permissionLabels?.map((item: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="checkbox"
                name={item.name}
                className="w-5 h-5"
                checked={permitAllowed.modAtnIds.includes(item._id)}
                onChange={(e) => {
                  const { checked } = e.target;
                  setPermitAllowed((prev) => {
                    const newIds = checked
                      ? [...prev.modAtnIds, item._id]
                      : prev.modAtnIds.filter((id) => id !== item._id);
                    return { ...prev, modAtnIds: newIds };
                  });
                }}
              />
              <label>{item.label || item.name}</label>
            </div>
          ))}
          {permissionLabels?.length > 0 && (
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                className="w-5 h-5"
                onChange={handleCheckAll}
                checked={isCheckedAll}
              />
              <label>Check All</label>
            </div>
          )}
        </div>
      </div>

      {errorMessage && <p className="text-red-600 italic">{errorMessage}</p>}

      {permissionLabels?.length > 0 && (
        <button type="submit" className="btnLeft" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </button>
      )}
    </form>
  );
};

export default PermissionList;