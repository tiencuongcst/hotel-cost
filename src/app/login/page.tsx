"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setErrorMessage("");

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userId,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      router.replace("/dashboard/overview");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <form
        onSubmit={handleLogin}
        className="w-[420px] rounded-xl bg-white p-8 shadow"
      >
        <h1 className="mb-6 text-2xl font-bold">Login</h1>

        <div className="space-y-4">
          <input
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            placeholder="User ID"
            className="w-full rounded border px-4 py-3"
          />

          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            type="password"
            className="w-full rounded border px-4 py-3"
          />

          {errorMessage && (
            <div className="text-sm text-red-600">{errorMessage}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-black px-4 py-3 text-white disabled:opacity-60"
          >
            {loading ? "Đang đăng nhập..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}