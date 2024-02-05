import { HashLoader } from 'react-spinners';

export default function Loader() {
  return (
    <div className="flex justify-center z-50 items-center fixed top-0 bottom-0 left-0 right-0 bg-black/25">
      <HashLoader color="#3742d7" size={50} />
    </div>
  );
}
