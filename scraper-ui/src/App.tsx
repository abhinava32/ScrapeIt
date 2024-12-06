import React, { useState, FormEvent } from "react";
import axios from "axios";
import DataContainer from "./components/DataContainer";

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setStarted(true);
    if (loading || cooldown) return;

    setLoader(true);
    setCooldown(true);
    try {
      const response = await axios.post<ScrapedData>("/api/scrape", { url });
      try {
        if (response.status === 200 && response.data) {
          setData(response.data);
        } else {
          console.log(`Request failed with status: ${response.status}`);
          setData(null);
        }
      } catch (error) {
        console.error("Error processing response:", error);
        setData(null);
      }
    } catch (error) {
      console.error("Error scraping data:", error);
    } finally {
      setLoader(false);
      setTimeout(() => setCooldown(false), 2000);
    }
  };

  return (
    <div>
      <div className="m-auto text-5xl mt-10 text-center">Scrape It</div>
      <form
        onSubmit={handleSubmit}
        className=" text-center mt-8 p-4 w-1/2 m-auto flex items-center h-24"
      >
        <input
          type="text"
          placeholder="Enter URL"
          disabled={loading}
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
          }}
          required
          className="focus:outline-none focus:ring-4 rounded border-2 border-gray-200 h-14 p-2 mr-8 w-2/3"
        />
        <button
          type="submit"
          disabled={loading || cooldown}
          className={`
            ${
              loading ? "cursor-not-allowed bg-gray-200" : "hover:bg-purple-800"
            }
            w-1/4 h-14 text-2xl focus:outline-none text-white bg-purple-700  focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900`}
        >
          {loading ? "Loading..." : cooldown ? "Please wait..." : "Scrape"}
        </button>
      </form>
      <div className="h-2 w-4/5 border-4 border-gray-200 mx-auto mb-10"></div>
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
                <p className="text-3xl">Site Not Reachable</p>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
