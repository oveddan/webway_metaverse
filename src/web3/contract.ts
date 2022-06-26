import { useCallback, useState } from "react";
import { useContractWrite, useProvider } from "wagmi";

import deployedContracts from "./contracts/hardhat_contracts.json";

export const useAddEffectContract = () => {
  const provider = useProvider();
  const { data, isError, isLoading, write } = useContractWrite(
    {
      addressOrName: "0xecb504d39723b0be0e3a9aa33d646642d1051ee1",
      contractInterface:
        deployedContracts[31337].localhost.contracts.Webway.abi,
      signerOrProvider: provider,
    },
    "addEffect"
  );
};

export const useToggleEffectContract = () => {
  const provider = useProvider();
  const [applied, setApplied] = useState<{
    [effectId: string]: {
      processing: boolean;
      error?: boolean;
    };
  }>({});
  const { data, isError, isLoading, writeAsync } = useContractWrite(
    {
      addressOrName: "0xecb504d39723b0be0e3a9aa33d646642d1051ee1",
      contractInterface:
        deployedContracts[31337].localhost.contracts.Webway.abi,
      signerOrProvider: provider,
    },
    "toggleEffect"
  );

  const toggleEffect = useCallback(
    async (effectId: string) => {
      if (applied[effectId].processing) return;
      setApplied((existing) => ({
        ...existing,
        [effectId]: {
          processing: true,
        },
      }));

      try {
        await writeAsync({
          args: [effectId],
        });
      } catch (e) {
        setApplied((existing) => ({
          ...existing,
          [effectId]: {
            error: true,
            processing: false,
          },
        }));
        return;
      }
      setApplied((existing) => ({
        ...existing,
        [effectId]: {
          processing: false,
        },
      }));
    },
    [applied]
  );

  return toggleEffect;
};
