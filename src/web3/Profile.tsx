import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";
import { Metamask } from "./icons";

function Profile() {
  const { data: account } = useAccount();
  const { connect, connectors, error, isConnecting, pendingConnector } =
    useConnect();

  if (account && !isConnecting) {
    return null;
  }

  return (
    <div
      id="crypto-modal"
      className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full"
    >
      <div className="relative p-4 w-full max-w-md h-full md:h-auto">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <button
            type="button"
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
            data-modal-toggle="crypto-modal"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
          <div className="py-4 px-6 rounded-t border-b dark:border-gray-600">
            <h3 className="text-base font-semibold text-gray-900 lg:text-xl dark:text-white">
              Connect wallet
            </h3>
          </div>
          <div className="p-6">
            <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Connect with a wallet providers.
            </p>
            <ul className="my-4 space-y-3">
              {connectors.map((connector) => (
                <li key={connector.id}>
                  {connector.name === "MetaMask" && (
                    <a
                      href="#"
                      // @ts-ignore
                      disabled={!connector.ready}
                      className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                      onClick={(e) => {
                        e.preventDefault();
                        connect(connector);
                      }}
                    >
                      <Metamask />
                      <span className="flex-1 ml-3 whitespace-nowrap">
                        MetaMask
                      </span>
                      <span className="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">
                        Popular
                      </span>
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  //   return (
  //     <div
  //       className="overflow-y-auto overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 md:inset-0 h-modal md:h-full z-100">
  //       <div className="relative p-4 w-full max-w-md h-full md:h-auto">
  //         <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
  //             <div className="p-6 space-y-6">
  //        {connectors.map((connector) => (
  //         <button
  //           disabled={!connector.ready}
  //           key={connector.id}
  //           onClick={() => connect(connector)}
  //         >
  //           {connector.name}
  //           {!connector.ready && ' (unsupported)'}
  //           {isConnecting &&
  //             connector.id === pendingConnector?.id &&
  //             ' (connecting)'}
  //         </button>
  //       ))}
  //             </div>
  //             {error && (<div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">

  //       <div>{error.message}</div>
  //             </div>)}
  //         </div>
  //     </div>
  // </div>
  //   )
}

export default Profile;
