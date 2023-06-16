import Model from "./Model";
import { useState } from "react";
import { useCookies } from "react-cookie";

const ListHeader = ({ appName, getData }) => {
  const [cookies, setCookies, removeCookies] = useCookies(null);
  const [showModel, setShowModel] = useState(false);

  const signOut = () => {
    console.log("signout");
    removeCookies("Email");
    removeCookies("AuthToken");
    window.location.reload();
  };
  return (
    <div className="list-header">
      <h1 className="appName">{appName}</h1>
      <div className="button-container">
        <button className="edit-button" onClick={() => setShowModel(true)}>
          {/* create-btn */}
          Add New
        </button>
        <button className="delete-button" onClick={signOut}>
          {/* sign-out-btn */}
          Sign Out
        </button>
      </div>
      {showModel && (
        <Model mode={"create"} setShowModel={setShowModel} getData={getData} />
      )}
    </div>
  );
};

export default ListHeader;
