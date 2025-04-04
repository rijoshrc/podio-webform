"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface PodioConfigFormProps {
  onAppDataFetched: (data: any) => void;
}

export default function PodioConfigForm({
  onAppDataFetched,
}: PodioConfigFormProps) {
  const [appId, setAppId] = useState("");
  const [appToken, setAppToken] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAppDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/podio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appId, appToken }),
      });

      const data = await res.json();
      onAppDataFetched(data.data);
    } catch (error) {
      console.error("Error fetching Podio data:", error);
      alert("Failed to fetch app details.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl p-4 space-y-4 border rounded-lg">
      <Input
        placeholder="Podio App ID"
        value={appId}
        onChange={(e) => setAppId(e.target.value)}
      />
      <Input
        placeholder="Podio App Token"
        value={appToken}
        onChange={(e) => setAppToken(e.target.value)}
      />
      <Button onClick={fetchAppDetails} disabled={loading}>
        {loading ? "Loading..." : "Fetch App Details"}
      </Button>
    </div>
  );
}
