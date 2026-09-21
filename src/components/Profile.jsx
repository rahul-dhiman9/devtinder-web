import { useSelector } from "react-redux";
import EditPRofile from "./EditPRofile";

const Profile = () => {
  const user = useSelector((store) => store.user);

  return (
    user && (
      <div>
        <EditPRofile user={user} />
      </div>
    )
  );
};

export default Profile;
