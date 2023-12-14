"use client";

import Swal from "sweetalert2";

interface Props {}

const ViewAlert: React.FC<Props> = () => {
  const showAlert = () => {
    return Swal.fire({
      title: "Error!",
      text: "Do you want to continue",
      icon: "error",
      confirmButtonText: "Cool",
    });
  };

  return (
    <>
      <button onClick={showAlert}>Show Alert</button>
    </>
  );
};

export default ViewAlert;
