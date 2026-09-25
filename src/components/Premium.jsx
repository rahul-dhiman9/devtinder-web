import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";

const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false);
  const [membershipType, setMembershipType] = useState(null);

  const verifyPremiumUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/premium/verify", {
        withCredentials: true,
      });

      setIsUserPremium(res.data.isPremium);
      setMembershipType(res.data.memberShipType);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    verifyPremiumUser();
  }, []);

  const handleBuyClick = async (type) => {
    try {
      const order = await axios.post(
        BASE_URL + "/payment/create",
        {
          memberShipType: type,
        },
        {
          withCredentials: true,
        },
      );

      const { amount, keyId, currency, notes, orderId } = order.data;

      const options = {
        key: keyId,
        amount,
        currency,
        order_id: orderId,
        name: "DevTinder",
        description: "Connect to other devs",
        prefill: {
          name: notes.firstName + " " + notes.lastName,
        },
        handler: verifyPremiumUser,
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
    }
  };

  const canBuySilver = !isUserPremium;

  const canBuyGold = !isUserPremium || membershipType === "silver";

  return (
    <div className="m-10 py-28">
      <div className="flex w-full flex-col lg:flex-row">
        {/* SILVER */}
        <div className="card bg-base-300 rounded-box grid h-auto grow place-items-center m-2 p-2">
          <h1 className="text-2xl font-bold bg-gray-600 rounded-2xl m-2 p-2">
            Silver Membership
          </h1>

          <ul className="m-3">
            <li>- Chat with other people on the app</li>
            <li>- 100 connection requests per day</li>
            <li>- Blue tick</li>
            <li>- 3 months duration</li>
          </ul>

          {canBuySilver ? (
            <button
              className="btn btn-primary"
              onClick={() => handleBuyClick("silver")}
            >
              Buy now
            </button>
          ) : (
            <button className="btn btn-disabled">
              {membershipType === "gold"
                ? "Already Gold Member"
                : "Already Silver Member"}
            </button>
          )}
        </div>

        <div className="divider lg:divider-horizontal">OR</div>

        {/* GOLD */}
        <div className="card bg-base-300 rounded-box grid h-auto grow place-items-center m-2 p-2">
          <h1 className="text-2xl font-bold bg-amber-500 rounded-2xl m-2 p-2">
            Gold Membership
          </h1>

          <ul className="m-3">
            <li>- Chat with other people on the app</li>
            <li>- No limit on connection requests per day</li>
            <li>- Blue tick</li>
            <li>- 1 year duration</li>
          </ul>

          {canBuyGold ? (
            <button
              className="btn btn-secondary"
              onClick={() => handleBuyClick("gold")}
            >
              {membershipType === "silver" ? "Upgrade to Gold" : "Buy now"}
            </button>
          ) : (
            <button className="btn btn-disabled">Already Gold Member</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Premium;
