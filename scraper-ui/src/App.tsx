import React, { useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import ClimbingBoxLoader from "react-spinners/ClipLoader";

interface ScrapedData {
  headings?: string[];
  [key: string]: any; // For additional dynamic keys in the scraped data
}

const App: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [data, setData] = useState<ScrapedData | null>(null);
  const [loaded, setLoader] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    setLoader(true);
    e.preventDefault();
    try {
      const response = await axios.post<ScrapedData>(
        "http://localhost:5000/scrape",
        { url }
      );
      setData(response.data);
      setLoader(false);
    } catch (error) {
      console.error("Error scraping data:", error);
    }
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setUrl(e.target.value);
  };

  return (
    <div>
      <h1>Web Scraper</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={handleUrlChange}
          required
        />
        <button type="submit">Scrape</button>
      </form>
      <div>
        {loaded ? (
          <ClimbingBoxLoader
            color={"#36d7b7"}
            loading={loaded}
            size={15}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        ) : (
          <>
            {data && (
              <div>
                <h2>Scraped Data</h2>
                <pre>{JSON.stringify(data, null, 2)}</pre>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
