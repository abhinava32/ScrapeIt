import React, { useState, FormEvent, useEffect } from "react";
import axios from "axios";
import DataContainer from "../components/DataContainer";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/appComponents/Navbar";

export interface ScrapedData {
  headings?: string[];
  [key: string]: any; // For additional dynamic keys in the scraped data
}

const App: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [data, setData] = useState<ScrapedData | null>(null);
  const [loading, setLoader] = useState<boolean>(false);
  const [cooldown, setCooldown] = useState<boolean>(false);
  const [started, setStarted] = useState<boolean>(false);
  const [model, setModel] = useState("gpt-4o-mini");
  const [errMsg, setErrMsg] = useState<string>("");
  const user = useSelector((state: RootState) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.isLoggedIn) {
      navigate(`/`);
    }

    if (location.state?.showToast) {
      toast.success("Login SuccessFull");
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, []);

  useEffect(() => {
    if (loading) {
      document.title = "loading...";
    } else {
      document.title = "Scrape2Data";
    }
  }, [loading]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setStarted(true);
    if (loading || cooldown) return;

    setLoader(true);
    setCooldown(true);
    try {
      const response = await axios.post<ScrapedData>("/api/scrape", {
        url,
        model,
      });
      try {
        if (response.status === 200 && response.data) {
          setData(response.data);
        } else {
          console.log(`Request failed with status: ${response.status}`);
          setData(null);
          console.log("responsse is ", response.data.message);
          setErrMsg(response.data.message);
        }
      } catch (error) {
        console.error("Error processing response:", error);
        console.log("responsse is ", response.data.message);
        setErrMsg(response.data.message);
        setData(null);
      }
    } catch (error) {
      console.error("Error scraping data:", error);
      setData(null);
      const err = error as { response: { data: { message: string } } };
      setErrMsg(err.response.data.message);
    } finally {
      setLoader(false);
      setTimeout(() => setCooldown(false), 2000);
    }
  };

  return (
    <div>
      <Navbar></Navbar>
      <ToastContainer></ToastContainer>
      <div className="m-auto text-3xl text-blue-900 mt-28 text-center">
        <b>Scrape2Data</b>
      </div>
      <form
        onSubmit={handleSubmit}
        className="text-center mt-2 p-4 w-1/2 m-auto md:flex-row  flex flex-col items-center h-auto gap-4"
      >
        <div className="md:flex-row flex flex-col w-full gap-4">
          <div className="md:w-2/3 grow">
            <input
              type="text"
              placeholder="Enter URL"
              disabled={loading}
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
              }}
              required
              className="w-full focus:outline-none focus:ring-4 rounded border-2 border-gray-200 h-14 p-2"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || cooldown}
          className={`
      ${loading ? "cursor-not-allowed bg-gray-200" : "hover:bg-purple-800"}
      w-full md:w-1/4 h-14 mt-4 text-xl focus:outline-none text-white bg-blue-700  focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900`}
        >
          {loading ? "Loading..." : cooldown ? "Please wait..." : "Scrape"}
        </button>
      </form>

      <div className="h-2 w-4/5 border-4 border-gray-200 mx-auto mb-2"></div>
      <div>
        {loading ? (
          <img className="mx-auto" src="/Loader.gif" alt="Loader Image" />
        ) : (
          <>
            {data && Object.keys(data).length > 0 ? (
              <>
                <DataContainer data={data} />
              </>
            ) : // Only show "Site Not Reachable" if URL was entered
            started ? (
              <div className="text-center p-4">
                <img
                  src="/not_reachable.svg"
                  className="w-80 mx-auto h-80"
                  alt=""
                />
                <p className="text-3xl text-red-600">{errMsg}</p>
              </div>
            ) : (
              <div></div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
