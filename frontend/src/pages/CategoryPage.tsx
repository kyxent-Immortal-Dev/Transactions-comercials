import { CategoryList } from "../components/CategoryList";

export const CategoryPage = () => {
  return (
    <>
      <div className="grid grid-cols-1 pt-10 m-20 pb-200 bg-white rounded-lg">
        <CategoryList />
      </div>
    </>
  );
};
