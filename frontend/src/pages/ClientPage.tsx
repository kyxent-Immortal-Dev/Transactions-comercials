import { ClientComponent } from "../components/ClientComponent";

export const ClientPage = () => {
  return (
    <>
      <div className="grid grid-cols-1 pt-10 m-20 pb-200 bg-white rounded-lg">
        <ClientComponent />
      </div>
    </>
  );
};