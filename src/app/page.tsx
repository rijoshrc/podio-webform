"use client";

import { useState } from "react";
import PodioConfigForm from "@/components/PodioConfigForm";
import FormGenerator from "@/components/FormGenerator";

export default function Home() {
  const [appData, setAppData] = useState(null);

  return (
    <main className="p-8 space-y-6">
      <PodioConfigForm onAppDataFetched={setAppData} />

      {appData && <FormGenerator appData={appData} />}
    </main>
  );
}
