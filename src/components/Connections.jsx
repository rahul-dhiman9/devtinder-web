import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../redux/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);
  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      // console.log(res.data.data);
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (connections === null) {
    return <h1>Loading...</h1>;
  }

  if (connections.length === 0) {
    return <h1>No connections found</h1>;
  }

  const getPhotoUrl = (photoUrl) => {
    if (!photoUrl) {
      return "/default-user.png";
    }

    if (photoUrl.startsWith("http")) {
      return photoUrl;
    }

    return `${BASE_URL}${photoUrl}`;
  };
  return (
    <div className="px-4 text-center">
      <h1 className="my-6 text-2xl font-bold sm:my-10 sm:text-3xl">
        Connections
      </h1>

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 pb-28">
        {connections.map((connection) => {
          const {
            firstName,
            lastName,
            age,
            gender,
            photoUrl,
            skills,
            about,
            _id,
          } = connection;

          return (
            <div
              key={_id}
              className="flex flex-col items-center relative gap-4 rounded-2xl bg-base-200 p-4 sm:flex-row sm:items-start sm:gap-6"
            >
              <Link to={"/chat/" + _id}>
                <button className="absolute right-10 btn btn-primary top-10">
                  Chat
                </button>
              </Link>
              <img
                alt={`${firstName} ${lastName}`}
                className="h-20 w-20 shrink-0 rounded-full object-cover"
                src={getPhotoUrl(photoUrl)}
              />

              <div className="min-w-0 flex-1 wrap-break-word text-center sm:text-left">
                <h2 className="text-lg font-bold sm:text-xl">
                  {firstName + " " + lastName}
                </h2>
                {(age || gender) && (
                  <p className="text-sm opacity-70">
                    {[age, gender].filter(Boolean).join(" · ")}
                  </p>
                )}
                <p className="mt-2">{about}</p>
                {skills?.length > 0 && (
                  <p className="mt-1 text-sm">
                    {Array.isArray(skills) ? skills.join(", ") : skills}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
