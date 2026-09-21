import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../redux/connectionSlice";

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
  return (
    <div className="text-center">
      <h1 className="text-3xl  text-bold my-10 ">Connections</h1>

      {connections.map((connection) => {
        const { firstName, lastName, age, gender, photoUrl, skills, about ,_id} =
          connection;
        return (
          <div  key={_id} className="m-4 flex justify-center p-4 rounded-2xl bg-base-200 w-1/2 mx-auto">
            <div className="">
              {" "}
              <img
                alt="photo"
                className="w-20 h-20 rounded-full"
                src={`${BASE_URL}${photoUrl}`}
              />
            </div>
            <div className="mx-20 text-left">
              <h2 className="font-bold text-xl">
                {firstName + " " + lastName}
              </h2>
              <p>{age}</p>
              <p>{gender}</p>
              <p>{about}</p>
              <p>{skills}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;
