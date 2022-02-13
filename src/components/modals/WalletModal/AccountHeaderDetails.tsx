import Davatar from "@davatar/react";
import { Menu } from "@headlessui/react";
import { useWeb3React } from "@web3-react/core";
import { Dispatch, SetStateAction, useCallback } from "react";
import { FaAngleDown, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { shortenAddress } from "../../../util/string";
import { WalletView } from ".";

type AccountHeaderDetailsProps = {};

export const AccountHeaderDetails = ({}: AccountHeaderDetailsProps) => {
  const { active, account, connector, activate, error, deactivate } =
    useWeb3React();

  const handleDeactivate = useCallback(() => {
    deactivate();
  }, [deactivate]);

  if (!account) {
    return (
      <div className="flex flex-row justify-between items-center mx-4 my-3">
        <div className="flex flex-row items-center my-2">
          <FaUserCircle size={36} className="text-gray-400" />
          <h3 className="text-lg mx-2 font-semibold text-white">My Wallet</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row justify-between items-center mx-4 my-3">
      <div>
        <Menu>
          <Menu.Button className="flex flex-row items-center my-2">
            <Davatar size={36} address={account as string} />
            <h3 className="text-lg mx-2 font-semibold text-white">My Wallet</h3>
            <FaAngleDown className="text-white" />
          </Menu.Button>
          <Menu.Items className="absolute bg-white flex flex-col rounded py-2 px-3 min-w-[200px]">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleDeactivate}
                  className="flex items-center"
                >
                  <FaSignOutAlt className="mr-2 text-black" />{" "}
                  <h3 className="text-black">Log out</h3>
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
      <h3 className="text-white font-semibold">
        {shortenAddress(account as string)}
      </h3>
    </div>
  );
};
