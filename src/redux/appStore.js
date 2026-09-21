import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/userSlice"
import feedReducer from "../redux/feedSlice"
import connectionReducer from "../redux/connectionSlice"
import requestReducer from "../redux/requestSlice"

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed:feedReducer,
    connections:connectionReducer,
    request:requestReducer
  },
});
 
export default appStore;
