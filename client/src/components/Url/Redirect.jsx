import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function Redirect() {
  //   const getBrowserInfo = () => {
  //     const userAgent = window.navigator.userAgent;
  //     console.log(userAgent);
  //     if (userAgent.indexOf("Firefox") > -1) {
  //       return "Mozilla Firefox";
  //     } else if (userAgent.indexOf("SamsungBrowser") > -1) {
  //       return "Samsung Internet";
  //     } else if (
  //       userAgent.indexOf("Opera") > -1 ||
  //       userAgent.indexOf("OPR") > -1
  //     ) {
  //       return "Opera";
  //     } else if (userAgent.indexOf("Trident") > -1) {
  //       return "Microsoft Internet Explorer";
  //     } else if (userAgent.indexOf("Edge") > -1) {
  //       return "Microsoft Edge";
  //     } else if (userAgent.indexOf("Chrome") > -1) {
  //       return "Google Chrome";
  //     } else if (userAgent.indexOf("Safari") > -1) {
  //       return "Apple Safari";
  //     } else {
  //       return "Unknown";
  //     }
  //   };

  // Get operating system information
  const getOsInfo = () => {
    const platform = window.navigator.platform;
    return platform.includes("Win")
      ? "Windows"
      : platform.includes("Mac")
      ? "MacOS"
      : platform.includes("Linux")
      ? "Linux"
      : platform.includes("iPhone") || platform.includes("iPad")
      ? "iOS"
      : platform.includes("Android")
      ? "Android"
      : "Unknown";
  };

  // Fetch user location data
  const fetchUserLocation = async () => {
    try {
      const { data } = await axios.get("https://ipapi.co/json/");
      return data;
    } catch (error) {
      return {};
    }
  };

  const { shortUrl } = useParams();

  //   const [msg, setMsg] = useState("Redirecting...");
  // const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      //   const browser = getBrowserInfo();
      const os = getOsInfo();
      try {
        const userLocation = await fetchUserLocation();

        const userData = {
          os: os,
          //   browser: browser,
          ip: userLocation.ip || "Unknown",
          country: userLocation.country_name || "Unknown",
          region: userLocation.region || "Unknown",
          city: userLocation.city || "Unknown",
          coord:
            userLocation.latitude + "," + userLocation.longitude || "Unknown",
          org: userLocation.org || "Unknown",
          postal: userLocation.postal || "Unknown",
          timezone: userLocation.timezone || "Unknown",
        };

        const { data } = await axios.post(
          `${import.meta.env.VITE_BACKEND_API_URL}/api/url/${shortUrl}`,
          userData
        );
        toast.success(data.message);
        window.location.href = data.url.originalUrl;
      } catch (err) {
        if (err?.response?.status) {
          toast.error(err.response.data.message);
        }
        // setMsg("Nothing Found");
      } finally {
        // setIsLoading(false);
      }
    };

    fetchData();
  }, [shortUrl]);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center min-h-screen pt-20">
      <button
        disabled=""
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
      >
        <svg
          aria-hidden="true"
          role="status"
          className="inline w-4 h-4 me-3 text-white animate-spin"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="#E5E7EB"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentColor"
          />
        </svg>
        {/* <h1
        //   className={`text-4xl dark:text-white font-bold ${
        //     isLoading ? "animate-grow" : ""
        //   }`}
        >
          Redirecting...
        </h1> */}
      </button>
    </section>
  );
}

export default <Redirect />;
