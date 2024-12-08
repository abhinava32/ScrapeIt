import { IoCopyOutline } from "react-icons/io5";

interface DataFieldProps {
  label: string;
  value: string | undefined;
  onCopy: (value: string) => void;
}

export const DataField: React.FC<DataFieldProps> = ({
  label,
  value,
  onCopy,
}) => {
  return (
    <div className="flex w-full mb-2 border-b-2 ">
      <div className="">
        <p>
          <b>{label}:</b> {value || "Not specified"}
        </p>
      </div>
      <div className="">
        {value && (
          <>
            <button
              className="ml-2 hover:pointer"
              onClick={() => onCopy(value)}
            >
              <IoCopyOutline className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
