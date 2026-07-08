import React from "react";
import { AppContext, useAppController } from "./useAppController";

import { CustomAlertModal } from "../components/ui/CustomAlertModal";

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const appState = useAppController();
  return (
    <AppContext.Provider value={appState}>
      {children}
      <CustomAlertModal
        visible={appState.alertVisible}
        title={appState.alertConfig.title}
        message={appState.alertConfig.message}
        buttons={appState.alertConfig.buttons}
        type={appState.alertConfig.type}
        onClose={appState.hideAlert}
      />
    </AppContext.Provider>
  );
};
