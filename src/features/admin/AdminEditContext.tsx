"use client";

import { createContext, useContext, useState } from "react";

interface AdminEditContextType {
  isEditMode: boolean;
  toggleEditMode: () => void;
  setEditMode: (val: boolean) => void;
}

const AdminEditContext = createContext<AdminEditContextType>({
  isEditMode: false,
  toggleEditMode: () => {},
  setEditMode: () => {},
});

export function AdminEditProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <AdminEditContext.Provider
      value={{
        isEditMode,
        toggleEditMode: () => setIsEditMode((prev) => !prev),
        setEditMode: setIsEditMode,
      }}
    >
      {children}
    </AdminEditContext.Provider>
  );
}

export function useAdminEdit() {
  return useContext(AdminEditContext);
}
