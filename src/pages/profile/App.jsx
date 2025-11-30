import { SiteFooter } from "@qwhub/site/Footer";
import { SiteHeader } from "@qwhub/site/Header";
import { useAuth } from "@qwhub/site/hooks/useAuth";
import React, { useState } from "react";

const SuccessIcon = () => {
  return (
    <svg
      className="w-16 h-16 text-green-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
};

export const App = () => {
  const { user, loading } = useAuth();
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Save clicked", { nickname, password, repeatPassword });
    setIsSubmitted(true);
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
    ? `Welcome to QuakeWorld ${user.username}#${user.discriminator}!`
    : "Welcome to QuakeWorld!";

  const avatarUrl = user?.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/${user?.discriminator ? parseInt(user.discriminator) % 5 : 0}.png`;

  return (
    <>
      <SiteHeader />
      <div className="mt-4 mb-6 flex justify-center">
        <div className="w-full max-w-4xl flex gap-6 items-start">
          {/* Left side - Avatar and Nickname */}
          {user && (
            <div className="flex-shrink-0 flex flex-col items-center">
              <img
                src={avatarUrl}
                alt={`${user.username}'s avatar`}
                className="w-32 h-32 rounded-full border-2 border-[#5865F2] mb-3"
              />
              <div className="text-white font-medium text-center">
                {user.username}#{user.discriminator}
              </div>
            </div>
          )}

          {/* Right side - Form or Success Message */}
          <div className="flex-1">
            {isSubmitted ? (
              <div className="bg-white/5 rounded-lg p-6 flex flex-col items-center text-center space-y-4">
                <SuccessIcon />
                <div className="text-white text-lg space-y-2">
                  <p className="font-semibold">
                    {user?.username}, you can return to your client now and
                    login.
                  </p>
                  <p>With your nickname and password.</p>
                  <p className="text-green-400 font-medium">Happy Fragging!</p>
                </div>
              </div>
            ) : (
              <form className="bg-white/5 rounded-lg p-6 space-y-4">
                <h2 className="text-2xl font-semibold mb-4">{welcomeText}</h2>
                <div className="text-gray-300 mb-6 space-y-2">
                  <p>
                    Before you can start playing, you need to create a nickname
                    and password so that you can login!
                  </p>
                  <p className="text-yellow-400 font-medium">
                    Please note, that you cannot change your nickname, once you
                    have created it!
                  </p>
                </div>

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
            )}
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
};

export default App;

