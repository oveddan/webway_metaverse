import { AvailableModifications } from "../Scene/Config/types/modifications";
import { AdjustmentsIcon } from "@heroicons/react/solid";
import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useOwner } from "../Scene/lib/queries";

export type AppliedModifications = {
  [key: string]: {
    applied: boolean;
    processing: boolean;
    error: boolean;
  };
};

const ToggleCheckbox = ({
  modifierId: key,
  applied,
  processing,
  toggle,
}: {
  modifierId: string;
  applied: boolean;
  processing: boolean;
  toggle: (key: string) => void;
}) => {
  const handleClick = useCallback(
    (e: SyntheticEvent) => {
      // e.preventDefault();
      // e.stopPropagation();

      toggle(key);
    },
    [key, toggle]
  );

  return (
    <input
      type="checkbox"
      id={`default-toggle-${key}`}
      className="sr-only peer"
      checked={applied}
      onChange={handleClick}
      disabled={processing}
    />
  );
};

const ModificationControls = ({
  toggleApplied,
  applied,
  modifications,
  canAlwaysModify,
  tokenId,
}: {
  toggleApplied: (key: string) => void;
  applied: AppliedModifications;
  modifications?: AvailableModifications;
  canAlwaysModify?: boolean;
  tokenId?: string;
}) => {
  const cancelPropagation = useCallback((event: SyntheticEvent) => {
    event.stopPropagation();
  }, []);
  const { data: account } = useAccount();

  const spaceOwner = useOwner(tokenId);

  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!account?.address || !spaceOwner) {
      setIsOwner(false);
      return;
    }

    const isOwner = account.address.toLowerCase() === spaceOwner.toLowerCase();

    setIsOwner(isOwner);
  }, [account?.address, spaceOwner]);

  const canModify = isOwner || canAlwaysModify;

  return (
    <aside
      className="w-100 absolute top-2 left-2"
      aria-label="Sidebar"
      onClick={cancelPropagation}
    >
      <div className="overflow-y-auto py-4 px-3 bg-gray-50 rounded dark:bg-gray-800">
        <ul className="space-y-2">
          <li>{`Space Token: ${tokenId}`}</li>
          {spaceOwner && <li>{`Owned by: ${spaceOwner}`}</li>}
          {modifications && canModify && (
            <>
              <li className="font-bold" key="header">
                Space Modifications
              </li>
              {Object.entries(modifications).map(([key, modification]) => (
                <li key={key}>
                  <span className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white">
                    <AdjustmentsIcon className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                    <span className="flex-1 ml-3 text-left whitespace-nowrap">
                      {modification.description}
                    </span>
                    {/* <svg sidebar-toggle-item className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg> */}
                    <label
                      htmlFor={`default-toggle-${key}`}
                      className="inline-flex relative items-center cursor-pointer"
                    >
                      <ToggleCheckbox
                        key={key}
                        modifierId={key}
                        applied={!!applied[key]?.applied}
                        processing={!!applied[key]?.processing}
                        toggle={toggleApplied}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
                    </label>
                  </span>
                </li>
              ))}
            </>
          )}
        </ul>
      </div>
    </aside>
  );
};

export default ModificationControls;
