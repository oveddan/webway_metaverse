import { useCallback } from "react";
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
  const { data, isError, isLoading, write } = useContractWrite(
    {
      addressOrName: "0xecb504d39723b0be0e3a9aa33d646642d1051ee1",
      contractInterface:
        deployedContracts[31337].localhost.contracts.Webway.abi,
      signerOrProvider: provider,
    },
    "toggleEffect"
  );

  const toggleEffect = useCallback(
    (name: string) => {
      write({
        args: [name],
      });
    },
    [write]
  );

  return toggleEffect;
};
