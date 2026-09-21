import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addRequest, removeRequest } from "../redux/requestSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.request);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      console.log(res.data.data);

      dispatch(addRequest(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const reviewRequest = async (status, req_id) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/review" + "/" + status + "/" + req_id,
        {},
        { withCredentials: true },
      );
if(res){
        dispatch(removeRequest(req_id));
}
    } catch (err) {
      console.error(err);
    }
  };

  if (requests === null) {
    return <h1>Loading...</h1>;
  }

  if (requests.length === 0) {
    return (
      <h1 className="text-center text-3xl font-semibold my-20">
        No requests found
      </h1>
    );
  }
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold my-10">Requests</h1>

      {requests.map((request) => {
        const {
          _id,
          firstName,
          lastName,
          age,
          gender,
          photoUrl,
          skills,
          about,
        } = request.fromUserId;

        return (
          <div
            key={_id}
            className="m-4 flex flex-col md:flex-row items-center gap-6
                   p-6 rounded-2xl bg-base-200
                   w-[90%] md:w-3/4 lg:w-1/2
                   mx-auto shadow-md"
          >
            {/* Photo */}
            <div className="shrink-0">
              <img
                alt="photo"
                className="w-24 h-24 rounded-full object-cover"
                src={`${BASE_URL}${photoUrl}`}
              />
            </div>

            {/* User Information */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-bold text-xl">
                {firstName} {lastName}
              </h2>

              <p className="text-sm mt-1">
                {age} {"  "} {gender}
              </p>

              <p className="mt-2 text-sm">{about}</p>

              <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                {skills?.map((skill) => (
                  <span key={skill} className="badge badge-primary">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-row md:flex-col gap-3 shrink-0">
              <button
                className="btn btn-secondary"
                onClick={() => reviewRequest("accepted", request._id)}
              >
                Accept
              </button>
              <button
                className="btn btn-primary"
                onClick={() => reviewRequest("rejected", request._id)}
              >
                Reject
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
