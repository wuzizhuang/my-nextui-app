import Swal from "sweetalert2";

export const showAlert = (options) => {
  return Swal.fire(options);
};

export default function Alert() {
  return <div>Alert</div>;
}
