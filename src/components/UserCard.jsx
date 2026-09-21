import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../redux/feedSlice";

const UserCard = ({ user }) => {
  // console.log(user);

  const dispatch = useDispatch();
  const { firstName, lastName, gender, age, photoUrl, about, skills, _id } =
    user;

  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true },
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      {
        console.log("STATUS:", err.response?.status);
        console.log("DATA:", err.response?.data);
        console.log("ERROR:", err);
      }
    }
  };

  return (
    <div className="card bg-base-300 w-80 shadow-sm">
      <figure>
        <img
          src={
            photoUrl?.startsWith("blob:") || photoUrl?.startsWith("http")
              ? photoUrl
              : `${BASE_URL}${photoUrl}`
          }
          alt="user"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{firstName + "" + lastName}</h2>
        <div className="flex">
          {age && <span>{age} ,</span>}
          {gender && <span> {gender}</span>}
        </div>
        {skills && <p>{skills}</p>}
        {about && <p>{about}</p>}
        <div className="card-actions justify-center m-4 p-4 ">
          <button
            className="btn btn-primary"
            onClick={() => handleSendRequest("ignored", _id)}
          >
            Ignore
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleSendRequest("interested", _id)}
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
