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

interface ActionListProps {
  _id: string;
  atnName: string;
}

interface PermitAllowedProps {
  atnId: string;
  rolId: string;
  isListEnabled: boolean;
  isViewEnabled: boolean;
  isAddEnabled: boolean;
  isEditEnabled: boolean;
  isRegPwdEnabled: boolean;
  isEnbEnabled: boolean;
  isDisEnabled: boolean;
  isDelEnabled: boolean;
  isMarkEnabled: boolean;
  isAttdeesEnabled: boolean;
  isAttdImgEnabled: boolean;
  isAmendEnabled: boolean;
  isCompEnabeled: boolean;
  isApvEnrEnabled: boolean;
  isMnlEnrEnabled: boolean;
  isAvpDocEnabled: boolean;
  updatedBy: string;
}

const PermissionList: React.FC = () => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [actionList, setActionList] = useState<ActionListProps[] | null>([]);
  const [permitAllowed, setPermitAllowed] = useState<PermitAllowedProps>({
    atnId: "",
    rolId: "",
    isListEnabled: false,
    isViewEnabled: false,
    isAddEnabled: false,
    isEditEnabled: false,
    isRegPwdEnabled: false,
    isDelEnabled: false,
    isEnbEnabled: false,
    isDisEnabled: false,
    isAttdeesEnabled: false,
    isAttdImgEnabled: false,
    isAmendEnabled: false,
    isMarkEnabled: false,
    isCompEnabeled: false,
    isApvEnrEnabled: false,
    isMnlEnrEnabled: false,
    isAvpDocEnabled: false,
    updatedBy: "",
  });
  const [roleList, setRoleList] = useState<RoleListProps[] | null>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activity, setActivity] = useState("Module");

  const [loggedInUser, setLoggedInUser] = useState({
    result: {
      _id: "",
      usrName: "",
      usrRole: "",
    },
  });

  useEffect(() => {
    async function fetchRolesData() {
      try {
        const response = await fetch(`${BASE_API_URL}/api/role-list`);
        const data = await response.json();
        setRoleList(data?.rolList || []);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    }

    async function fetchActionListData() {
      try {
        const response = await fetch(`${BASE_API_URL}/api/actions`);
        const data = await response.json();
        setActionList(data?.atnList || []);
      } catch (error) {
        console.error("Error fetching actions:", error);
      }
    }

    const userId = Cookies.get("loggedInUserId") || "";
    const userName = Cookies.get("loggedInUserName") || "";
    const userRole = Cookies.get("loggedInUserRole") || "";
    setLoggedInUser({
      result: {
        _id: userId,
        usrName: userName,
        usrRole: userRole,
      },
    });

    Promise.all([fetchRolesData(), fetchActionListData()]).finally(() =>
      setIsLoading(false)
    );
  }, []);

  useEffect(() => {
    async function getPermissionData() {
      if (!permitAllowed.atnId || !permitAllowed.rolId) return;

      try {
        const response = await fetch(
          `${BASE_API_URL}/api/permissions?atnId=${permitAllowed.atnId}&rolId=${permitAllowed.rolId}`
        );
        const data = await response.json();

        const permission = data?.pmtList?.[0];

        if (permission) {
          setPermitAllowed((prev) => ({
            ...prev,
            isListEnabled: permission.isListEnabled,
            isViewEnabled: permission.isViewEnabled,
            isAddEnabled: permission.isAddEnabled,
            isEditEnabled: permission.isEditEnabled,
            isRegPwdEnabled: permission.isRegPwdEnabled,
            isEnbEnabled: permission.isEnbEnabled,
            isDisEnabled: permission.isDisEnabled,
            isDelEnabled: permission.isDelEnabled,
            isMarkEnabled: permission.isMarkEnabled,
            isAttdeesEnabled: permission.isAttdeesEnabled,
            isAttdImgEnabled: permission.isAttdImgEnabled,
            isAmendEnabled: permission.isAmendEnabled,
            isCompEnabled: permission.isCompEnabled,
            isApvEnrEnabled: permission.isApvEnrEnabled,
            isMnlEnrEnabled: permission.isMnlEnrEnabled,
            isAvpDocEnabled: permission.isAvpDocEnabled,
            updatedBy: prev.updatedBy || permission.updatedBy || "",
          }));
        } else {
          // If no permission found, reset toggles but keep atnId and rolId
          setPermitAllowed((prev) => ({
            ...prev,
            isListEnabled: false,
            isViewEnabled: false,
            isAddEnabled: false,
            isEditEnabled: false,
            isRegPwdEnabled: false,
            isEnbEnabled: false,
            isDisEnabled: false,
            isDelEnabled: false,
            isAttdeesEnabled: false,
            isAttdImgEnabled: false,
            isAmendEnabled: false,
            isMarkEnabled: false,
            isCompEnabled: false,
            isApvEnrEnabled: false,
            isMnlEnrEnabled: false,
            isAvpDocEnabled: false,
          }));
        }
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    }

    getPermissionData();
  }, [permitAllowed.atnId, permitAllowed.rolId]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPermitAllowed((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const checkAll = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setPermitAllowed((prev) => ({
      ...prev,
      isListEnabled: checked,
      isViewEnabled: checked,
      isAddEnabled: checked,
      isEditEnabled: checked,
      isRegPwdEnabled: checked,
      isEnbEnabled: checked,
      isDisEnabled: checked,
      isDelEnabled: checked,
      isMarkEnabled: checked,
      isAttdeesEnabled: checked,
      isAttdImgEnabled: checked,
      isAmendEnabled: checked,
      isCompEnabled: checked,
      isApvEnrEnabled: checked,
      isMnlEnrEnabled: checked,
      isAvpDocEnabled: checked,
    }));
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setPermitAllowed((prev) => ({
      ...prev,
      [name]: value,
    }));

    // If module (atnId) is changed, set activity name
    if (name === "atnId") {
      const selectedAction = actionList?.find((action) => action._id === value);
      setActivity(selectedAction?.atnName || "Activity");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage("");

    try {
      if (!permitAllowed.rolId.trim()) {
        return setErrorMessage("Role is required.");
      } else if (!permitAllowed.atnId.trim()) {
        return setErrorMessage("Module is required.");
      } else {
        const response = await fetch(`${BASE_API_URL}/api/permissions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...permitAllowed,
            updatedBy: loggedInUser.result._id,
          }),
        });

        const post = await response.json();

        if (post.success === false) {
          toast.error(post.msg);
        } else {
          toast.success(post.msg);
        }
      }
    } catch (error) {
      toast.error("Error saving permissions.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  const permissionLabels: Record<string, string> = {
    isListEnabled: "List",
    isViewEnabled: "View",
    isAddEnabled: "Add",
    isEditEnabled: "Edit",
    isRegPwdEnabled: "Reset Password",
    isEnbEnabled: "Enable",
    isDisEnabled: "Disable",
    isDelEnabled: "Delete"
  };

  const permissionLabels2: Record<string, string> = {
    isAttdeesEnabled: "Attendees",
    isAttdImgEnabled: "Attendance Image",
    isAmendEnabled: "Amend",
    isMarkEnabled: "Mark",
    isCompEnabled: "Complete",
    isApvEnrEnabled: "Approve Enrollment",
    isMnlEnrEnabled: "Manual Enrollment",
    isAvpDocEnabled: "Approve Document"
  };  
  
  return (
    <form onSubmit={handleSubmit} className="formStyle w-full">
      <div className="grid grid-cols-2 gap-1">
        <div className="flex flex-col gap-2">
          <label className="font-semibold uppercase">Roles:</label>
          <select
            className="inputBox text-center"
            name="rolId"
            value={permitAllowed.rolId}
            onChange={handleSelectChange}
          >
            <option value=""> --- Select Roles --- </option>
            {roleList?.map((role) => (
              <option key={role._id} value={role._id}>
                {role.roleType}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold uppercase">Modules:</label>
          <select
            className="inputBox text-center"
            name="atnId"
            value={permitAllowed.atnId}
            onChange={handleSelectChange}
          >
            <option value=""> --- Select Module --- </option>
            {actionList?.map((atn) => (
              <option key={atn._id} value={atn._id}>
                {atn.atnName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <h1 className="text-center text-xl p-3 bg-gray-200 font-semibold uppercase">
        Module:{activity}
      </h1>

      <div className="grid grid-cols-2 gap-1">
      <div className="flex flex-col gap-1 mt-6">
  {Object.keys(permissionLabels).map((field) => (
    <div key={field} className="flex gap-4 items-center">
      <input
        type="checkbox"
        name={field}
        className="w-5 h-5"
        checked={
          permitAllowed[field as keyof typeof permitAllowed] as boolean
        }
        onChange={handleChange}
      />
      <label>{permissionLabels[field]}</label>
    </div>
  ))}
</div>
        <div className="flex flex-col gap-1 mt-6">
        {Object.keys(permissionLabels2).map((field) => (
  <div key={field} className="flex gap-4 items-center">
    <input
      type="checkbox"
      name={field}
      className="w-5 h-5"
      checked={
        permitAllowed[field as keyof typeof permitAllowed] as boolean
      }
      onChange={handleChange}
    />
    <label>{permissionLabels2[field]}</label>
  </div>
))}
          <div className="flex gap-4 items-center">
            <input type="checkbox" className="w-5 h-5" onChange={checkAll} />
            <label>Check All</label>
          </div>
        </div>
      </div>

      {errorMessage && (
        <p className="text-sm italic text-red-600">{errorMessage}</p>
      )}

      <button type="submit" className="btnLeft" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save"}
      </button>
    </form>
  );
};

export default PermissionList;