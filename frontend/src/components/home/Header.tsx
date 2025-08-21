import { SidebarComponent } from "./SidebarComponent";
import { ModalComponent } from "../ModalComponent";
import { useState } from "react";

export const Header = () => {
  const userInfo = {
    name: "Ezequiel Campos",
    email: "humberto@gmail.com",
    profileImage: "https://avatars.githubusercontent.com/u/209260967?v=4",
  };

  const [open, setOpen] = useState(false);

  const handleCloseModal = () => {
    setOpen(false);
  };
  const handleOpenModal = () => {
    setOpen(true);
  };

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm">
        <ModalComponent
          onClose={handleCloseModal}
          open={open}
          title="Profile"
          content={
            <>
              <div className="grid grid-cols-1">
                {
                  <div className="grid justify-center m-4">
                    <img
                      className="rounded-full w-60 m-4"
                      src={userInfo.profileImage}
                      alt={userInfo.name}
                    />
                    <p className="m-4">{userInfo.name}</p>
                    <p className="m-4">{userInfo.email}</p>
                  </div>
                }
              </div>
            </>
          }
        />
        <div className="flex-1">
          <SidebarComponent />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto"
          />
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Ezequiel campos"
                  src="https://avatars.githubusercontent.com/u/209260967?v=4"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a className="justify-between" onClick={handleOpenModal}>
                  Profile
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
