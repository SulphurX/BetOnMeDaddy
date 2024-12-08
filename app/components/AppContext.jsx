"use client";
import React, { createContext, useState } from "react";
import { useContext } from "react";
import { OktoProvider, BuildType } from "okto-sdk-react";
import { useSession, signIn, signOut } from "next-auth/react";

// Create a context with a default value
export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [apiKey, setApiKey] = useState(process.env.NEXT_PUBLIC_OKTO_CLIENT_API || "");
  const [buildType, setBuildType] = useState(BuildType.SANDBOX);
  const { data: session } = useSession();

  async function handleGAuthCb() {
    if(session) {
      return session.id_token;
    }
    await signIn("google");
    return "";
  }

  return (
    <AppContext.Provider value={{ apiKey, setApiKey, buildType, setBuildType }}>
      <OktoProvider apiKey={apiKey} buildType={buildType} gAuthCb={handleGAuthCb}>
        {children}
      </OktoProvider>
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
