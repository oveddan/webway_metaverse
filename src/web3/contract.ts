import { useCallback, useMemo, useState } from "react";
import { useContract, useContractWrite, useProvider, useSigner } from "wagmi";

import deployedContracts from "./contracts/localhost_Webway.json";

export const useToggleEffectContract = (tokenId: number, effectId: string) => {
  // const provider = useProvider();
  const [applied, setApplied] = useState<{
    [effectId: string]: {
      processing: boolean;
      error?: boolean;
    };
  }>({});
  const { data: signerData } = useSigner();

  const args = useMemo(() => [tokenId, effectId], [tokenId, effectId]);

  const { data, isError, isLoading, writeAsync } = useContractWrite(
    {
      addressOrName: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      contractInterface: deployedContracts,
      // contractInterface:
      //   deployedContracts[31337].localhost.contracts.Webway.abi,
      signerOrProvider: signerData,
    },
    "toggleEffect",
    {
      args,
    }
  );

  const toggleEffect = useCallback(async () => {
    if (applied[effectId]?.processing) return;
    setApplied((existing) => ({
      ...existing,
      [effectId]: {
        processing: true,
      },
    }));

    try {
      await writeAsync();
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
  }, [applied, writeAsync]);

  return { toggleEffect, applied };
};
