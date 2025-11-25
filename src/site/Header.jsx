import { FeaturedStreams } from "@qwhub/Streams";
import SiteNavigation from "@qwhub/site/Navigation";
import { SettingsDrawer } from "@qwhub/site/settings/ServerSettings.jsx";
import { useAuth } from "@qwhub/site/hooks/useAuth";
import classNames from "classnames";

export const SiteHeader = () => {
  const { user, loading, logout } = useAuth();
  const showStreamsOnSm = ["/", "/players/"].includes(location.pathname);

  const handleLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (apiUrl) {
      window.location.href = `${apiUrl}/auth/discord/login`;
    } else {
      console.error("VITE_API_URL is not defined");
    }
  };

  return (
    <div>
      <SettingsDrawer />

      <div>
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="flex items-center lg:space-x-4 my-2">
            <a href="/" className="lg:mr-4">
              <img
                src="https://hub.quakeworld.nu/assets/img/quakeworld_hub_logo.png"
                width="95"
                height="50"
                alt="QuakeWorld Hub"
                className="w-[48px] sm:w-[95px] sm:h-[50px] mr-2"
              />
            </a>
            <div className="lg:hidden grow">
              <SiteNavigation />
            </div>
            <div
              className={classNames("mt-2 lg:mt-0", {
                "hidden sm:block": !showStreamsOnSm,
              })}
            >
              <FeaturedStreams />
            </div>
          </div>
          <div className="flex items-center mt-2 lg:mt-0">
            {loading ? (
              <div className="ml-auto px-4 h-[56px] flex items-center text-sm text-gray-600">
                Loading...
              </div>
            ) : user ? (
              <div className="ml-auto flex items-center gap-3">
                <button
                  className="px-4 h-[56px] bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-md text-sm font-medium transition-colors whitespace-nowrap"
                  title="My Profile"
                >
                  My Profile
                </button>
                <button
                  onClick={logout}
                  className="px-4 h-[56px] bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium transition-colors whitespace-nowrap"
                  title="Logout"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="ml-auto px-4 h-[56px] bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-md text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2"
                title="Login with Discord"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                <span className="hidden sm:inline">Discord Login</span>
                <span className="sm:hidden">Login</span>
              </button>
            )}
          </div>
        </div>
        <div className="hidden lg:flex mt-1">
          <SiteNavigation />
        </div>
      </div>
    </div>
  );
};
