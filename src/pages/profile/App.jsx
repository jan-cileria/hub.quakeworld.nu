import { SiteFooter } from "@qwhub/site/Footer";
import { SiteHeader } from "@qwhub/site/Header";
import { useAuth } from "@qwhub/site/hooks/useAuth";
import React, { useState } from "react";

export const App = () => {
  const { user, loading } = useAuth();
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Save clicked", { nickname, password, repeatPassword });
  };

  const handleCancel = () => {
    setNickname("");
    setPassword("");
    setRepeatPassword("");
  };

  if (loading) {
    return (
      <>
        <SiteHeader />
        <div className="mt-4 mb-6 flex justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
        <SiteFooter />
      </>
    );
  }

  const welcomeText = user
    ? `Welcome ${user.username}#${user.discriminator}`
    : "Welcome";

  return (
    <>
      <SiteHeader />
      <div className="mt-4 mb-6 flex justify-center">
        <div className="w-full max-w-md">
          <form className="bg-white/5 rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-semibold mb-6">{welcomeText}</h2>

            <div>
              <label
                htmlFor="nickname"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Specify a nickname
              </label>
              <input
                type="text"
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5865F2] focus:border-transparent"
                placeholder="Enter your nickname"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5865F2] focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label
                htmlFor="repeatPassword"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Repeat Password
              </label>
              <input
                type="password"
                id="repeatPassword"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5865F2] focus:border-transparent"
                placeholder="Repeat your password"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-md text-sm font-medium transition-colors"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <SiteFooter />
    </>
  );
};

export default App;

