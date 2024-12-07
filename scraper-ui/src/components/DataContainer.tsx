import React from "react";
import { ScrapedData } from "../App";
import { DataField } from "./DataField";
import { toast, Toaster } from "react-hot-toast";
import { IoCopyOutline } from "react-icons/io5";

interface DataContainerProps {
  data: ScrapedData;
}

const DataContainer: React.FC<DataContainerProps> = ({ data }) => {
  // Keep existing data structure
  data = data["data"];
  const businessDetails = data["Business_Details"] || {};
  const businessType = businessDetails["businessType"];
  const products = businessDetails["products"] || [];
  const description = businessDetails["description"] || "";
  const extraInfo = businessDetails["extraInfo"] || "";
  const reason = businessDetails["reason"] || "";

  const contactDetails = data["Contact_Details"] || {};
  const name = contactDetails["name"] || "";
  const address = contactDetails["address"] || {};
  const country = contactDetails["country"] || "";
  const email = contactDetails["email"] || "";
  const phone = contactDetails["phone"] || "";
  const fax = contactDetails["fax"] || "";

  const handleCopyClick = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success(`Copied to clipboard! ${textToCopy}`); // Add toast notification
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast.error("Failed to copy text!"); // Add error toast
    }
  };
  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" /> {/* Add Toaster component */}
      {/* Business Type Header */}
      <div className="mb-6 p-4 text-center bg-purple-800 text-white rounded-lg">
        <h2 className="text-2xl font-bold">Business Type</h2>
        <p className="text-4xl mt-2">{businessType || "Not specified"}</p>
      </div>
      <div className="flex flex-row w-full">
        {/* Contact Details Section */}
        <div className="w-1/2 p-6 ">
          <DataField label="Name" value={name} onCopy={handleCopyClick} />
          <DataField label="Phone" value={phone} onCopy={handleCopyClick} />
          <DataField label="Fax" value={fax} onCopy={handleCopyClick} />
          <DataField label="Email" value={email} onCopy={handleCopyClick} />
          <DataField label="Country" value={country} onCopy={handleCopyClick} />
          <div className="overflow-auto">
            <DataField
              label="Address"
              value={address["fullAddress"]}
              onCopy={handleCopyClick}
            />
            <pre>{JSON.stringify(address, null, 2)}</pre>
          </div>
        </div>

        {/* Business Details Section */}
        <div className="w-1/2 border-4 border-gray-400 p-4 items-center gap-2">
          <div>
            <DataField
              label="About"
              value={description}
              onCopy={handleCopyClick}
            />
            <DataField
              label="Extra Info"
              value={extraInfo}
              onCopy={handleCopyClick}
            />
            <DataField
              label="Reason for Business Type"
              value={reason}
              onCopy={handleCopyClick}
            />
          </div>

          <div>
            <p>
              <b>Products: </b>
            </p>
            <ul>
              {products.map((product: any, index: number) => (
                <li key={index} className="p-4">
                  <p>
                    <b>{product["name"]}</b>
                    <button
                      className="ml-2 hover:pointer"
                      onClick={() => handleCopyClick(product["name"])}
                    >
                      <IoCopyOutline className="w-4 h-4" />
                    </button>
                  </p>
                  <p>{product["description"]}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataContainer;
